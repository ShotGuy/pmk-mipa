"use client";

import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { login } from "@/actions/auth-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LoginSchema = z.object({
    identifier: z.string().min(1, "Email or Username required"),
    password: z.string().min(1, "Password required")
});

export function LoginForm() {
    // searchParams removed as unused

    const [isPending, startTransition] = useTransition();

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
        <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1">
                {/* Header content if needed, but page already has title */}
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="identifier" // Changed from email
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email / Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value ?? ""}
                                            disabled={isPending}
                                            placeholder="admin or admin@example.com"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button variant="link" size="sm" asChild>
                    <a href="/register">Don&apos;t have an account? Register</a>
                </Button>
            </CardFooter>
        </Card>
    );
}
