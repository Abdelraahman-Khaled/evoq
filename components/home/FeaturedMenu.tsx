"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FEATURED_ITEMS = [
    {
        id: 1,
        name: "Truffle Risotto",
        nameAr: "ريزوتو الترافل",
        description: "Creamy arborio rice, black truffle shavings, parmesan crisp.",
        bgImage: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Wagyu Beef Filet",
        nameAr: "فيليه واغيو",
        description: "Grade A5 Wagyu, asparagus, red wine reduction.",
        bgImage: "https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=1887&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Golden Saffron Cake",
        nameAr: "كيكة الزعفران الذهبية",
        description: "Saffron infused sponge, cardamom cream, gold leaf.",
        bgImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop"
    }
];

export function FeaturedMenu() {
    return (
        <section id="menu" className="py-24 bg-black relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-gold-400 tracking-widest text-sm uppercase font-medium">Culinary Masterpieces</span>
                    <h2 className="text-4xl font-serif text-white font-bold">Signature Selections</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURED_ITEMS.map((item) => (
                        <div key={item.id} className="group relative h-[500px] overflow-hidden rounded-xl cursor-pointer">
                            {/* Image Background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${item.bgImage})` }}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-serif text-white mb-1 group-hover:text-gold-400 transition-colors">
                                    {item.name}
                                </h3>
                                <h3 className="text-xl font-arabic text-white/90 mb-3">
                                    {item.nameAr}
                                </h3>
                                <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/menu">
                        <Button variant="premium" size="lg" className="px-10">
                            View Full Menu <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
