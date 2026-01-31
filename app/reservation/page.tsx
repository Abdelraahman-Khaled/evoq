"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function ReservationPage() {
    const { addReservation } = useStore();
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        guests: "2",
        name: "",
        phone: "",
        notes: ""
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Add to global store
        addReservation({
            name: formData.name,
            date: formData.date,
            time: formData.time,
            guests: parseInt(formData.guests),
            phone: formData.phone,
            notes: formData.notes,
        });

        // Simulation of API call
        setTimeout(() => {
            setSuccess(true);
        }, 800);
    };

    return (
        <main className="min-h-screen bg-black selection:bg-gold-400 selection:text-black">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center">
                <div className="text-center mb-12 space-y-4">
                    <span className="text-gold-400 tracking-widest text-sm uppercase font-medium">Reservations</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white font-bold">Book Your Table</h1>
                    <p className="text-white/60 text-lg max-w-xl mx-auto">
                        Secure your spot at ÉVOQUÉ for an unforgettable dining experience.
                    </p>
                </div>

                <div className="w-full max-w-2xl bg-neutral-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gold-400" /> Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                                    />
                                </div>

                                {/* Time */}
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gold-400" /> Time
                                    </label>
                                    <select
                                        name="time"
                                        required
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all appearance-none"
                                    >
                                        <option value="" className="bg-neutral-900">Select Time</option>
                                        <option value="18:00" className="bg-neutral-900">6:00 PM</option>
                                        <option value="19:00" className="bg-neutral-900">7:00 PM</option>
                                        <option value="20:00" className="bg-neutral-900">8:00 PM</option>
                                        <option value="21:00" className="bg-neutral-900">9:00 PM</option>
                                        <option value="22:00" className="bg-neutral-900">10:00 PM</option>
                                    </select>
                                </div>

                                {/* Guests */}
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                                        <User className="w-4 h-4 text-gold-400" /> Guests
                                    </label>
                                    <select
                                        name="guests"
                                        required
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all appearance-none"
                                    >
                                        <option value="2" className="bg-neutral-900">2 Guests</option>
                                        <option value="3" className="bg-neutral-900">3 Guests</option>
                                        <option value="4" className="bg-neutral-900">4 Guests</option>
                                        <option value="5" className="bg-neutral-900">5+ Guests</option>
                                    </select>
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-white/80 text-sm font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        required
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-white/80 text-sm font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+966 ..."
                                    required
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                                />
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-white/80 text-sm font-medium">Special Requests</label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    onChange={handleChange}
                                    placeholder="Allergies, anniversaries, etc."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
                                />
                            </div>

                            <Button type="submit" variant="gold" size="lg" className="w-full text-lg h-14">
                                Confirm Reservation
                            </Button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center py-10"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-3xl font-serif text-white mb-2">Reservation Confirmed</h3>
                            <p className="text-white/60 mb-8">
                                Thank you for choosing ÉVOQUÉ. We look forward to serving you.
                                <br />
                                A confirmation has been sent to your phone.
                            </p>
                            <Button variant="outline" onClick={() => setSuccess(false)}>Make Another Booking</Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}
