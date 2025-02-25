// import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";
// //import GithubProvider from "next-auth/providers/github";
// import axios from "axios";
// import { connect } from "@/lib/mongodb"
// import { User } from "../../../../models/UserModel"
// 
// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET
//     }),
//   ],
//   secret: process.env.SECRET,
//   callbacks: {
//   async signIn({ user, account }) {
//     if(account.provider === "google"){
//       const { name, email } = user;
//       await connect()
//       const userExists = await User.findOne({email})
//       if(!userExists){
//         await axios.post("/api/users", { name, email });
//         return user;
//       }
//       return user;
//     }
//   }
// }
// };
// 
// const handler = NextAuth(authOptions);
// 
// export { handler as POST, handler as GET };

import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connect } from "@/lib/mongodb";
import { User } from "@/models/UserModel";

const authOptions = {
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
        const { name, email } = user;

        await connect();
        
        const userExists = await User.findOne({ email });
        console.log("This is nothing");
        console.log(userExists);
        if (!userExists) {
          await User.create({ name, email }); 
        }

        return user; 
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };