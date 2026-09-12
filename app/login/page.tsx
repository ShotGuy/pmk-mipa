import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
    title: "Login Admin | PMK MIPA Undana",
    description: "Halaman login pengurus dan administrator PMK MIPA FST Universitas Nusa Cendana.",
};

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12">
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 border-2 border-foreground bg-white dark:bg-[#191715] text-foreground text-xs font-serif font-bold uppercase tracking-wider retro-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Beranda</span>
                </Link>
            </div>
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center space-y-3 text-center">
                    <Link href="/" className="transition-transform hover:scale-105">
                        <div className="w-30 h-30 flex items-center justify-center p-2">
                            <Image
                                src="/logo.png"
                                alt="Logo PMK MIPA"
                                width={80}
                                height={80}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#191715] border-2 border-foreground text-foreground text-[10px] font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            <span>Portal Pengurus</span>
                        </div>
                        <h1 className="text-3xl font-bold font-serif tracking-tight text-foreground">
                            PMK MIPA FST Undana
                        </h1>
                        <p className="text-xs text-muted-foreground font-serif">
                            Masuk ke Sistem Pengelolaan & Administrasi Pelayanan
                        </p>
                    </div>
                </div>
                <Suspense fallback={<div className="text-center font-serif text-muted-foreground">Memuat form...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
