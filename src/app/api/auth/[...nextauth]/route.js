import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          const user = await UserModel.findOne({ phone: credentials.phone });

          if (!user) return null;

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            usertype: user.usertype,
          };
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.usertype = user.usertype;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.usertype = token.usertype;
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };