"use server";

import * as z from "zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const LoginSchema = z.object({
    identifier: z.string().min(1),
    password: z.string().min(1)
});

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { identifier, password } = validatedFields.data;

    // Attempt sign in (authorize will verify credentials)
    try {
        await signIn("credentials", {
            identifier,
            password,
            redirectTo: "/admin/dashboard",
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
