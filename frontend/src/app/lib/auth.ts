
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
        
        let user = null
        const { email, password } = await signInSchema.parseAsync(credentials)
 
        const response = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password}),
        });

        console.log("Raw response:", response);

        if (!response.ok) {
          const error = await response.json();
          alert("Login failed");
          return null;
        }
    
        const data = await response.json();

        user = data as User;
 
        if (!user) {
          return null;
        }

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
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
}
