import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Login Admin | PMK MIPA Undana",
    description: "Halaman login pengurus dan administrator PMK MIPA FST Universitas Nusa Cendana.",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
            <div className="w-full max-w-sm space-y-5">
                <div className="flex flex-col items-center space-y-3 text-center">
                    <Link href="/" className="transition-transform hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="Logo PMK MIPA"
                            width={72}
                            height={72}
                            className="object-contain drop-shadow-xs"
                            priority
                        />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold font-serif tracking-tight text-foreground">
                            PMK MIPA Undana
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Portal Masuk Pengurus & Administrator
                        </p>
                    </div>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
