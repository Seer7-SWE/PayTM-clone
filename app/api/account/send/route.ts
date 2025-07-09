import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import client from "@/app/lib/db";

const sendSchema = z.object({
  toUsername: z.string().trim().min(1, "Username is required"),
  amount: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, {
      message: "Amount must be greater than zero",
    }),
});

export async function POST(req: Request) {
  //get user session
  const session = await getServerSession(authOptions);

  //if no session/user, unauthenticated
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //get send request details and parse with zod validation
  const body = await req.json();
  const parsedBody = sendSchema.safeParse(body);
  //if errors, return
  if (!parsedBody.success) {
    const formatted = parsedBody.error.format();
    const toUsernameError = formatted.toUsername?._errors?.[0];
    const amountError = formatted.amount?._errors?.[0];

    return NextResponse.json(
      { error: toUsernameError || amountError || "Invalid input" },
      { status: 400 }
    );
  }

  const { toUsername, amount } = parsedBody.data;

  //get sender
  const sender = await client.user.findUnique({
    where: { username: session.user.username },
    include: { account: true },
  });

  //get receiver
  const receiver = await client.user.findUnique({
    where: { username: toUsername },
    include: { account: true },
  });

  //if no sender or receiver accounts, return (won't happen mostly)
  if (!sender?.account || !receiver?.account) {
    return NextResponse.json(
      {
        error: "Sender or Receiver account not found",
      },
      { status: 404 }
    );
  }

  //if trying to send more than balance
  if (sender.account.balance < amount) {
    return NextResponse.json(
      {
        error: "Insufficient funds",
      },
      { status: 400 }
    );
  }

  //transaction logic
  await client.$transaction([
    client.account.update({
      where: { id: sender.account.id },
      data: { balance: { decrement: amount } },
    }),
    client.account.update({
      where: { id: receiver.account.id },
      data: { balance: { increment: amount } },
    }),
    client.transaction.create({
      data: {
        amount: amount,
        senderId: sender.account.id,
        receiverId: receiver.account.id,
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    message: `Sent ₹${amount} to ${toUsername}`,
  });
}
