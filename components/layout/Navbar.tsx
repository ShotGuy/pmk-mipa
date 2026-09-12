"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tentang Kami", href: "/about" },
  { name: "Kegiatan", href: "/activities" },
  { name: "Kontak", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isScrolled
          ? "bg-[#f5f3eb] dark:bg-[#1a1816] border-b-2 border-foreground py-3 shadow-[0_4px_0_0_rgba(0,0,0,0.85)] dark:shadow-[0_4px_0_0_rgba(245,243,235,0.35)]"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 z-50 group">
          <div className="overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
            <Image
              src="/logo.png"
              alt="PMK MIPA Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-serif font-bold text-foreground tracking-tight flex items-center gap-1">
            PMK MIPA
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors duration-300 font-serif font-semibold text-lg relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <ThemeToggle />
          <Link href="/login">
            <Button className="bg-primary text-zinc-900 border-2 border-foreground rounded-full px-8 py-2 font-serif font-bold text-lg hover:bg-primary/80 transition-all duration-200 retro-shadow hover:translate-y-1 hover:shadow-none cursor-pointer">
              Login
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3 z-50">
          <ThemeToggle />
          <button
            className="text-foreground p-2 hover:bg-foreground/10 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMobileMenuOpen ? <X size={28} strokeWidth={2} /> : <Menu size={28} strokeWidth={2} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 bg-[#f5f3eb] dark:bg-[#1a1816] z-40 flex flex-col items-center justify-center gap-8 md:hidden border-b-4 border-foreground"
            >
              <nav className="flex flex-col items-center gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: "easeOut" }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-3xl font-serif font-bold text-foreground hover:text-primary transition-colors relative"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button size="lg" className="bg-primary text-zinc-900 border-2 border-foreground rounded-full px-10 py-6 font-serif font-bold text-xl retro-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200 mt-4 cursor-pointer">
                      Login Sistem
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
