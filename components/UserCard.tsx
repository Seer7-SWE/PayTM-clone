interface UserCardProps {
  username: string;
  onSendClick: () => void;
}

export default function UserCard({ username, onSendClick }: UserCardProps) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-700 p-2">
      <span className="font-medium text-lg">{username}</span>
      <button
        onClick={onSendClick}
        className="text-sm bg-neutral-800 hover:bg-neutral-600 px-3 py-1 rounded-lg cursor-pointer transition-colors"
      >
        Send
      </button>
    </div>
  );
}
