"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Story() {
    return (
        <section id="story" className="py-24 bg-neutral-900 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-gold-400 tracking-widest text-sm uppercase font-medium">Our Story</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight">
                                Crafting <span className="text-gold-400">Emotions</span> Through Taste
                            </h2>
                        </div>

                        <div className="space-y-6 text-white/80 font-light text-lg leading-relaxed">
                            <p>
                                ÉVOQUÉ is not just a restaurant; it is a sanctuary for the senses.
                                Contemporary culinary art meets elegant atmosphere to create moments that linger in memory.
                            </p>
                            <div dir="rtl" className="font-arabic text-xl text-white/90 leading-loose border-r-2 border-gold-400 pr-4">
                                ÉVOQUÉ هو مطعم فاخر يقدّم تجربة طهي معاصرة تُركّز على إيقاظ الحواس وربط الطعم بالمشاعر.
                                نهدف أن يغادر الضيف وهو يشعر بالرضا، والتميّز، وأنه خاض تجربة مختلفة تستحق التكرار.
                            </div>
                        </div>

                        <div className="pt-4 flex gap-8">
                            <div>
                                <h4 className="text-gold-400 font-serif text-3xl mb-2">4.9</h4>
                                <span className="text-white/60 text-sm uppercase tracking-wider">Rating</span>
                            </div>
                            <div>
                                <h4 className="text-gold-400 font-serif text-3xl mb-2">50+</h4>
                                <span className="text-white/60 text-sm uppercase tracking-wider">Unique Dishes</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image/Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] w-full"
                    >
                        <div className="absolute inset-0 bg-gold-400/10 rotate-3 rounded-2xl z-0" />
                        <div className="absolute inset-0 bg-neutral-800 rounded-2xl overflow-hidden z-10 border border-white/10">
                            {/* Placeholder for functionality - normally use next/image */}
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center hover:scale-105 transition-transform duration-700" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
