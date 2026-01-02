import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          avatar: user.avatar
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.level = user.level
        token.xp = user.xp
        token.streak = user.streak
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.level = token.level as number
        session.user.xp = token.xp as number
        session.user.streak = token.streak as number
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  }
}