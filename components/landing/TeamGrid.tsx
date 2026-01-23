"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

const teamMembers = [
    {
        name: "Rio Chandra",
        role: "Ketua BPH",
        major: "Ilmu Komputer 2022",
        image: "/docs/placeholder-profile-1.jpg",
    },
    {
        name: "Sarah Wijaya",
        role: "Sekretaris",
        major: "Matematika 2023",
        image: "/docs/placeholder-profile-2.jpg",
    },
    {
        name: "David Santoso",
        role: "Bendahara",
        major: "Fisika 2022",
        image: "/docs/placeholder-profile-3.jpg",
    },
    {
        name: "Ester Lim",
        role: "Koord. Doa",
        major: "Biologi 2023",
        image: "/docs/placeholder-profile-4.jpg",
    },
];

export function TeamGrid() {
    return (
        <section className="py-20 bg-secondary/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Badan Pengurus Harian</h2>
                    <p className="text-muted-foreground">Melayani dengan hati, memimpin dengan teladan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <TeamCard key={index} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamCard({ member, index }: { member: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-card border shadow-sm"
        >
            <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                {/* Grayscale to Color on Hover */}
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Info Slide Up */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <span className="text-sm font-medium text-primary mb-1 block">{member.major}</span>
                        <div className="flex gap-4 mt-4">
                            <Linkedin className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 text-center bg-card z-10 relative">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
        </motion.div>
    );
}
