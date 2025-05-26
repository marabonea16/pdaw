
import Credentials from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth";
import { signInSchema } from "./zod"
import { User } from "../../types"

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const { email, password } = await signInSchema.parseAsync(credentials);

        const response = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();

        // Convert numeric id to string for NextAuth compatibility
        const user = {
          ...data,
          id: String(data.id),
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as User;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
