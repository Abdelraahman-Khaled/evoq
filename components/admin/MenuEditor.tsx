"use client";

import { Button } from "@/components/ui/button";
import { MenuItem } from "@/lib/menu-data";
import { useState } from "react";
import { X } from "lucide-react";

interface MenuEditorProps {
    item?: MenuItem | null; // If null, we are adding new
    onSave: (item: MenuItem) => void;
    onClose: () => void;
}

export function MenuEditor({ item, onSave, onClose }: MenuEditorProps) {
    const [formData, setFormData] = useState<Partial<MenuItem>>(
        item || {
            id: Math.random().toString(36).substr(2, 9),
            name: "",
            nameAr: "",
            price: 0,
            description: "",
            descriptionAr: "",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", // Default placeholder
            categoryId: "starters",
            isNew: false,
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as MenuItem);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h2 className="text-xl font-serif font-bold text-white">
                        {item ? "Edit Dish" : "Add New Dish"}
                    </h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Name (English)</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-gold-400 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 font-arabic">الاسم (Arabic)</label>
                            <input
                                required
                                dir="rtl"
                                value={formData.nameAr}
                                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-gold-400 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Price (SAR)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-gold-400 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-gold-400 outline-none capitalize"
                            >
                                <option value="starters">Starters</option>
                                <option value="mains">Mains</option>
                                <option value="steaks">Steaks</option>
                                <option value="desserts">Desserts</option>
                                <option value="beverages">Beverages</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Image URL</label>
                        <input
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-neutral-400 focus:border-gold-400 outline-none text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Description</label>
                        <textarea
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-gold-400 outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.available !== false} // Default true
                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                            className="w-4 h-4 rounded border-white/10 bg-black text-gold-400 focus:ring-gold-400"
                            id="available-check"
                        />
                        <label htmlFor="available-check" className="text-sm font-medium text-neutral-300 select-none">
                            Available / Active
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="border-white/10 text-neutral-300">Cancel</Button>
                        <Button type="submit" variant="gold">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
