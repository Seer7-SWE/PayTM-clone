"use client";

import Transaction from "@/app/lib/default";
import { signOut } from "next-auth/react";
import { RxExit } from "react-icons/rx";

export default function ProfileCard({
  username,
  balance,
  transactions,
  currentAccountId,
}: {
  username: string;
  balance: number;
  transactions: Transaction[];
  currentAccountId: number;
}) {
  return (
    <div className="border border-neutral-800 bg-neutral-900 rounded-lg h-full p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Welcome, {username}</h2>
          <p className="text-lg font-light">
            Balance: ₹<span className="font-bold">{balance}</span>
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="rounded-full bg-neutral-800 p-2 cursor-pointer hover:bg-neutral-700/60 text-neutral-300 hover:text-white transition-all"
        >
          <RxExit size={20} />
        </button>
      </div>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((txn) => {
            const isSender = txn.senderId === currentAccountId;
            const otherUsername = isSender
              ? txn.receiver.user.username
              : txn.sender.user.username;
            const action = isSender ? "sent" : "received";

            return (
              <li
                key={txn.id}
                className="flex justify-between items-start p-3 border rounded-lg border-neutral-800"
              >
                <div className="flex justify-between w-full items-center">
                  <p className="text-neutral-100 text-sm">
                    You {action} ₹{txn.amount} {isSender ? "to" : "from"}{" "}
                    {otherUsername}
                  </p>
                  <p className="text-xs text-neutral-500 whitespace-nowrap">
                    {new Date(txn.createdAt).toDateString()}
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-neutral-500">You have no transactions yet</p>
        )}
      </ul>
    </div>
  );
}
