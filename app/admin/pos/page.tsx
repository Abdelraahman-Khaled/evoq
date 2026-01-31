"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, Clock, Utensils, Receipt, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore, Table } from "@/lib/store";

export default function POSPage() {
    const { tables, clearTable } = useStore();
    const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

    const selectedTable = selectedTableId ? tables.find(t => t.id === selectedTableId) : null;

    // Auto-refresh data every 10 seconds to ensure POS is live
    useEffect(() => {
        useStore.getState().fetchInitialData(); // Initial fetch on mount
        const interval = setInterval(() => {
            useStore.getState().fetchInitialData();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleBill = () => {
        if (!selectedTableId) return;
        if (confirm(`Print bill and clear Table ${selectedTableId}?`)) {
            clearTable(selectedTableId);
            setSelectedTableId(null);
        }
    };

    const calculateTotal = (table: Table) => {
        if (!table.orders) return 0;
        return table.orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-6">
            {/* Table Map */}
            <div className="flex-1 bg-neutral-900/30 border border-white/5 rounded-xl p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">Floor Plan</h2>
                        <button
                            onClick={() => useStore.getState().fetchInitialData()}
                            className="bg-gold-400/10 hover:bg-gold-400/20 px-4 py-2 rounded-full text-gold-400 font-medium text-xs flex items-center gap-2 transition-colors border border-gold-400/20"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Refresh Data
                        </button>
                    </div>
                    <div className="flex gap-4 text-xs font-medium">
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-neutral-700" /> Free</span>
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" /> Occupied</span>
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gold-400/20 border border-gold-400" /> Reserved</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8 p-10 flex-1 bg-black/50 rounded-lg">
                    {tables.map((table) => (
                        <button
                            key={table.id}
                            onClick={() => setSelectedTableId(table.id)}
                            className={cn(
                                "relative group flex flex-col items-center justify-center h-32 rounded-2xl border-2 transition-all duration-200",
                                selectedTableId === table.id && "ring-2 ring-white ring-offset-2 ring-offset-black",
                                table.status === "free" && "border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 text-neutral-400",
                                table.status === "occupied" && "border-red-500/50 bg-red-500/10 text-red-500",
                                table.status === "reserved" && "border-gold-400/50 bg-gold-400/10 text-gold-400"
                            )}
                        >
                            <span className="text-2xl font-serif font-bold mb-1">T-{table.id}</span>
                            <span className="text-xs opacity-70 flex items-center gap-1">
                                <User className="w-3 h-3" /> {table.seats}
                            </span>

                            {table.status === "occupied" && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Order Panel */}
            <div className="w-96 bg-neutral-900 border border-white/5 rounded-xl flex flex-col overflow-hidden">
                {selectedTable ? (
                    <>
                        <div className="p-6 border-b border-white/5 bg-black/20">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-white">Table {selectedTable.id}</h3>
                                <span className={cn("text-xs px-2 py-1 rounded capitalize",
                                    selectedTable.status === 'occupied' ? "bg-red-500/20 text-red-400" :
                                        selectedTable.status === 'reserved' ? "bg-gold-400/20 text-gold-400" :
                                            "bg-neutral-500/20 text-neutral-400"
                                )}>
                                    {selectedTable.status}
                                </span>
                            </div>
                            <div className="text-xs text-neutral-500 flex justify-between">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Active</span>
                                <span>Order: {selectedTable.orderId || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {(!selectedTable.orders || selectedTable.orders.length === 0) ? (
                                <div className="text-center text-neutral-600 py-10">
                                    No active orders.
                                </div>
                            ) : (
                                selectedTable.orders.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start animate-in slide-in-from-left">
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center text-xs text-white">{item.quantity}x</div>
                                            <div>
                                                <p className="text-sm text-white font-medium">{item.name}</p>
                                                <p className="text-xs text-neutral-500 truncate w-32">{item.nameAr}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-white">{item.price * item.quantity} SAR</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
                            {selectedTable.orders && selectedTable.orders.length > 0 && (
                                <>
                                    <div className="flex justify-between text-sm text-neutral-400">
                                        <span>Subtotal</span>
                                        <span>{calculateTotal(selectedTable)} SAR</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-neutral-400">
                                        <span>Tax (15%)</span>
                                        <span>{(calculateTotal(selectedTable) * 0.15).toFixed(2)} SAR</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-gold-400 pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span>{(calculateTotal(selectedTable) * 1.15).toFixed(2)} SAR</span>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400">Cancel</Button>
                                <Button
                                    variant="gold"
                                    className="gap-2"
                                    disabled={!selectedTable.orders || selectedTable.orders.length === 0}
                                    onClick={handleBill}
                                >
                                    <Receipt className="w-4 h-4" /> Bill
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                            <Utensils className="w-8 h-8 opacity-50" />
                        </div>
                        <p>Select a table to view active orders or assign a new guest.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
