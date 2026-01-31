"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu as MenuIcon, Receipt, Settings, LogOut, Coffee, History, Calendar, Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Menu Management", href: "/admin/menu", icon: MenuIcon },
    { name: "POS System", href: "/admin/pos", icon: Coffee },
    { name: "Tables", href: "/admin/tables", icon: Armchair },
    { name: "Order History", href: "/admin/orders", icon: History },
    { name: "Reservations", href: "/admin/reservations", icon: Calendar },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

import { useStore } from "@/lib/store";
import { useEffect } from "react";

export function AdminSidebar() {
    const pathname = usePathname();
    const { fetchInitialData } = useStore();

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <aside className="w-64 bg-neutral-900 border-r border-white/5 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center text-black font-bold">E</div>
                <span className="font-serif text-xl font-bold text-white tracking-widest">ÉVOQUÉ</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {ADMIN_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-gold-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
