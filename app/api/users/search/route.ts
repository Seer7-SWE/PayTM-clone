import { NextRequest, NextResponse } from "next/server";
import client from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  //get user session
  const session = await getServerSession(authOptions);

  //if no session/user, unauthenticated
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //get query params for user search
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim() === "") {
    return NextResponse.json([], { status: 200 });
  }

  const users = await client.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
      NOT: {
        id: parseInt(session.user.id),
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  return NextResponse.json(users);
}
