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
            "Tidak Hanya Mahasiswa baru, kamu bisa mengajak siapa saja untuk mengikuti Ibadah di PMK MIPA. Silahkan lihat informasi Ibadah di Akun media sosial PMK MIPA ataupun Website Resmi PMK MIPA.",
    },
    {
        question: "Bagaimana cara bergabung dalam Kelompok Tumbuh Bersama (KTB)?",
        answer:
            "Kamu Bisa menghubungi salah seorang Badan Pengurus baik secara pribadi maupun melalui website ini dan kamu akan langsung ditempatkan ke dalam Kelompok Tumbuh Bersama. Atau kamu juga bisa mengisi Formulir Pendaftaran yang tersedia di website ini.",
    },
    {
        question: "Apakah ada syarat khusus untuk melayani di tim musik atau multimedia?",
        answer:
            "Untuk melayani di PMK MIPA sebagai Pemusik atau yang lainnya, kamu harus tergabung ke dalam KTB Terlebih dahulu agar kehidupan Rohani Kamu bisa terus dikontrol oleh Badan Pengurus.",
    },
    {
        question: "Di mana lokasi sekretariat dan kapan waktu berkumpulnya?",
        answer:
            "Lokasi Sekretariat PMK MIPA bisa dilihat di dalam website ini. Jika ingin berkunjung kamu bisa menghubungi Badan Pengurus terlebih dahulu.",
    },
];

export function ActivitiesFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-[#f5f3eb] dark:bg-[#181614] relative overflow-hidden border-y-2 border-foreground/10">
            <div className="container mx-auto px-6 max-w-4xl space-y-16">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25211f] border-2 border-foreground text-foreground text-xs font-serif font-bold tracking-[0.2em] uppercase retro-shadow-sm">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        <span>Tanya Jawab Seputar Kegiatan</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                        Pertanyaan yang <span className="text-primary italic">Sering Diajukan</span>
                    </h2>
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
                                className="bg-white dark:bg-[#25211f] border-4 border-foreground retro-shadow transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left font-serif font-bold text-lg md:text-xl text-foreground hover:bg-primary/5 transition-colors gap-6 cursor-pointer"
                                >
                                    <span>{faq.question}</span>
                                    <div className={`w-10 h-10 shrink-0 border-2 border-foreground flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-foreground' : 'bg-white dark:bg-[#191715] text-foreground'}`}>
                                        <ChevronDown
                                            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
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
