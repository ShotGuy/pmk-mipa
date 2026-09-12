"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Apakah mahasiswa baru yang belum pernah hadir boleh langsung datang?",
        answer:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        question: "Bagaimana cara bergabung dalam Kelompok Tumbuh Bersama (KTB)?",
        answer:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
        question: "Apakah ada syarat khusus untuk melayani di tim musik atau multimedia?",
        answer:
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    },
    {
        question: "Di mana lokasi sekretariat dan kapan waktu berkumpulnya?",
        answer:
            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
    },
];

export function ActivitiesFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-[#f5f3eb] relative overflow-hidden border-y-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-4xl space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-foreground text-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        <span>Tanya Jawab Seputar Kegiatan</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                        Pertanyaan yang <span className="text-primary italic">Sering Diajukan</span>
                    </h2>

                    <p className="text-lg text-foreground/80 font-serif font-bold max-w-xl mx-auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                {/* Accordion List */}
                <div className="space-y-6">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white border-4 border-foreground retro-shadow transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left font-serif font-bold text-lg md:text-xl text-foreground hover:bg-primary/5 transition-colors gap-6"
                                >
                                    <span>{faq.question}</span>
                                    <div className={`w-10 h-10 shrink-0 border-2 border-foreground flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-foreground' : 'bg-white text-foreground'}`}>
                                        <ChevronDown
                                            className={`w-6 h-6 transition-transform duration-300 ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 md:px-8 pb-8 pt-2 text-base font-serif font-bold text-foreground/80 leading-relaxed border-t-2 border-dashed border-foreground/20 mx-6 md:mx-8">
                                                <div className="pt-6">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
