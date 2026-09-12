"use server";

import * as z from "zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

const LoginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(1)
});

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Field input tidak valid!" };
    }

    const { identifier, password } = validatedFields.data;
    const normalizedIdentifier = identifier.trim().toLowerCase();

    // Rate limit: 5 percobaan per 5 menit
    const limitKey = `login:${normalizedIdentifier}`;
    const limitResult = rateLimit(limitKey, { maxAttempts: 5, windowMs: 5 * 60 * 1000 });
    if (!limitResult.success) {
        return {
            error: `Terlalu banyak percobaan login. Silakan tunggu ${limitResult.resetInSeconds} detik sebelum mencoba kembali demi keamanan akun.`,
        };
    }

    // Attempt sign in (authorize will verify credentials)
    try {
        await signIn("credentials", {
            identifier,
            password,
            redirectTo: "/admin/dashboard",
        });
        resetRateLimit(limitKey);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email/Username atau password salah!" };
                default:
                    return { error: "Gagal masuk. Periksa kembali akun Anda." };
            }
        }
        throw error;
    }
};

export const logout = async () => {
    await signOut({ redirectTo: "/login" });
};
