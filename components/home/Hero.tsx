"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />

            {/* Background Image/Video Placeholder (TODO: Add real asset) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/50 to-black">
                {/* <video autoPlay loop muted className="w-full h-full object-cover opacity-50">...</video> */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 animate-pulse-slow" />
            </div>

            {/* Content */}
            <div className="container relative z-20 px-4 text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="text-gold-400 tracking-[0.2em] uppercase text-sm font-medium mb-4 block">
                        Fine Dining in Najran
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                        Awaken Your <span className="text-gold-400 italic">Senses</span>
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
                        A culinary journey where contemporary taste meets sensory elegance.
                        Experience the art of dining at ÉVOQUÉ.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full justify-center"
                >
                    <Link href="/reservation">
                        <Button variant="gold" size="lg" className="h-12 px-8 text-base">
                            Reserve Your Table
                        </Button>
                    </Link>
                    <Link href="/menu">
                        <Button variant="premium" size="lg" className="h-12 px-8 text-base group">
                            View Menu <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gold-400 to-transparent" />
            </div>
        </section>
    );
}
