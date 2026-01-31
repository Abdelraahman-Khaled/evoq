"use client";

import { useStore } from "@/lib/store";
import { Trash, Plus, Armchair, Hash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TableManagementPage() {
    const { tables, addTable, deleteTable, updateTableStatus } = useStore();
    const [newTable, setNewTable] = useState({ id: "", seats: 4 });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const id = parseInt(newTable.id);
        if (isNaN(id)) return;

        // Check if table exists
        if (tables.find(t => t.id === id)) {
            alert("Table ID already exists!");
            return;
        }

        addTable({
            id,
            seats: newTable.seats,
        });
        setNewTable({ id: "", seats: 4 });
    };

    const [selectedTable, setSelectedTable] = useState<number | null>(null);
    const [isOrderOpen, setIsOrderOpen] = useState(false);

    // Order State
    const { menuItems, submitOrderToTable } = useStore();
    const [orderGuests, setOrderGuests] = useState<number | string>(2);
    const [orderCart, setOrderCart] = useState<{ item: any, quantity: number }[]>([]);

    const handleTableClick = (table: any) => {
        setSelectedTable(table.id);
        setOrderGuests(2); // Default
        setOrderCart([]);
        setIsOrderOpen(true);
    };

    const addToOrderCart = (item: any) => {
        setOrderCart(prev => {
            const existing = prev.find(i => i.item.id === item.id);
            if (existing) {
                return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { item, quantity: 1 }];
        });
    };

    const removeFromOrderCart = (itemId: any) => {
        setOrderCart(prev => prev.filter(i => i.item.id !== itemId));
    };

    const submitOrder = async () => {
        if (selectedTable && orderCart.length > 0) {
            const result = await submitOrderToTable(selectedTable, orderCart.map(i => ({ ...i.item, quantity: i.quantity })), Number(orderGuests) || 1);

            if (result.success) {
                setIsOrderOpen(false);
                setOrderCart([]);
            } else {
                alert(`Error: ${result.error}`);
            }
        }
    };

    const categories = Array.from(new Set(menuItems.map(i => i.categoryId)));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif text-white font-bold mb-2">Table Management</h1>
                <p className="text-neutral-400">Add or remove tables in the restaurant.</p>
            </div>

            {/* Add Table Form */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-gold-400" /> Add New Table
                </h3>
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="space-y-2 flex-1 w-full">
                        <label className="text-sm font-medium text-neutral-400">Table Number</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                            <input
                                type="number"
                                required
                                value={newTable.id}
                                onChange={(e) => setNewTable({ ...newTable, id: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-gold-400 transition-all"
                                placeholder="e.g. 10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 flex-1 w-full">
                        <label className="text-sm font-medium text-neutral-400">Seats Capacity</label>
                        <div className="relative">
                            <Armchair className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                            <input
                                type="number"
                                required
                                min={1}
                                value={newTable.seats}
                                onChange={(e) => setNewTable({ ...newTable, seats: parseInt(e.target.value) })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-gold-400 transition-all"
                                placeholder="e.g. 4"
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="gold" className="w-full md:w-auto">
                        Add Table
                    </Button>
                </form>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        className={`relative group border rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${table.status === 'occupied' ? 'bg-red-500/5 border-red-500/20 hover:border-red-500' :
                            table.status === 'reserved' ? 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500' :
                                'bg-neutral-900 border-white/10 hover:border-gold-400'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-1 ${table.status === 'occupied' ? 'bg-red-500/20 text-red-500' :
                            table.status === 'reserved' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-neutral-800 text-white'
                            }`}>
                            {table.id}
                        </div>
                        <div className="text-xs text-neutral-500 font-medium uppercase tracking-wider flex items-center gap-1">
                            <Armchair className="w-3 h-3" /> {table.seats} Seats
                        </div>

                        {/* Status Badge */}
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${table.status === 'occupied' ? 'bg-red-500/10 text-red-500' :
                            table.status === 'reserved' ? 'bg-yellow-500/10 text-yellow-500' :
                                'bg-green-500/10 text-green-500'
                            }`}>
                            {table.status}
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => deleteTable(table.id)}
                                className="p-1.5 text-red-400 hover:text-red-500 hover:bg-white/5 rounded-full"
                                title="Delete Table"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Dialog (Popup) */}
            {isOrderOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-neutral-900">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-white mb-2">Table {selectedTable} Order</h2>
                                <div className="flex items-center gap-3">
                                    <span className="text-neutral-400 text-sm">Status:</span>
                                    <select
                                        value={tables.find(t => t.id === selectedTable)?.status || 'free'}
                                        onChange={(e) => {
                                            if (selectedTable) {
                                                updateTableStatus(selectedTable, e.target.value as any);
                                            }
                                        }}
                                        className="bg-black/40 border border-white/10 rounded-md px-2 py-1 text-sm text-white focus:border-gold-400 outline-none"
                                    >
                                        <option value="free">Free</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="reserved">Reserved</option>
                                    </select>
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => setIsOrderOpen(false)}>Close</Button>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Menu Selection (Left) */}
                            <div className="flex-1 overflow-y-auto p-6 border-r border-white/10">
                                {categories.map(cat => (
                                    <div key={cat} className="mb-6">
                                        <h3 className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-3">{cat}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {menuItems.filter(i => i.categoryId === cat && i.available !== false).map(item => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => addToOrderCart(item)}
                                                    className="flex items-start gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/5 hover:border-gold-400/30 transition-all text-left group"
                                                >
                                                    <div className="flex-1">
                                                        <div className="text-white font-medium text-sm group-hover:text-gold-400">{item.name}</div>
                                                        <div className="text-neutral-500 text-xs">{item.price} SAR</div>
                                                    </div>
                                                    <Plus className="w-4 h-4 text-neutral-600 group-hover:text-gold-400" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart / Actions (Right) */}
                            <div className="w-80 bg-black/20 p-6 flex flex-col">
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-neutral-400 mb-2 block">Number of Guests</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={orderGuests}
                                        onChange={(e) => setOrderGuests(e.target.value === '' ? '' : parseInt(e.target.value))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-gold-400 outline-none"
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                    {/* Existing Orders (Received from Server) */}
                                    {tables.find(t => t.id === selectedTable)?.orders?.length ? (
                                        <div className="mb-4 pb-4 border-b border-white/10">
                                            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Current Orders</h4>
                                            {tables.find(t => t.id === selectedTable)?.orders?.map((item, idx) => (
                                                <div key={`existing-${idx}`} className="flex justify-between items-center text-white/60 py-1">
                                                    <div className="text-sm">
                                                        <span className="text-white/40 font-bold mr-2">{item.quantity}x</span>
                                                        {item.name}
                                                    </div>
                                                    <span className="text-xs">{item.price * item.quantity}</span>
                                                </div>
                                            ))}
                                            <div className="mt-2 text-right text-sm text-neutral-400">
                                                Subtotal: <span className="text-white">SAR {tables.find(t => t.id === selectedTable)?.orders?.reduce((sum, i) => sum + (i.price * i.quantity), 0)}</span>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* New Cart Items */}
                                    {orderCart.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-2">New Items</h4>
                                            {orderCart.map((line, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded mb-2">
                                                    <div className="text-sm text-white">
                                                        <span className="text-gold-400 font-bold mr-2">{line.quantity}x</span>
                                                        {line.item.name}
                                                    </div>
                                                    <button onClick={() => removeFromOrderCart(line.item.id)} className="text-neutral-500 hover:text-red-400 px-2">
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {orderCart.length === 0 && !tables.find(t => t.id === selectedTable)?.orders?.length && (
                                        <div className="text-center text-neutral-500 py-10 text-sm">
                                            Select items from the menu
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/10 space-y-3">
                                    <div className="flex justify-between text-white font-bold text-lg">
                                        <span>Total</span>
                                        <span>SAR {
                                            (orderCart.reduce((sum, line) => sum + (line.item.price * line.quantity), 0)) +
                                            (tables.find(t => t.id === selectedTable)?.orders?.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0)
                                        }</span>
                                    </div>
                                    <Button
                                        variant="gold"
                                        className="w-full"
                                        disabled={orderCart.length === 0}
                                        onClick={submitOrder}
                                    >
                                        {tables.find(t => t.id === selectedTable)?.orders?.length ? 'Add to Order' : 'Confirm Order'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
