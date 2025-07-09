import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import client from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  //get user session
  const session = await getServerSession(authOptions);

  //if no session/user, unauthenticated
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = parseInt(session.user.id);

  //get user details from db
  const user = await client.user.findUnique({
    where: { id: currentUserId },
    include: { account: true },
  });

  //check if users account exists (would exist most probably)
  if (!user || !user.account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  //take 10 recent transactions
  const recentTransactions = await client.transaction.findMany({
    where: {
      OR: [{ senderId: user.account.id }, { receiverId: user.account.id }],
    },
    include: {
      sender: { include: { user: true } },
      receiver: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  //collect unique users the current user transacted with
  const interactedUsersMap = new Map<
    number,
    { id: number; username: string }
  >();

  for (const txn of recentTransactions) {
    const otherUser =
      txn.senderId === user.account.id ? txn.receiver.user : txn.sender.user;

    if (
      otherUser.id !== currentUserId &&
      !interactedUsersMap.has(otherUser.id)
    ) {
      interactedUsersMap.set(otherUser.id, {
        id: otherUser.id,
        username: otherUser.username,
      });
    }
  }

  const recentUsers = Array.from(interactedUsersMap.values());

  return NextResponse.json(recentUsers);
}
