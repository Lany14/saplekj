import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prismaClient } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios"; // Ensure axios is installed
import { compare } from "bcrypt";
import { generateId } from "@/utils/generateId";
import { JWT } from "next-auth/jwt";

// Function to refresh the Google access token
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    console.log("Token refreshed successfully:", response.data);

    return {
      accessToken: response.data.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + response.data.expires_in,
      refreshToken: response.data.refresh_token || refreshToken, // Keep the same refresh token if not updated
    };
  } catch (error) {
    console.error(
      "Failed to refresh access token:",
      error.response?.data || error.message,
    );
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    // Google Provider for OAuth authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          access_type: "offline", // Requests refresh tokens
          prompt: "consent", // Forces the user to re-consent each time
          scope:
            "openid profile email https://www.googleapis.com/auth/calendar",
        },
      },
    }),

    // Credentials provider for manual email/password sign-in
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing email or password");
          }

          const existingUser = await prismaClient.user.findUnique({
            where: { email: credentials.email },
          });

          if (!existingUser) {
            throw new Error("No user found");
          }

          if (!existingUser.password) {
            throw new Error("User password is null");
          }

          const passwordMatch = await compare(
            credentials.password,
            existingUser.password,
          );

          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            picture: existingUser.image,
          };
        } catch (error) {
          console.error("Authorization failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("User profile in signIn callback:", profile); // Log profile details
      console.log("Account data in signIn callback:", account); // Log account details

      if (account?.provider === "google" && profile) {
        const generateToken = () => {
          const min = 100000;
          const max = 999999;
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const generatedUserId = generateId();
        const userToken = generateToken();

        // Check if the user already exists
        let existingUser = await prismaClient.user.findUnique({
          where: { email: profile.email },
        });

        if (!existingUser) {
          // If the user does not exist, create a new user with the default role
          existingUser = await prismaClient.user.create({
            data: {
              userId: parseInt(generatedUserId),
              name: profile.name ?? "",
              email: profile.email ?? "",
              image: profile.image ?? null,
              isVerified: true,
              password: null,
              token: userToken,
              role: "PET_OWNER", // Explicitly set the default role here
            },
          });
        }

        // Check if an account already exists for this user and provider
        const existingAccount = await prismaClient.account.findFirst({
          where: { userId: existingUser.id, provider: "google" },
        });

        if (existingAccount) {
          // If account exists but has no refresh token, update it
          if (!existingAccount.refresh_token && account.refresh_token) {
            console.log(
              `Updating missing refresh_token for user: ${existingUser.email}`,
            );
            await prismaClient.account.update({
              where: { id: existingAccount.id },
              data: { refresh_token: account.refresh_token },
            });
          }
        } else {
          // If the account does not exist, create a new account linked to the user
          await prismaClient.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, account, user }) {
      console.log("JWT callback - Token before:", token); // Log the token before modification

      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
      }
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      console.log("JWT callback - Token after:", token); // Log the token after modification
      return token;
    },

    async redirect({ url, baseUrl }) {
      // Always redirect to the "My Pets" page
      return "/dashboard/patient";
    },

    async session({ session, token }) {
      console.log("Session callback - Token data:", token); // Log token details
      console.log("Session callback - Session before:", session); // Log the session before modification

      const now = Math.floor(Date.now() / 1000);

      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;

        // Retrieve access token and refresh token from the Account table
        const account = await prismaClient.account.findFirst({
          where: { userId: token.id, provider: "google" },
          select: { access_token: true, expires_at: true, refresh_token: true },
        });

        if (account) {
          session.user.accessToken = account.access_token;
          session.user.refreshToken = account.refresh_token;
          session.user.accessTokenExpires = account.expires_at;
          console.log("Session callback - Account data:", account); // Log the retrieved account data
        } else {
          console.warn("No Google account linked for this user.");
        }

        // Refresh the access token if expired
        if (
          session.user.accessTokenExpires &&
          session.user.accessTokenExpires <= now
        ) {
          console.log("Access token expired. Refreshing...");
          const refreshedTokens = await refreshAccessToken(
            session.user.refreshToken,
          );

          if (refreshedTokens) {
            session.user.accessToken = refreshedTokens.accessToken;
            session.user.accessTokenExpires = refreshedTokens.expiresAt;
            session.user.refreshToken = refreshedTokens.refreshToken;

            console.log("Session callback - Token refreshed:", refreshedTokens);
          } else {
            console.error("Failed to refresh access token.");
          }
        }
      }

      console.log("Session callback - Session after:", session); // Log the session after modification
      return session;
    },
  },
};
