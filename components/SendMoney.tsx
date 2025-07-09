"use client";

import { getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import UserCard from "./UserCard";
import { RxCross2 } from "react-icons/rx";

type User = {
  id: number;
  username: string;
};

export default function SendMoney() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //fetch recent users
  useEffect(() => {
    fetch("/api/users/recent")
      .then((res) => res.json())
      .then(setRecentUsers);
  }, []);

  //debounced user search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) {
        fetch(`/api/users/search?query=${query}`)
          .then((res) => res.json())
          .then(setSearchResults);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const openModalForUser = (user: { id: number; username: string }) => {
    setReceiver(user);
    setAmount("");
    setMessage("");
    setIsModalOpen(true);
  };

  const sendMoney = async () => {
    const session = await getSession();

    if (!session || !session.user) {
      setMessage("You must be signed in to send money.");
      return;
    }

    if (!receiver || !amount || parseInt(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch("/api/account/send", {
        method: "POST",
        body: JSON.stringify({
          toUsername: receiver.username,
          amount: amount,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(result.message || "Transaction complete!");
      } else {
        setMessage(result.error || "Failed to send money.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }

    setIsModalOpen(false);
    setQuery("");
    setSearchResults([]);
  };

  return (
    <div className="border border-neutral-800 bg-neutral-900 rounded-lg h-full p-4">
      <h2 className="text-2xl font-medium">Transfer money</h2>
      <p className="text-sm text-neutral-100">
        Send money to your friends fast & safe
      </p>

      {/* search input */}
      <input
        type="text"
        placeholder="Search user"
        className="input text-sm w-full p-2 my-4 border border-neutral-700 rounded-lg focus:ring-1 focus:ring-neutral-200"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Search Results */}
      {query.trim()
        ? searchResults.length > 0 && (
            <div className="bg-neutral-800 rounded-md p-2">
              {searchResults.map((user) => (
                <UserCard
                  key={user.id}
                  username={user.username}
                  onSendClick={() => openModalForUser(user)}
                />
              ))}
            </div>
          )
        : recentUsers.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm text-neutral-400 mb-1">Recent</h3>
              <div>
                {recentUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    username={user.username}
                    onSendClick={() => openModalForUser(user)}
                  />
                ))}
              </div>
            </div>
          )}

      {/* modal */}
      {isModalOpen && receiver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10 transition-all">
          <div
            ref={modalRef}
            className="bg-neutral-900 p-6 rounded-lg border border-neutral-700 w-80 transition-all"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Send to {receiver.username}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <RxCross2 className="h-5 w-5" />
              </button>
            </div>

            <input
              type="number"
              placeholder="Amount"
              className="w-full p-2 mb-3 border border-neutral-700 rounded-lg focus:ring-1 focus:ring-neutral-200 text-sm text-white bg-neutral-800"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              onClick={sendMoney}
              className="bg-neutral-700 text-neutral-100 w-full py-2 rounded hover:bg-neutral-600 cursor-pointer transition-all"
            >
              Confirm
            </button>
            {message && <p className="text-red-500">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
