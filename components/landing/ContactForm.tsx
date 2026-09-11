"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter." }),
    major: z.string().min(2, { message: "Jurusan harus diisi." }),
    email: z.string().email({ message: "Email tidak valid." }),
    message: z.string().min(10, { message: "Pesan harus diisi minimal 10 karakter." }),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(data);
        setIsSubmitting(false);
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 3000);
    };

    return (
        <div className="bg-white p-8 md:p-10 border-4 border-foreground retro-shadow">
            <div className="border-b-4 border-foreground pb-6 mb-8">
                <h3 className="text-4xl font-serif font-bold text-foreground">Kirim Pesan</h3>
                <p className="text-foreground/80 font-serif font-bold mt-2">Punya pertanyaan atau masukan? Silahkan isi form di bawah ini.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-3">
                    <label htmlFor="name" className="text-sm font-serif font-bold uppercase tracking-widest text-foreground">Nama Lengkap</label>
                    <input 
                        id="name" 
                        placeholder="Cth: John Doe" 
                        className="w-full bg-[#f5f3eb] border-2 border-foreground p-4 text-foreground font-serif font-bold placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent retro-shadow-sm transition-shadow"
                        {...register("name")} 
                    />
                    {errors.name && <p className="text-red-500 text-xs font-serif font-bold uppercase tracking-wider">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label htmlFor="major" className="text-sm font-serif font-bold uppercase tracking-widest text-foreground">Jurusan/Angkatan</label>
                        <input 
                            id="major" 
                            placeholder="Cth: Ilmu Komputer 2024" 
                            className="w-full bg-[#f5f3eb] border-2 border-foreground p-4 text-foreground font-serif font-bold placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent retro-shadow-sm transition-shadow"
                            {...register("major")} 
                        />
                        {errors.major && <p className="text-red-500 text-xs font-serif font-bold uppercase tracking-wider">{errors.major.message}</p>}
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="email" className="text-sm font-serif font-bold uppercase tracking-widest text-foreground">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            placeholder="Cth: john@example.com" 
                            className="w-full bg-[#f5f3eb] border-2 border-foreground p-4 text-foreground font-serif font-bold placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent retro-shadow-sm transition-shadow"
                            {...register("email")} 
                        />
                        {errors.email && <p className="text-red-500 text-xs font-serif font-bold uppercase tracking-wider">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="message" className="text-sm font-serif font-bold uppercase tracking-widest text-foreground">Pesan</label>
                    <textarea
                        id="message"
                        className="flex min-h-[160px] w-full bg-[#f5f3eb] border-2 border-foreground p-4 text-foreground font-serif font-bold placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent retro-shadow-sm transition-shadow resize-y"
                        placeholder="Tulis pesanmu di sini..."
                        {...register("message")}
                    />
                    {errors.message && <p className="text-red-500 text-xs font-serif font-bold uppercase tracking-wider">{errors.message.message}</p>}
                </div>

                <button 
                    type="submit" 
                    className="w-full flex items-center justify-center bg-primary text-foreground border-2 border-foreground hover:bg-foreground hover:text-white transition-colors px-6 py-5 font-serif font-bold uppercase tracking-widest retro-shadow hover:retro-shadow-none disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            Mengirim Pesan...
                        </>
                    ) : isSuccess ? (
                        "Pesan Terkirim!"
                    ) : (
                        <>
                            <Send className="mr-3 h-5 w-5" />
                            Kirim Pesan Sekarang
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
