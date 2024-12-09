// // lib/auth.ts
// import GoogleProvider from "next-auth/providers/google";
// import { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub;
//       return session;
//     },
//   },
// };

// app/api/auth/[...nextauth]/route.ts

import { authOptions } from "@/lib/auth"; // Import authOptions from lib/auth.ts
import NextAuth from "next-auth";

export const runtime = "nodejs";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // Export handler as GET and POST
