interface ButtonProps {
  children: string;
  className?: string;
  disabled?: boolean;
}

export default function Button({ children, className, disabled }: ButtonProps) {
  return (
    <div>
      <button
        className={`w-full bg-neutral-400 text-neutral-900 px-5 py-2 rounded-lg hover:bg-neutral-200 cursor-pointer transition-colors my-8 disabled:bg-neutral-400 disabled:cursor-not-allowed ${className}`}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
}
