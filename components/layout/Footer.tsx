import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Mail, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Column 1: Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="Logo PMK MIPA Undana"
                                width={44}
                                height={44}
                                className="object-contain shrink-0"
                            />
                            <div>
                                <h3 className="text-xl font-serif font-bold text-primary leading-tight">PMK MIPA</h3>
                                <p className="text-[11px] text-muted-foreground font-medium">FST Universitas Nusa Cendana</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
                            Persekutuan Mahasiswa Kristen Fakultas Sains dan Teknik Universitas Nusa Cendana Kupang.
                            Membangun komunitas yang bertumbuh dalam iman dan kasih Kristus.
                        </p>
                        <div className="flex items-start gap-3 text-muted-foreground mt-4">
                            <MapPin className="w-5 h-5 mt-1 shrink-0 text-primary" />
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=-10.1577683,123.6639163"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors leading-relaxed"
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
                        <h4 className="text-lg font-bold mb-6">Link Cepat</h4>
                        <ul className="space-y-3">
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
                                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Sosmed & Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Hubungi Kami</h4>
                        <div className="flex gap-4 mb-6">
                            {[
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Youtube, href: "#", label: "Youtube" },
                                { icon: Facebook, href: "#", label: "Facebook" },
                            ].map((Social, idx) => (
                                <Link
                                    key={idx}
                                    href={Social.href}
                                    className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                    aria-label={Social.label}
                                >
                                    <Social.icon size={20} />
                                </Link>
                            ))}
                        </div>
                        <a
                            href="mailto:info@pmkmipa.id"
                            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            <span>info@pmkmipa.id</span>
                        </a>
                    </div>
                </div>

                <div className="border-t border-secondary-foreground/10 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} PMK MIPA. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
