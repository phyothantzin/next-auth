"use server";

import * as z from "zod";

import { forgotPasswordSchema, resetPasswordSchema } from "@/schemas";
import {
  generateResetPasswordToken,
  getResetPasswordTokenByToken,
} from "@/utils/resetPasswordToken";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/user";
import { sendResetPasswordEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof forgotPasswordSchema>) => {
  const validatedFields = forgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email doesn't exist" };
  }

  const resetToken = await generateResetPasswordToken(email);

  await sendResetPasswordEmail(resetToken.email, resetToken.token);

  return { success: "Reset Password Email Sent!" };
};

export const resetPassword = async (
  token: string,
  values: z.infer<typeof resetPasswordSchema>
) => {
  if (!token) {
    return { error: "Invalid Token" };
  }

  const validatedFields = await resetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getResetPasswordTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid Token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token Expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email doesn't exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.resetPasswordToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password Changed!" };
};
