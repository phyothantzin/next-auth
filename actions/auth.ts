"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import * as z from "zod";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginSchema, registerSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/user";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { username, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  await db.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
    },
  });

  return { success: "Email Sent!" };
};
