interface TransactionProps {
  id: number;
  amount: number;
  senderId: number;
  sender: { user: { username: string } };
  receiver: { user: { username: string } };
  createdAt: string;
  currentAccountId: number;
}

export default function TransactionCard({
  id,
  amount,
  senderId,
  sender,
  receiver,
  createdAt,
  currentAccountId,
}: TransactionProps) {
  console.log(id);
  const isSender = senderId === currentAccountId;
  const otherUsername = isSender
    ? receiver.user.username
    : sender.user.username;
  const sign = isSender ? "-" : "+";
  const action = isSender ? "sent" : "received";

  return (
    <li className="flex justify-between items-start py-2 border-b border-neutral-800">
      <div className="text-neutral-100">
        <span className="font-medium">
          You {action} ₹{amount} {isSender ? "to" : "from"} {otherUsername}
        </span>
        <p className="text-sm text-neutral-500">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
      <div
        className={`text-lg font-semibold ${
          isSender ? "text-red-500" : "text-green-400"
        }`}
      >
        {sign}₹{amount}
      </div>
    </li>
  );
}
