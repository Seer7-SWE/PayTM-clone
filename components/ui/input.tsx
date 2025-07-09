"use client";
import { ChangeEvent, useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

interface TextInputProps {
  label: string;
  placeholder: string;
  className?: string;
  type: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  error?: string;
  helperText?: string;
}

export default function TextInput({
  label,
  placeholder,
  className,
  type,
  onChange,
  value,
  error,
  helperText,
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-1 w-full max-w-md mb-4">
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          className={`flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm ${
            error && "border-red-500 focus-visible:ring-red-500 bg-red-900/10"
          } ${className}`}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
            tabIndex={-1}
          >
            {showPassword ? (
              <BsEyeSlashFill size={18} />
            ) : (
              <BsEyeFill size={18} />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1">
          <svg
            className="h-4 w-4 text-red-500 flex-shrink-0"
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
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {helperText && !error && (
        <p className="text-xs text-neutral-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
