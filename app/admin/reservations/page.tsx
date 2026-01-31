"use client";

import { useStore, Table } from "@/lib/store";
import { Calendar, Clock, User, Phone, CheckCircle, XCircle, LogOut, ArrowRightCircle, Armchair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

export default function ReservationsPage() {
    const { reservations, tables, updateReservationStatus } = useStore();
    const [selectedResId, setSelectedResId] = useState<string | null>(null);
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actualGuests, setActualGuests] = useState(0);

    const availableTables = tables.filter(t => t.status === 'free');

    const handleArrivedClick = (resId: string, currentGuests: number) => {
        setSelectedResId(resId);
        setActualGuests(currentGuests);
        setSelectedTableId(null);
        setIsDialogOpen(true);
    };

    const confirmArrival = () => {
        if (selectedResId && selectedTableId) {
            updateReservationStatus(selectedResId, 'arrived', selectedTableId, actualGuests);
            setIsDialogOpen(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'arrived': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'completed': return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-white font-bold mb-2">Reservations</h1>
                <p className="text-neutral-400">Manage bookings and guest statuses.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {reservations.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-xl bg-neutral-900/50 text-neutral-500">
                        No reservations found.
                    </div>
                ) : (
                    reservations.map((res) => (
                        <div key={res.id} className="bg-neutral-900/50 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-gold-400/30 transition-colors">

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-white/5">
                                    <span className="font-bold text-lg text-white">{res.guests}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-white">{res.name}</h3>
                                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider", getStatusColor(res.status))}>
                                            {res.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {res.date}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {res.time}</span>
                                        <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {res.phone}</span>
                                        {res.tableId && (
                                            <span className="flex items-center gap-1.5 text-gold-400"><Armchair className="w-4 h-4" /> Table {res.tableId}</span>
                                        )}
                                    </div>
                                    {res.notes && (
                                        <div className="mt-3 p-2 bg-yellow-400/10 border border-yellow-400/20 rounded-md text-sm text-yellow-200/90 italic">
                                            "{res.notes}"
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 w-full md:w-auto">
                                {res.status !== 'cancelled' && res.status !== 'completed' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-500"
                                        onClick={() => updateReservationStatus(res.id, 'cancelled')}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                )}

                                {res.status === 'pending' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-white hover:text-green-400 hover:bg-green-400/10"
                                        onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                )}

                                {res.status === 'confirmed' && (
                                    <Button
                                        variant="gold"
                                        size="sm"
                                        onClick={() => handleArrivedClick(res.id, res.guests)}
                                    >
                                        <ArrowRightCircle className="w-4 h-4 mr-2" /> Arrived
                                    </Button>
                                )}

                                {res.status === 'arrived' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-green-500/20 text-green-400 hover:bg-green-500/10 hover:text-green-500"
                                        onClick={() => updateReservationStatus(res.id, 'completed', res.tableId)}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" /> Completed
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Table Selection Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-neutral-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Assign Table</DialogTitle>
                        <p className="text-neutral-400 text-sm">Select a free table for this confirmed reservation.</p>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Guest Count Override */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-400">Actual Guest Count</label>
                            <input
                                type="number"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-gold-400 outline-none"
                                value={actualGuests}
                                onChange={(e) => setActualGuests(parseInt(e.target.value) || 0)}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {availableTables.length > 0 ? availableTables.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTableId(t.id)}
                                    className={cn(
                                        "p-3 rounded-lg border flex flex-col items-center gap-1 transition-all",
                                        selectedTableId === t.id ? "bg-gold-400 text-black border-gold-400 font-bold" : "bg-black/40 border-white/10 text-neutral-400 hover:border-gold-400/50 hover:text-white"
                                    )}
                                >
                                    <span className="text-lg">{t.id}</span>
                                    <span className="text-[10px] uppercase">{t.seats} Seats</span>
                                </button>
                            )) : (
                                <div className="col-span-3 text-center text-red-400 py-4">
                                    No free tables available!
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button variant="gold" disabled={!selectedTableId} onClick={confirmArrival}>Confirm & Assign</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
