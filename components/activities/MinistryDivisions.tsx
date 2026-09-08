"use client";

import { motion } from "framer-motion";
import { Music, Monitor, Heart, Users, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const divisions = [
    {
        icon: Music,
        title: "Musik & Pujian (Worship)",
        tag: "Pelayanan Pujian",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
        roles: ["Singers", "Pemusik (Gitar/Keyboard/Bass/Drum)", "Song Leader"],
        accentGradient: "from-amber-500/20 via-amber-400/10 to-transparent",
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Musik & Pujian.",
    },
    {
        icon: Monitor,
        title: "Multimedia & Kreatif",
        tag: "Media & Teknologi",
        description:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
        roles: ["Operator Proyektor/Slide", "Dokumentasi & Fotografi", "Desain Grafis & Medsos"],
        accentGradient: "from-amber-400/20 via-amber-300/10 to-transparent",
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Multimedia & Kreatif.",
    },
    {
        icon: Heart,
        title: "Pemerhati & Doa",
        tag: "Konseling & Kasih",
        description:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.",
        roles: ["Penyambutan Jemaat (Usher)", "Tim Doa Syafaat", "Pendampingan Mahasiswa Baru"],
        accentGradient: "from-amber-600/20 via-amber-500/10 to-transparent",
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Pemerhati & Doa.",
    },
    {
        icon: Users,
        title: "Penginjilan & KTB",
        tag: "Pemuridan & Misi",
        description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.",
        roles: ["Fasilitator KTB", "Aksi Sosial Kemanusiaan", "Penjangkauan Mahasiswa"],
        accentGradient: "from-amber-500/20 via-amber-600/10 to-transparent",
        waMessage: "Halo Pengurus PMK MIPA, saya tertarik untuk bergabung melayani di Divisi Penginjilan & KTB.",
    },
];

export function MinistryDivisions() {
    return (
        <section className="py-24 bg-secondary/5 relative overflow-hidden border-y border-border/50">
            <div className="container mx-auto px-4 max-w-6xl space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Salurkan Talenta & Kasih</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                        Divisi <span className="text-primary">Pelayanan Kami</span>
                    </h2>

                    <p className="text-base text-muted-foreground leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-accent text-accent-foreground border border-primary/20">
                                            {div.tag}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                                            {div.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {div.description}
                                        </p>
                                    </div>

                                    {/* Role Tags */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {div.roles.map((role) => (
                                            <span
                                                key={role}
                                                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground border border-border/50"
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action CTA */}
                                <div className="pt-6 mt-6 border-t border-border/60">
                                    <a href={waUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Gabung ke Divisi Ini
                                        </Button>
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
