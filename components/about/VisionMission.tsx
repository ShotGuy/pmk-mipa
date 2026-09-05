"use client";

import { motion } from "framer-motion";
import { Compass, Target, CheckCircle2, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";

const coreValues = [
    {
        icon: CrossIcon,
        title: "Kristosentris",
        description: "Menjadikan firman Tuhan dan teladan Kristus sebagai pusat dari seluruh rencana, studi, dan pelayanan.",
    },
    {
        icon: ShieldCheck,
        title: "Integritas Sains",
        description: "Menjunjung kejujuran, ketekunan, dan etika riset dalam mengejar prestasi akademik di Fakultas MIPA.",
    },
    {
        icon: Heart,
        title: "Kasih Persaudaraan",
        description: "Membangun relasi keluarga yang tulus, saling menerima, dan saling menopang tanpa sekat senioritas.",
    },
    {
        icon: Sparkles,
        title: "Pelayanan Berdampak",
        description: "Mempraktikkan kepemimpinan yang melayani dengan rendah hati serta menjadi berkat bagi sesama.",
    },
];

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 2v20M7 8h10" />
        </svg>
    );
}

const missionPoints = [
    "Membangun kedisiplinan hidup rohani melalui doa syafaat rutin dan pemuridan Kelompok Tumbuh Bersama (KTB).",
    "Mendukung keberhasilan studi mahasiswa sains melalui budaya kelompok belajar dan bimbingan akademik.",
    "Mengembangkan karakter kepemimpinan mahasiswa yang berintegritas, takut akan Tuhan, dan siap melayani.",
    "Menyatakan kepedulian sosial secara nyata melalui aksi kasih dan pengabdian bagi kampus serta masyarakat.",
];

export function VisionMission() {
    return (
        <section className="py-24 bg-secondary/5 relative overflow-hidden border-y border-border/50">
            <div className="container mx-auto px-4 max-w-6xl space-y-20">
                {/* Vision & Mission Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-card border border-primary/30 shadow-md relative overflow-hidden"
                    >
                        <div className="space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                                <Compass className="w-7 h-7" />
                            </div>

                            <div className="space-y-3">
                                <span className="text-xs uppercase font-bold tracking-widest text-primary">
                                    Visi Kami
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground leading-snug">
                                    Menghasilkan Sarjana Sains yang Berakar Kuat dalam Kristus
                                </h3>
                            </div>

                            <p className="text-base text-muted-foreground leading-relaxed">
                                &ldquo;Menjadi wadah pembinaan rohani mahasiswa Kristen Fakultas MIPA yang menghasilkan pribadi berkarakter mulia, unggul secara akademik, teguh berpegang pada kebenaran firman Tuhan, dan berdampak bagi gereja, bangsa, dan dunia.&rdquo;
                            </p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-primary">
                            <BookOpen className="w-4 h-4" />
                            <span>Matius 5:14 — Garam dan Terang Dunia</span>
                        </div>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-card border border-border shadow-md"
                    >
                        <div className="space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary-foreground">
                                <Target className="w-7 h-7 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs uppercase font-bold tracking-widest text-primary">
                                    Misi Kami
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                                    Langkah Nyata Pelayanan
                                </h3>
                            </div>

                            <ul className="space-y-3.5 pt-2">
                                {missionPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* Core Values Section */}
                <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs uppercase font-bold tracking-widest text-primary">
                            Pondasi Karakter
                        </span>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                            Nilai-Nilai Inti (Core Values)
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Empat pilar utama yang menjiwai setiap langkah pelayanan dan interaksi keluarga besar PMK MIPA.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreValues.map((val, idx) => {
                            const Icon = val.icon;
                            return (
                                <motion.div
                                    key={val.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground border border-primary/20 flex items-center justify-center mb-4 text-primary">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold font-serif text-foreground mb-2">
                                        {val.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {val.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
