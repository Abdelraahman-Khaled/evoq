"use client";

import { MenuItem } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/lib/store";

interface MenuItemProps {
    item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemProps) {
    const { addToCart } = useStore();

    return (
        <div className="group bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-gold-400/50 transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {item.isNew && (
                    <span className="absolute top-3 right-3 bg-gold-400 text-black text-xs font-bold px-2 py-1 rounded">
                        NEW
                    </span>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-white group-hover:text-gold-400 transition-colors">
                        {item.name}
                    </h3>
                    <span className="text-gold-400 font-bold">{item.price} SAR</span>
                </div>
                <h4 className="font-arabic text-neutral-400 text-sm mb-3 text-right" dir="rtl">
                    {item.nameAr}
                </h4>

                <p className="text-neutral-500 text-sm line-clamp-2 mb-4 flex-1">
                    {item.description}
                </p>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/10 hover:border-gold-400 hover:text-gold-400 bg-transparent group-hover:bg-gold-400/10 active:scale-95 transition-transform"
                    onClick={() => addToCart(item)}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add to Order
                </Button>
            </div>
        </div>
    );
}
