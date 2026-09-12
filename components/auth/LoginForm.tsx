"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { login } from "@/actions/auth-actions";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

const LoginSchema = z.object({
    identifier: z.string().min(1, "Email or Username required"),
    password: z.string().min(1, "Password required")
});

export function LoginForm() {
    // searchParams removed as unused

    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(() => {
            login(values)
                .then((data) => {
                    if (data?.error) {
                        form.reset();
                        toast.error(data.error);
                    }
                })
                .catch((error: unknown) => {
                    // Next.js redirect melemparkan exception internal NEXT_REDIRECT yang bukan merupakan error sebenarnya
                    const err = error as { message?: string; digest?: string };
                    if (err?.message === "NEXT_REDIRECT" || err?.digest?.startsWith("NEXT_REDIRECT")) {
                        return;
                    }
                    toast.error("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
                });
        });
    };

    return (
        <Card className="w-full border-4 border-foreground bg-white dark:bg-[#25211f] retro-shadow">
            <CardHeader className="p-6 pb-2 space-y-1">
                <CardTitle className="text-xl font-serif font-bold text-foreground">Masuk Akun</CardTitle>
                <CardDescription className="text-xs font-serif text-muted-foreground">
                    Gunakan kredensial pengurus yang diberikan oleh admin
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-xs font-serif font-bold uppercase tracking-wider text-foreground">
                                        Email / Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            disabled={isPending}
                                            placeholder="hendrick atau hendrick@gmail.com"
                                            type="text"
                                            className="h-11 bg-[#f5f3eb] dark:bg-[#191715] border-2 border-foreground text-foreground font-serif font-bold placeholder:text-foreground/40 placeholder:font-normal retro-shadow-sm focus-visible:ring-0 focus:border-primary transition-all"
                                        />
                                    </FormControl>
                                    <FormMessage className="font-serif font-bold text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="text-xs font-serif font-bold uppercase tracking-wider text-foreground">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="••••••••"
                                                type={showPassword ? "text" : "password"}
                                                className="h-11 pr-11 bg-[#f5f3eb] dark:bg-[#191715] border-2 border-foreground text-foreground font-serif font-bold placeholder:text-foreground/40 placeholder:font-normal retro-shadow-sm focus-visible:ring-0 focus:border-primary transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                disabled={isPending}
                                                className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-foreground/60 hover:text-foreground focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
                                                title={showPassword ? "Sembunyikan password" : "Lihat password"}
                                                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="font-serif font-bold text-xs" />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full h-12 text-sm sm:text-base font-serif font-bold uppercase tracking-wider bg-primary hover:bg-amber-400 text-zinc-900 border-2 border-foreground retro-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-50 mt-2"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin text-zinc-900" />}
                            Masuk Portal
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center text-center border-t-2 border-foreground/10 p-6 pt-4">
                <p className="text-xs text-muted-foreground font-serif leading-relaxed">
                    Akses internal Pengurus PMK MIPA. Hubungi Administrator jika mengalami kendala login.
                </p>
            </CardFooter>
        </Card>
    );
}
