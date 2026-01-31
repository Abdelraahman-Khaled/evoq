"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { name: "Story", href: "/#story" },
    { name: "Menu", href: "/menu" },
    { name: "Experience", href: "/#experience" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 h-20 transition-all duration-300">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-serif text-3xl font-bold text-gold-400 tracking-wider hover:opacity-90 transition-opacity">
                    ÉVOQUÉ
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-white/80 hover:text-gold-400 uppercase tracking-widest transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <Link href="/reservation">
                        <Button variant="premium" className="px-6">
                            Book a Table
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white hover:text-gold-400 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-gold-900/20 shadow-xl flex flex-col p-6 gap-4 animate-in slide-in-from-top-4 duration-300">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-white hover:text-gold-400"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button variant="gold" className="w-full mt-2" onClick={() => setIsOpen(false)}>
                        Book a Table
                    </Button>
                </div>
            )}
        </nav>
    );
}
