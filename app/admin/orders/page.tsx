"use client";

import { useStore } from "@/lib/store";
import { Receipt, Calendar, Clock, DollarSign } from "lucide-react";

export default function OrderHistoryPage() {
    const { orderHistory } = useStore();

    const calculateTotalRevenue = () => {
        return orderHistory.reduce((sum, order) => sum + order.total, 0);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-white font-bold mb-2">Order History</h1>
                    <p className="text-neutral-400">View past orders and transactions.</p>
                </div>

                <div className="bg-neutral-900 border border-gold-400/20 px-6 py-3 rounded-xl flex items-center gap-4">
                    <div className="p-2 bg-gold-400/10 rounded-full text-gold-400">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Total Revenue</p>
                        <p className="text-xl font-bold text-white">{calculateTotalRevenue().toFixed(2)} SAR</p>
                    </div>
                </div>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-neutral-900/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-neutral-400">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Table</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Items</th>
                            <th className="p-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {orderHistory.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-neutral-500">
                                    No order history available yet.
                                </td>
                            </tr>
                        ) : (
                            orderHistory.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-sm text-neutral-300">{order.id}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded bg-neutral-800 text-white text-xs font-bold">
                                            Table {order.tableId}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-neutral-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" /> {order.date}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-white">
                                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                        </div>
                                        <div className="text-xs text-neutral-500 mt-1">
                                            {order.items.length} unique items
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className="font-bold text-gold-400">{order.total * 1.15} SAR</span>
                                        <div className="text-[10px] text-neutral-500">Inc. Tax</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
