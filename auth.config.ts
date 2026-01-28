import type { NextAuthConfig } from "next-auth"
import { Role } from "@prisma/client"

export default {
    providers: [],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Explicitly cast user to custom type to access extended fields
                const u = user as unknown as { role: Role; idAnggota?: string };
                token.role = u.role
                token.idAnggota = u.idAnggota || undefined
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
} satisfies NextAuthConfig
