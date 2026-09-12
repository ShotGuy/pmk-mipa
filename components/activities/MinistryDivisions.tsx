"use client";

import { motion } from "framer-motion";
import { Music, Monitor, Heart, Users, MessageCircle, Sparkles } from "lucide-react";

const divisions = [
    {
        icon: Music,
        title: "Musik & Pujian (Worship)",
        tag: "Pelayanan Pujian",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        roles: ["Singers", "Pemusik (Gitar/Keyboard/Bass/Drum)", "Song Leader"],
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Musik & Pujian.",
    },
    {
        icon: Monitor,
        title: "Multimedia & Kreatif",
        tag: "Media & Teknologi",
        description:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
        roles: ["Operator Proyektor/Slide", "Dokumentasi & Fotografi", "Desain Grafis & Medsos"],
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Multimedia & Kreatif.",
    },
    {
        icon: Heart,
        title: "Pemerhati & Doa",
        tag: "Konseling & Kasih",
        description:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.",
        roles: ["Penyambutan Jemaat (Usher)", "Tim Doa Syafaat", "Pendampingan Mahasiswa Baru"],
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Pemerhati & Doa.",
    },
    {
        icon: Users,
        title: "Penginjilan & KTB",
        tag: "Pemuridan & Misi",
        description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
        roles: ["Fasilitator KTB", "Aksi Sosial Kemanusiaan", "Penjangkauan Mahasiswa"],
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Penginjilan & KTB.",
    },
];

export function MinistryDivisions() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden border-b-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-6xl space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25211f] border-2 border-foreground text-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Salurkan Talenta & Kasih</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                        Divisi <span className="text-primary italic">Pelayanan Kami</span>
                    </h2>

                    <p className="text-lg text-foreground/80 font-serif font-bold max-w-xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {divisions.map((div, index) => {
                        const Icon = div.icon;
                        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(div.waMessage)}`;

                        return (
                            <motion.div
                                key={div.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative flex flex-col justify-between p-8 bg-white dark:bg-[#25211f] border-4 border-foreground retro-shadow transition-transform duration-300 hover:-translate-y-2 hover:retro-shadow-lg"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-16 h-16 bg-[#f5f3eb] dark:bg-[#191715] border-4 border-foreground flex items-center justify-center text-foreground retro-shadow-sm group-hover:bg-primary transition-colors">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <span className="text-xs font-serif font-bold uppercase tracking-widest px-4 py-1.5 bg-zinc-900 text-white dark:bg-[#191715] dark:text-[#f5f3eb] border-2 border-foreground retro-shadow-sm">
                                            {div.tag}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-serif font-bold text-foreground">
                                            {div.title}
                                        </h3>
                                        <p className="text-sm font-serif font-bold text-foreground/80 leading-relaxed uppercase tracking-wide">
                                            {div.description}
                                        </p>
                                    </div>

                                    {/* Role Tags */}
                                    <div className="flex flex-wrap gap-2 pt-4">
                                        {div.roles.map((role) => (
                                            <span
                                                key={role}
                                                className="text-xs font-serif font-bold uppercase tracking-wider px-3 py-1.5 bg-white dark:bg-[#191715] border-2 border-foreground text-foreground retro-shadow-sm"
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action CTA */}
                                <div className="pt-6 mt-8 border-t-2 border-dashed border-foreground/30">
                                    <a href={waUrl} target="_blank" rel="noopener noreferrer">
                                        <button className="w-full flex items-center justify-center bg-primary text-foreground border-2 border-foreground hover:bg-zinc-900 hover:text-white dark:hover:bg-[#191715] dark:hover:text-primary transition-colors px-6 py-4 font-serif font-bold uppercase tracking-widest retro-shadow-sm hover:retro-shadow-none cursor-pointer">
                                            <MessageCircle className="w-5 h-5 mr-3" />
                                            Gabung ke Divisi Ini
                                        </button>
                                    </a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
