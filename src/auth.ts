import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        if (
          credentials?.email === "admin@gmail.com" &&
          credentials?.password === "123456"
        ) {
          return {
            id: "1",
            email: "admin@gmail.com",
            name: "Admin",
          };
        }
        return null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
