import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { Role } from "@prisma/client"

// Extend session types
import { type DefaultSession } from "next-auth"
// import { type JWT } from "next-auth/jwt" // Commented out to avoid module resolution issues if path varies

declare module "next-auth" {
    interface Session {
        user: {
            role: Role
            idAnggota?: string
        } & DefaultSession["user"]
    }
}

// Ensure JWT augmentation works or fallback
// declare module "next-auth/jwt" {
//     interface JWT {
//         role?: Role
//         idAnggota?: string
//     }
// }

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Explicitly cast user to any to avoid "Property does not exist on User"
                // because AdapterUser type might not automatically infer custom fields from Prisma
                token.role = (user as any).role
                token.idAnggota = (user as any).idAnggota || undefined
            }
            return token
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                // cast to Role to satisfy TS if it thinks it's optional/undefined
                session.user.role = token.role as Role
            }
            if (token.idAnggota && session.user) {
                session.user.idAnggota = token.idAnggota as string
            }
            return session
        }
    },
    ...authConfig,
})
