"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Mail, Sparkles, User } from "lucide-react";
import Image from "next/image";

type DivisionType = "all" | "bph" | "acara" | "ktb" | "doa";

interface TeamMember {
    name: string;
    role: string;
    major: string;
    image?: string | null;
    initials: string;
    gradient: string;
    division: DivisionType;
}

const divisions = [
    { id: "all", label: "Semua", count: 12 },
    { id: "bph", label: "BPH Inti", count: 3 },
    { id: "acara", label: "Sie Acara", count: 3 },
    { id: "ktb", label: "Sie KTB", count: 4 },
    { id: "doa", label: "Sie Doa & Pemerhati", count: 2 },
] as const;

const teamMembers: TeamMember[] = [
    {
        name: "Rio Pellokila",
        role: "Ketua BPH",
        major: "Ilmu Komputer 2023",
        initials: "RP",
        gradient: "from-amber-500/25 via-amber-600/15 to-secondary/30",
        division: "bph",
    },
    {
        name: "Verson Nenohaifeto",
        role: "Sekretaris",
        major: "Matematika 2025",
        initials: "VN",
        gradient: "from-amber-400/25 via-amber-500/15 to-secondary/30",
        division: "bph",
    },
    {
        name: "Enjel Zalukhu",
        role: "Bendahara",
        major: "Kimia 2023",
        initials: "EZ",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "bph",
    },
    {
        name: "Eka Nubatonis",
        role: "Koord. Sie Acara",
        major: "Kimia 2024",
        initials: "EN",
        gradient: "from-amber-500/25 via-amber-600/15 to-secondary/30",
        division: "acara",
    },
    {
        name: "Hendrick Lili",
        role: "Anggota Sie Acara",
        major: "Matematika 2025",
        initials: "HL",
        gradient: "from-amber-400/25 via-amber-500/15 to-secondary/30",
        division: "acara",
    },
    {
        name: "Gesti Tetema",
        role: "Anggota Sie Acara",
        major: "Kimia 2023",
        initials: "GT",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "acara",
    },
    {
        name: "Lily Bunganawa",
        role: "Koord. Sie KTB",
        major: "Kimia 2023",
        initials: "LB",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "ktb",
    },
    {
        name: "Elda Atandima",
        role: "Anggota Sie KTB",
        major: "Kimia 2023",
        initials: "EA",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "ktb",
    },
    {
        name: "Ritwan Adu",
        role: "Anggota Sie KTB",
        major: "Matematika 2025",
        initials: "RA",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "ktb",
    },
    {
        name: "Lilis Luitnan",
        role: "Anggota Sie KTB",
        major: "Kimia 2023",
        initials: "LL",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "ktb",
    },
    {
        name: "Putri Kawa",
        role: "Koord. Sie Doa & Pemerhati",
        major: "Kimia 2024",
        initials: "PK",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "doa",
    },
    {
        name: "Jeli Dilak",
        role: "Anggota Sie Doa & Pemerhati",
        major: "Kimia 2023",
        initials: "JD",
        gradient: "from-amber-600/25 via-amber-700/15 to-secondary/30",
        division: "doa",
    },
];

export function TeamGrid() {
    const [selectedDivision, setSelectedDivision] = useState<DivisionType>("all");

    const filteredMembers = selectedDivision === "all"
        ? teamMembers
        : teamMembers.filter((m) => m.division === selectedDivision);

    return (
        <section className="py-16 md:py-24 bg-transparent relative overflow-hidden border-t-2 border-foreground/10">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#f5f3eb] dark:bg-[#25211f] border-2 border-foreground text-foreground text-xs font-serif font-bold uppercase tracking-[0.2em] retro-shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Pelayan & Pemimpin</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                        Badan Pengurus <span className="text-primary italic">Harian</span>
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg text-foreground/80 font-serif font-bold max-w-xl mx-auto">
                        Mengenal lebih dekat rekan-rekan pelayan yang mengkoordinasikan persekutuan, ibadah, dan pemuridan PMK MIPA.
                    </p>
                </div>

                {/* Division Filter Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 md:mb-14">
                    {divisions.map((tab) => {
                        const isActive = selectedDivision === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSelectedDivision(tab.id)}
                                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-serif font-bold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? "bg-primary text-zinc-900 border-2 border-foreground retro-shadow-sm scale-105"
                                        : "bg-white dark:bg-[#25211f] text-foreground border-2 border-foreground/40 hover:border-foreground hover:bg-[#f5f3eb] dark:hover:bg-[#191715]"
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold ${
                                        isActive
                                            ? "bg-zinc-900 text-white"
                                            : "bg-muted text-foreground/70"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredMembers.map((member, index) => (
                            <TeamCard key={member.name} member={member} index={index} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
            className="group relative overflow-hidden bg-white dark:bg-[#25211f] border-2 sm:border-4 border-foreground retro-shadow hover:retro-shadow-lg transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col justify-between"
        >
            {/* Visual Header / Avatar Container */}
            <div className={`aspect-[1/1] sm:aspect-[4/3] relative overflow-hidden bg-gradient-to-br ${member.gradient} border-b-2 sm:border-b-4 border-foreground flex items-center justify-center p-3 sm:p-6`}>
                <div className="absolute inset-1.5 sm:inset-2 border-1.5 sm:border-2 border-dashed border-foreground/30 pointer-events-none" />

                {member.image ? (
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 sepia-[0.2] group-hover:sepia-0"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 z-10 w-full px-1">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full bg-[#f5f3eb] dark:bg-[#191715] border-2 sm:border-4 border-foreground flex items-center justify-center retro-shadow-sm group-hover:scale-105 transition-transform duration-300">
                            <span className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-foreground tracking-wider">
                                {member.initials}
                            </span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-zinc-900 text-white dark:bg-[#191715] dark:text-[#f5f3eb] text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-wider border sm:border-2 border-foreground retro-shadow-sm max-w-[95%] truncate">
                            <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary shrink-0" />
                            <span className="truncate">{member.major}</span>
                        </div>
                    </div>
                )}

                {/* Hover Action Pill for Desktop */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden sm:block">
                    <div className="flex gap-1.5">
                        <div className="w-8 h-8 bg-white dark:bg-[#25211f] border border-foreground flex items-center justify-center text-foreground hover:bg-primary transition-colors cursor-pointer retro-shadow-sm">
                            <Linkedin className="w-3.5 h-3.5" />
                        </div>
                        <div className="w-8 h-8 bg-white dark:bg-[#25211f] border border-foreground flex items-center justify-center text-foreground hover:bg-primary transition-colors cursor-pointer retro-shadow-sm">
                            <Mail className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Bottom */}
            <div className="p-3 sm:p-5 md:p-6 text-center space-y-1.5 sm:space-y-2 bg-white dark:bg-[#25211f]">
                <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider text-primary block leading-tight min-h-[2.2em] flex items-center justify-center">
                    {member.role}
                </span>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {member.name}
                </h3>
                <div className="pt-2 sm:pt-3 border-t border-dashed border-foreground/20 mt-1.5 sm:mt-2">
                    <p className="text-[9px] sm:text-[10px] font-serif font-bold text-foreground/70 uppercase tracking-widest">
                        PMK MIPA FST
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
