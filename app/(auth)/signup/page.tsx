"use client";

import { z } from "zod";
import axios from "axios";
import TextInput from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

//zod schema for signup validation
const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be atleast 3 characters long")
      .max(20, "Username must be atmost 20 characters long")
      .refine((val) => val.length > 0, {
        message: "Username cannot be empty or blank spaces",
      }),
    password: z
      .string()
      .min(8, "Password must be atleast 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#]).*$/,
        "Password must contain at least one lowercase letter, one number, and one special character (!@#)"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //main form handler function
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsSubmitting(true);

    //checking if validations pass on the frontend
    const result = signupSchema.safeParse(form);
    //if failed, add to fieldErrors object, {key: errorField, value: errorMessage}
    if (!result.success) {
      const fieldErrors: Partial<typeof form> = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof typeof form;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    //post request to signup user
    try {
      await axios.post("/api/signup", {
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      //navigate to signin page
      const login = await signIn("credentials", {
        redirect: false,
        username: form.username,
        password: form.password,
      });

      if (login?.ok) {
        router.push("/dashboard");
      } else {
        setGeneralError("Signup successful, Please signin manually.");
      }
    } catch (err: unknown) {
      //check for backend validation/errors
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 400 && err.response.data?.error) {
          //handle validation errors from server
          const serverErrors = err.response.data.error;
          if (typeof serverErrors === "string") {
            setGeneralError(serverErrors);
          } else {
            //handle zod formatted errors (zod errors come as an object)
            const fieldErrors: Partial<typeof form> = {};
            Object.keys(serverErrors).forEach((field) => {
              if (field in form) {
                fieldErrors[field as keyof typeof form] =
                  serverErrors[field]._errors?.[0] || serverErrors[field];
              }
            });
            setErrors(fieldErrors);
          }
        } else {
          setGeneralError("Something went wrong. Please try again");
        }
      } else {
        setGeneralError("Something went wrong. Please try again");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-100">
            Create your PayTm account
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Join thousands of users managing their finances securely
          </p>
        </div>

        {/* signup form */}
        <form onSubmit={handleSubmit} className="my-12">
          <TextInput
            label="Username"
            placeholder="johndoe1"
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            error={errors.username}
            helperText="Choose a unique username with at least 3 characters"
          />
          <TextInput
            label="Password"
            placeholder="random@123"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            helperText="Password must be 8+ characters with lowercase, number, and special character (!@#)"
          />
          <TextInput
            label="Confirm Password"
            placeholder="random@123"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
            helperText="Re-enter your password to confirm"
          />

          {generalError && (
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
              <p className="text-sm text-red-600 dark:text-red-400">
                {generalError}
              </p>
            </div>
          )}

          <Button disabled={isSubmitting} className="w-full mt-6">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{" "}
              <a
                href="/signin"
                className="font-medium text-neutral-300 hover:text-neutral-100"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
