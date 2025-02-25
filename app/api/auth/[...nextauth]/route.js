// import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
// import { connect } from "@/lib/mongodb";
// import { User } from "@/models/UserModel";
// 
// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.SECRET,
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account.provider === "google") {
//         const { name, email } = user;
// 
//         await connect();
//         
//         const userExists = await User.findOne({ email });
//         console.log("This is nothing");
//         console.log(userExists);
//         if (!userExists) {
//           await User.create({ name, email }); 
//         }
// 
//         return user; 
//       }
//     },
//   },
// };
// 
// const handler = NextAuth(authOptions);
// 
// export { handler as POST, handler as GET };

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
      return true;
    },
    async session({ session, token }) {
      if (token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };