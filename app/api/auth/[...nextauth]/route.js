import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/lib/mongodb";
import { User } from "@/models/UserModel";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt", 
    maxAge: 1 * 60 * 60, // Session expires after 1 hour (3600 seconds)
    updateAge: 15 * 60, // Idle timeout: expires after 15 minutes of inactivity (900 seconds)
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const { name, email } = user;
          await connect();
          const userExists = await User.findOne({ email });
          if (!userExists) {
            await User.create({ name, email });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; 
        }
      }
      return false; 
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };