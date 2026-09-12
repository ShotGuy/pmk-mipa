import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail, MapPin, Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#f5f3eb] text-foreground pt-20 pb-10 border-t-4 border-foreground relative overflow-hidden">
            {/* Retro decorative element */}
            <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
                    {/* Column 1: Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="transition-transform duration-300 hover:-translate-y-1">
                                <Image
                                    src="/logo.png"
                                    alt="Logo PMK MIPA Undana"
                                    width={56}
                                    height={56}
                                    className="object-contain shrink-0"
                                />
                            </div>
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-foreground leading-tight tracking-tight flex items-center gap-2">
                                    PMK MIPA
                                </h3>
                                <p className="text-sm text-foreground/80 font-bold tracking-widest uppercase mt-1">FST Undana</p>
                            </div>
                        </div>
                        <p className="text-foreground/80 leading-relaxed max-w-sm text-lg font-serif">
                            Persekutuan Mahasiswa Kristen Fakultas Sains dan Teknik Universitas Nusa Cendana Kupang.
                            Membangun komunitas yang bertumbuh dalam iman dan kasih Kristus.
                        </p>
                        <div className="flex items-start gap-4 text-foreground/90 mt-6 font-serif">
                            <MapPin className="w-6 h-6 mt-1 shrink-0 text-primary" strokeWidth={2} />
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=-10.1577683,123.6639163"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors leading-relaxed text-lg font-bold"
                            >
                                <span>
                                    Sekretariat PMK MIPA<br />
                                    JULANOFA&apos;S KOST,<br />
                                    Kota Kupang, NTT
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Link Cepat */}
                    <div>
                        <h4 className="text-2xl font-serif font-bold mb-8 text-foreground flex items-center gap-2">
                            Link Cepat
                            <Sparkles className="w-5 h-5 text-primary" />
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Beranda", href: "/" },
                                { name: "Tentang Kami", href: "/about" },
                                { name: "Kegiatan", href: "/activities" },
                                { name: "Kontak", href: "/contact" },
                                { name: "Bergabung", href: "/join" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-foreground/80 hover:text-primary transition-colors duration-300 text-xl font-serif font-bold flex items-center gap-3 group"
                                    >
                                        <span className="w-2 h-2 bg-foreground group-hover:bg-primary transition-colors rotate-45"></span>
                                        <span className="border-b-2 border-transparent group-hover:border-primary transition-colors">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Sosmed & Contact */}
                    <div>
                        <h4 className="text-2xl font-serif font-bold mb-8 text-foreground flex items-center gap-2">
                            Hubungi Kami
                            <Sparkles className="w-5 h-5 text-primary" />
                        </h4>
                        <div className="flex gap-4 mb-8">
                            {[
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Youtube, href: "#", label: "Youtube" },
                                { icon: Facebook, href: "#", label: "Facebook" },
                            ].map((Social, idx) => (
                                <Link
                                    key={idx}
                                    href={Social.href}
                                    className="w-12 h-12 bg-white border-2 border-foreground retro-shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-foreground transition-all duration-200 hover:translate-y-1 hover:shadow-none"
                                    aria-label={Social.label}
                                >
                                    <Social.icon size={24} strokeWidth={2} />
                                </Link>
                            ))}
                        </div>
                        <a
                            href="mailto:info@pmkmipa.id"
                            className="inline-flex items-center gap-3 px-6 py-4 bg-white border-2 border-foreground retro-shadow text-foreground hover:bg-primary transition-all duration-200 hover:translate-y-1 hover:shadow-none group"
                        >
                            <Mail className="w-6 h-6 text-foreground" strokeWidth={2} />
                            <span className="font-serif font-bold text-lg">info@pmkmipa.id</span>
                        </a>
                    </div>
                </div>

                <div className="border-t-2 border-foreground pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-serif font-bold text-foreground/70">
                    <p>&copy; {new Date().getFullYear()} PMK MIPA. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        Didesain dengan <Sparkles className="w-4 h-4 text-primary" /> Kasih.
                    </p>
                </div>
            </div>
        </footer>
    );
}
