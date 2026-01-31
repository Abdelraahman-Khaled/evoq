"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, ChefHat } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Cart() {
    const { cart, removeFromCart, submitOrderToTable, tables } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [guestCount, setGuestCount] = useState("2");
    const [tableNumber, setTableNumber] = useState("");
    const [step, setStep] = useState<'cart' | 'table'>('cart');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setStep('table');
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tableNumber) return;

        const tableId = parseInt(tableNumber);

        // Validation: Check if table exists
        const isValidTable = tables.some(t => t.id === tableId);

        if (!isValidTable) {
            alert(`Error: Table ${tableNumber} does not exist. Please check the number on your table stand.`);
            return;
        }

        const result = await submitOrderToTable(tableId, cart, parseInt(guestCount) || 1);

        if (result.success) {
            setStep('cart');
            setTableNumber("");
            setIsOpen(false);
            alert(`Order sent to kitchen for Table ${tableNumber}!`);
        } else {
            alert(`Failed: ${result.error}`);
        }
    };

    if (cart.length === 0 && !isOpen) return null;

    return (
        <>
            {/* Floating Trigger */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button
                    variant="gold"
                    size="lg"
                    className="rounded-full h-16 w-16 shadow-xl relative"
                    onClick={() => setIsOpen(true)}
                >
                    <ShoppingBag className="w-6 h-6" />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-black">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Cart Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                                    <ChefHat className="text-gold-400" /> Your Selection
                                </h2>
                                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="text-center text-white/40 py-20">
                                        Your cart is empty.
                                    </div>
                                ) : (
                                    <>
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                                                <div className="w-16 h-16 rounded-lg bg-neutral-800 overflow-hidden relative shrink-0">
                                                    {/* We use standard img for simplicity here to avoid Next Image complexities in dynamic lists if not configured */}
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-medium text-white">{item.name}</h4>
                                                        <span className="font-mono text-gold-400">{item.price * item.quantity}</span>
                                                    </div>
                                                    <div className="flex justify-between items-end mt-2">
                                                        <span className="text-xs text-white/50">Qty: {item.quantity}</span>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-xs text-red-400 hover:text-red-300 underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/5 bg-black/40 space-y-4">
                                {step === 'cart' ? (
                                    <>
                                        <div className="flex justify-between text-xl font-bold text-white">
                                            <span>Total</span>
                                            <span>{total} SAR</span>
                                        </div>
                                        <Button
                                            variant="gold"
                                            className="w-full h-12 text-lg"
                                            disabled={cart.length === 0}
                                            onClick={handleCheckout}
                                        >
                                            Complete Order
                                        </Button>
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmitOrder} className="space-y-4 animate-in slide-in-from-right">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-400 mb-1">
                                                    Table Number
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="e.g. 5"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-400 outline-none"
                                                    value={tableNumber}
                                                    onChange={(e) => setTableNumber(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-400 mb-1">
                                                    Number of Guests
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    placeholder="e.g. 2"
                                                    min="1"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-gold-400 outline-none"
                                                    value={guestCount}
                                                    onChange={(e) => setGuestCount(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/50">Look for the number on your table stand.</p>
                                        <div className="flex gap-3">
                                            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('cart')}>
                                                Back
                                            </Button>
                                            <Button type="submit" variant="gold" className="flex-1">
                                                Submit Order
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
