import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username is required",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(6, {
    message: "Password is required",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Password is required",
  }),
});
