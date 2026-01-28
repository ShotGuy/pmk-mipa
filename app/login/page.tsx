import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - PMK MIPA",
    description: "Login page for PMK MIPA members and administrators.",
};

import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
            <div className="w-full max-w-sm space-y-4">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
                    <p className="text-sm text-muted-foreground">
                        Masukkan email dan password untuk masuk ke dashboard.
                    </p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
