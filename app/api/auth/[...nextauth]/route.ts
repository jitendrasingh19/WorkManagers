import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// export { handlers as GET, handlers as POST } from "@/auth";

// Fully typed AuthOptions
export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your database check
        if (
          credentials?.email === "admin@gmail.com" &&
          credentials?.password === "123456"
        ) {
          return { id: "1", name: "Admin User", email: "admin@gmail.com" };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // ✅ fixes TS type error
  },
  pages: {
    signIn: "/login", // redirect users to your login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export GET and POST for App Router API
export { handler as GET, handler as POST };


declare module "next-auth" {
  interface User {
    id: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
