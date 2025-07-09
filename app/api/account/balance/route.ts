import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import client from "@/app/lib/db";

export async function GET() {
  //get user session
  const session = await getServerSession(authOptions);

  //if no session / no user, unauthenticated
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //get user from db
  const user = await client.user.findUnique({
    where: { username: session.user.username },
    include: { account: true },
  });

  //check if users account exists (would exist most probably)
  if (!user?.account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({ balance: user.account.balance });
}
