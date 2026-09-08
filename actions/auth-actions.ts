"use server";

import * as z from "zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const LoginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(1)
});

import { db } from "@/lib/db";

// ... (imports)

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { identifier, password } = validatedFields.data;

    const existingUser = await db.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier }
            ]
        }
    });

    // Default redirect to admin dashboard for all roles
    let redirectTo = "/admin/dashboard";

    // Attempt sign in (authorize will verify password again)
    try {
        await signIn("credentials", {
            identifier,
            password,
            redirectTo,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
};

export const logout = async () => {
    await signOut({ redirectTo: "/login" });
};
