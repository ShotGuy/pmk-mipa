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
        <section className="py-24 bg-transparent relative overflow-hidden border-t-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f3eb] border-2 border-foreground text-foreground text-xs font-serif font-bold uppercase tracking-[0.2em] retro-shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Pelayan & Pemimpin</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                        Badan Pengurus <span className="text-primary italic">Harian</span>
                    </h2>

                    <p className="text-lg text-foreground/80 font-serif font-bold max-w-xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
            className="group relative overflow-hidden bg-white border-4 border-foreground retro-shadow-lg transition-transform duration-300 hover:-translate-y-2 flex flex-col justify-between"
        >
            {/* Visual Header / Avatar Container */}
            <div className={`aspect-[4/3] relative overflow-hidden bg-gradient-to-br ${member.gradient} border-b-4 border-foreground flex items-center justify-center p-6`}>
                <div className="absolute inset-2 border-2 border-dashed border-foreground/30 pointer-events-none" />

                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 sepia-[0.2] group-hover:sepia-0"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-3 z-10">
                        <div className="w-24 h-24 rounded-full bg-[#f5f3eb] border-4 border-foreground flex items-center justify-center retro-shadow group-hover:scale-110 transition-transform duration-300">
                            <span className="font-serif font-bold text-3xl text-foreground tracking-wider">
                                {member.initials}
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-white text-[10px] font-serif font-bold uppercase tracking-widest border-2 border-foreground retro-shadow-sm">
                            <User className="w-3 h-3 text-primary" />
                            <span>{member.major}</span>
                        </div>
                    </div>
                )}

                {/* Subtle Hover Action Pill */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="flex gap-2">
                        <div className="w-10 h-10 bg-white border-2 border-foreground flex items-center justify-center text-foreground hover:bg-primary transition-colors cursor-pointer retro-shadow-sm">
                            <Linkedin className="w-4 h-4" />
                        </div>
                        <div className="w-10 h-10 bg-white border-2 border-foreground flex items-center justify-center text-foreground hover:bg-primary transition-colors cursor-pointer retro-shadow-sm">
                            <Mail className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Bottom */}
            <div className="p-6 text-center space-y-2 bg-white">
                <span className="text-xs font-serif font-bold uppercase tracking-widest text-primary block mb-1">
                    {member.role}
                </span>
                <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                </h3>
                <div className="pt-4 border-t-2 border-dashed border-foreground/20 mt-2">
                    <p className="text-xs font-serif font-bold text-foreground/70 uppercase tracking-widest">
                        Fakultas MIPA Undana
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
