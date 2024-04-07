import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

import { loginSchema } from "./schemas";
import { getUserByEmail } from "./utils/user";

import type { NextAuthConfig } from "next-auth";
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
