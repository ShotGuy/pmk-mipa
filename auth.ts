import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { Role } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"

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
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const z = (await import("zod")).z;
                const LoginSchema = z.object({
                    email: z.string().email(),
                    password: z.string().min(1)
                });

                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data; // Fixed: was using validatedFields which is SafeParseResult, need .data

                    const user = await db.user.findUnique({
                        where: { email }
                    });

                    if (!user || !user.password) return null;

                    const bcrypt = (await import("bcryptjs")).default;
                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (passwordsMatch) return user;
                }

                return null;
            }
        })
    ],
})
