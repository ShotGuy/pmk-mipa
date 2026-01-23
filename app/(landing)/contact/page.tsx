import { ContactForm } from "@/components/landing/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="pt-24 pb-20 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold">Hubungi Kami</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Jangan ragu untuk menghubungi kami jika ada pertanyaan atau ingin bergabung.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Info Side */}
                    <div className="space-y-8">
                        <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10 space-y-6">
                            <h3 className="text-2xl font-bold font-serif">Informasi Kontak</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Alamat</h4>
                                        <p className="text-muted-foreground">
                                            Gedung Student Center Lt. 2,<br />
                                            Fakultas MIPA, Universitas
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Email</h4>
                                        <p className="text-muted-foreground">info@pmkmipa.id</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Telepon / WA</h4>
                                        <p className="text-muted-foreground">+62 812 3456 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-[300px] bg-muted rounded-2xl overflow-hidden relative">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-6 h-6" />
                                    Google Maps Embed Here
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
