"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { CATEGORIES } from "@/lib/menu-data"; // MENU_ITEMS removed from here
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Cart } from "@/components/menu/Cart";
import { useStore } from "@/lib/store";

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const { menuItems } = useStore(); // Get items from store

    const filteredItems = (activeCategory === "all"
        ? menuItems
        : menuItems.filter(item => item.categoryId === activeCategory)
    ).filter(item => item.available !== false); // Default to true if undefined

    return (
        <main className="min-h-screen bg-black pb-20">
            <Navbar />

            {/* Header */}
            <div className="pt-32 pb-12 text-center container px-4">
                <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Our Menu</h1>
                <p className="text-white/60 text-lg max-w-xl mx-auto">
                    Explore a symphony of flavors crafted with passion and precision.
                </p>
            </div>

            {/* Categories */}
            <div className="container px-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex justify-center min-w-max gap-4">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={cn(
                            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                            activeCategory === "all"
                                ? "bg-gold-400 text-black border-gold-400"
                                : "bg-transparent text-white/70 border-white/10 hover:border-gold-400/50"
                        )}
                    >
                        All Items
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border flex flex-col items-center",
                                activeCategory === cat.id
                                    ? "bg-gold-400 text-black border-gold-400"
                                    : "bg-transparent text-white/70 border-white/10 hover:border-gold-400/50"
                            )}
                        >
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="container px-4">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MenuItemCard item={item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-white/40">
                        No items found in this category.
                    </div>
                )}
            </div>

            <Cart />
        </main>
    );
}
