"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingBag, ArrowUpRight, Calendar, TrendingUp } from "lucide-react";
import { RecentReservations } from "@/components/admin/RecentReservations";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    const { tables, analytics, fetchAnalytics } = useStore();
    const [period, setPeriod] = useState('today');
    const [customDate, setCustomDate] = useState('');

    useEffect(() => {
        if (period === 'custom' && customDate) {
            fetchAnalytics('custom', customDate);
        } else if (period !== 'custom') {
            fetchAnalytics(period);
        }
    }, [period, customDate, fetchAnalytics]);

    // Calculate dynamic stats
    const activeTables = tables ? tables.filter(t => t.status === 'occupied').length : 0;

    // Fallbacks
    const revenue = analytics?.revenue || 0;
    const ordersCount = analytics?.orders || 0;
    const guests = analytics?.guests || 0;
    const topItems = analytics?.topItems || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white font-bold mb-2">Dashboard</h1>
                    <p className="text-neutral-400">Overview of restaurant performance.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Custom Date Picker */}
                    <div className="relative">
                        <input
                            type="date"
                            className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-gold-400 outline-none"
                            value={customDate}
                            onChange={(e) => {
                                setCustomDate(e.target.value);
                                setPeriod('custom');
                            }}
                        />
                    </div>

                    <div className="flex gap-2 bg-neutral-900 p-1 rounded-lg border border-white/10">
                        {['today', 'week', 'month'].map((p) => (
                            <button
                                key={p}
                                onClick={() => {
                                    setPeriod(p);
                                    setCustomDate(''); // Reset custom date when picking standard period
                                }}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${period === p
                                    ? 'bg-gold-400 text-black'
                                    : 'text-neutral-400 hover:text-white'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`SAR ${revenue.toLocaleString()}`}
                    change="Based on completed orders"
                    icon={DollarSign}
                />
                <StatCard
                    title="Total Orders"
                    value={ordersCount.toString()}
                    change="Completed transactions"
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Active Tables"
                    value={`${activeTables} / ${tables.length}`}
                    change="Currently occupied"
                    icon={Calendar}
                />
                <StatCard
                    title="Total Guests"
                    value={guests.toString()}
                    change="From arrived reservations"
                    icon={Users}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Reservations Feed */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gold-400" /> Recent Activity
                    </h3>
                    <RecentReservations />
                </div>

                {/* Top Selling Items */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gold-400" /> Top Selling Dishes
                    </h3>
                    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6">
                        {topItems.length > 0 ? (
                            <div className="space-y-4">
                                {topItems.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gold-400/10 text-gold-400 flex items-center justify-center font-bold text-sm">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{item.name}</p>
                                                <p className="text-xs text-neutral-500">{item.count} orders</p>
                                            </div>
                                        </div>
                                        <div className="font-mono text-gold-400">
                                            SAR {item.revenue.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-neutral-500">
                                No sales data for this period yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon: Icon }: any) {
    return (
        <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-xl hover:border-gold-400/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-neutral-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                </div>
                <div className="p-2 bg-gold-400/10 rounded-lg text-gold-400">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-xs text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {change}
            </p>
        </div>
    );
}
