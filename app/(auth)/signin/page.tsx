"use client";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //form handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    //signin using nextauth native function
    const res = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    });

    //handle signin fail errors
    if (res?.error) {
      setError("Invalid credentials");
      setIsSubmitting(false);
    } else {
      //redirect to dashboard page
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-100">
            Sign into your PayTm account
          </h2>
        </div>

        {/* signin form */}
        <form onSubmit={handleSubmit} className="my-12">
          <TextInput
            label="Username"
            placeholder="johndoe1"
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <TextInput
            label="Password"
            placeholder="random@123"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg mb-4">
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
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button disabled={isSubmitting} className="w-full mt-6">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-neutral-300 hover:text-neutral-100"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
