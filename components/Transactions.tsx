import TransactionCard from "./TransactionCard";
import Transaction from "@/app/lib/default";

export default async function Transactions({
  transactions,
  currentAccountId,
}: {
  transactions: Transaction[];
  currentAccountId: number;
}) {
  return (
    <div className="border border-neutral-800 bg-neutral-900 rounded-lg h-full p-4">
      <h2 className="text-2xl font-medium text-neutral-50 mb-4">
        Transactions
      </h2>
      {
        <ul>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((txn) => (
              <TransactionCard
                key={txn.id}
                {...txn}
                currentAccountId={currentAccountId}
              />
            ))
          ) : (
            <p className="text-neutral-500">You have no transactions yet</p>
          )}
        </ul>
      }
    </div>
  );
}
