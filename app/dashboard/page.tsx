import ProfileCard from "@/components/ProfileCard";
import SendMoney from "@/components/SendMoney";
import Transactions from "@/components/Transactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import client from "../lib/db";
import axios from "axios";
import { cookies } from "next/headers";

interface Transaction {
  id: number;
  amount: number;
  senderId: number;
  receiverId: number;
  sender: { user: { username: string } };
  receiver: { user: { username: string } };
  createdAt: string;
}

async function fetchTransactions(): Promise<Transaction[]> {
  //send cookies along with get request to the backend
  try {
    const cookieStore = cookies();
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await axios.get(`${baseUrl}/api/account/transactions`, {
      headers: {
        Cookie: (await cookieStore).toString(),
      },
    });

    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error("Axios error: ", e.response?.status, e.response?.data);
    } else {
      console.error("Failed to fetch transactions: ", e);
    }
    return [];
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  let user;
  let transactions;

  if (session) {
    user = await client.user.findFirst({
      where: { id: parseInt(session?.user.id) },
      include: { account: true },
    });

    transactions = await fetchTransactions();
  } else {
    return (
      <div className="flex flex-col items-center justify-center gap-2 w-full min-h-screen">
        <div className="flex gap-2 justify-center items-center p-3 bg-red-900/10 border border-red-800 rounded-lg w-50">
          <svg
            className="h-5 w-5 text-red-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-red-600 dark:text-red-400">Unauthorized</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-neutral-500">
            Please{" "}
            <a
              href="/signin"
              className="font-medium text-neutral-300 hover:text-neutral-100"
            >
              Sign in{" "}
            </a>
            OR{" "}
            <a
              href="/signup"
              className="font-medium text-neutral-300 hover:text-neutral-100"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
        <div className="col-span-1">
          <Transactions
            transactions={transactions}
            currentAccountId={user!.account!.id}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-2">
          <div className="flex-1">
            <ProfileCard
              username={user!.username}
              balance={user!.account!.balance}
              transactions={transactions.slice(0, 3)}
              currentAccountId={user!.account!.id}
            />
          </div>
          <div className="flex-1/2">
            <SendMoney />
          </div>
        </div>
      </div>
    </div>
  );
}
