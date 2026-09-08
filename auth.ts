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
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const z = (await import("zod")).z;
                const LoginSchema = z.object({
                    identifier: z.string().min(1),
                    password: z.string().min(1)
                });

                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { identifier, password } = validatedFields.data;

                    const user = await db.user.findFirst({
                        where: {
                            OR: [
                                { email: identifier },
                                { username: identifier }
                            ]
                        }
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
