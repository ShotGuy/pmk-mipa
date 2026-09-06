"use client";

import { motion } from "framer-motion";
import { Linkedin, Mail, Sparkles, User } from "lucide-react";
import Image from "next/image";

interface TeamMember {
    name: string;
    role: string;
    major: string;
    image?: string | null;
    initials: string;
    gradient: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Rio Chandra",
        role: "Ketua BPH",
        major: "Ilmu Komputer 2022",
        initials: "RC",
        gradient: "from-amber-500/25 via-amber-600/15 to-secondary/30",
    },
    {
        name: "Sarah Wijaya",
        role: "Sekretaris",
        major: "Matematika 2023",
        initials: "SW",
        gradient: "from-amber-400/25 via-amber-500/15 to-secondary/30",
    },
    {
        name: "David Santoso",
        role: "Bendahara",
        major: "Fisika 2022",
        initials: "DS",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
    },
    {
        name: "Ester Lim",
        role: "Koord. Sie Doa",
        major: "Biologi 2023",
        initials: "EL",
        gradient: "from-amber-500/25 via-amber-600/15 to-secondary/30",
    },
    {
        name: "Daniel Pratama",
        role: "Koord. Sie Acara",
        major: "Kimia 2022",
        initials: "DP",
        gradient: "from-amber-400/25 via-amber-500/15 to-secondary/30",
    },
    {
        name: "Grace Natalia",
        role: "Koord. Sie KTB",
        major: "Biologi 2023",
        initials: "GN",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
    },
];

export function TeamGrid() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase border border-primary/20">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Pelayan & Pemimpin</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                        Badan Pengurus <span className="text-primary">Harian</span>
                    </h2>

                    <p className="text-base text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <TeamCard key={member.name} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
        >
            {/* Visual Header / Avatar Container */}
            <div className={`aspect-[4/3] relative overflow-hidden bg-gradient-to-br ${member.gradient} border-b border-border/60 flex items-center justify-center`}>
                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-20 h-20 rounded-2xl bg-card/80 backdrop-blur-md border border-primary/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <span className="font-serif font-bold text-2xl text-primary tracking-wider">
                                {member.initials}
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/70 backdrop-blur-sm text-[11px] font-semibold text-muted-foreground border border-border/50">
                            <User className="w-3 h-3 text-primary" />
                            <span>{member.major}</span>
                        </div>
                    </div>
                )}

                {/* Subtle Hover Action Pill */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer shadow-sm">
                            <Linkedin className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer shadow-sm">
                            <Mail className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Bottom */}
            <div className="p-6 text-center space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {member.role}
                </span>
                <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                    Fakultas MIPA Universitas Nusa Cendana
                </p>
            </div>
        </motion.div>
    );
}
