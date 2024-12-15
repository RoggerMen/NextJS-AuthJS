import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "./lib/prisma";
import { sendWelcomeEmail } from "./lib/email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await (credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return { id: user.id, email: user.email, name: user.username };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image || null,
            },
          });
          await prisma.profile.create({
            data: {
              userId: newUser.id,
            },
          });
          
          // Enviar correo de bienvenida para usuarios de Google
          await sendWelcomeEmail(user.email!, user.name!);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.provider = token.provider as string;
      }
      return session;
    },
  },
});

