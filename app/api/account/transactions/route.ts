import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import client from "@/app/lib/db";

export async function GET() {
  try {
    //get user session
    const session = await getServerSession(authOptions);

    //if no session/user, unauthenticated
    if (!session || !session.user?.username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //get user details from db
    const user = await client.user.findUnique({
      where: { username: session.user.username },
      include: { account: true },
    });

    //check if users account exists (would exist most probably)
    if (!user?.account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    //get transactions
    const transactions = await client.transaction.findMany({
      where: {
        OR: [{ senderId: user.account.id }, { receiverId: user.account.id }],
      },
      include: {
        sender: { include: { user: true } },
        receiver: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (e) {
    console.error(e);
  }
}
