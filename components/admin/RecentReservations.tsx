"use client";

import { useStore } from "@/lib/store";
import { User, Calendar, Clock, Phone } from "lucide-react";

export function RecentReservations() {
    const { reservations } = useStore();

    if (!reservations || reservations.length === 0) {
        return (
            <div className="text-center py-10 text-neutral-500 border border-white/5 rounded-xl bg-neutral-900/50">
                No recent reservations.
            </div>
        );
    }

    return (
        <div className="border border-white/10 rounded-xl bg-neutral-900/50 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
                <h3 className="font-bold text-white">Recent Reservations</h3>
            </div>
            <div className="divide-y divide-white/5">
                {reservations.map((res) => (
                    <div key={res.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-white">{res.name}</p>
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {res.phone}</span>
                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {res.guests} Guests</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center justify-end gap-1 text-gold-400 font-medium text-sm">
                                <Calendar className="w-3 h-3" /> {res.date}
                            </div>
                            <div className="flex items-center justify-end gap-1 text-neutral-500 text-xs">
                                <Clock className="w-3 h-3" /> {res.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
