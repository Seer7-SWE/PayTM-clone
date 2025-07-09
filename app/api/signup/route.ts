import { NextResponse } from "next/server";
import { z } from "zod";
import client from "@/app/lib/db";
import argon2 from "argon2";

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

export async function POST(req: Request) {
  try {
    //getting the data and parsing through zod validation
    const body = await req.json();
    const parsedBody = signupSchema.safeParse(body);

    //if any validation fails, return error
    if (!parsedBody.success) {
      const formattedErrors: Record<string, string> = {};

      parsedBody.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        formattedErrors[field] = error.message;
      });

      return NextResponse.json(
        { error: formattedErrors, message: "Validation failed" },
        { status: 400 }
      );
    }

    //getting the parsed data
    const { username, password } = parsedBody.data;

    //db check to find if username already taken or not
    const existingUser = await client.user.findUnique({
      where: { username: username },
    });

    //if taken, return error
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    //hash password using argon2
    const hashedPassword = await argon2.hash(password);

    //random balance for user on signup
    const randomBalance = Math.floor(Math.random() * 10000);

    //push user data to db
    const user = await client.user.create({
      data: {
        username: username,
        password: hashedPassword,
        account: {
          create: {
            balance: randomBalance,
          },
        },
      },
    });

    //return success
    return NextResponse.json(
      {
        message: "User created successfully",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (err) {
    //catch error
    console.log("Signup error: ", err);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
