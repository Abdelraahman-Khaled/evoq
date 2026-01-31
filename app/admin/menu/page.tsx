"use client";

import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { MenuEditor } from "@/components/admin/MenuEditor"; // We will create this
import { MenuItem } from "@/lib/menu-data";

export default function AdminMenuPage() {
    const { menuItems, deleteMenuItem, addMenuItem, updateMenuItem } = useStore();
    const [editingItem, setEditingItem] = useState<MenuItem | null | undefined>(undefined); // undefined = closed, null = new, object = edit

    const handleSave = (item: MenuItem) => {
        if (editingItem) {
            updateMenuItem(item.id, item);
        } else {
            addMenuItem(item);
        }
        setEditingItem(undefined);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif text-white font-bold mb-2">Menu Management</h1>
                    <p className="text-neutral-400">Manage your dishes, prices, and availability.</p>
                </div>
                <Button variant="gold" onClick={() => setEditingItem(null)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Dish
                </Button>
            </div>

            <div className="border border-white/10 rounded-xl overflow-hidden bg-neutral-900/50">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-neutral-400">
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {menuItems.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 w-24">
                                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/10">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-white">{item.name}</div>
                                    <div className="text-xs text-neutral-500 font-arabic">{item.nameAr}</div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/5 text-neutral-300 capitalize">
                                        {item.categoryId}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-gold-400">{item.price} SAR</td>
                                <td className="p-4">
                                    {item.available !== false ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                                            Inactive
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-neutral-400 hover:text-white"
                                            onClick={() => setEditingItem(item)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-red-400/10"
                                            onClick={() => deleteMenuItem(item.id)}
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingItem !== undefined && (
                <MenuEditor
                    item={editingItem}
                    onClose={() => setEditingItem(undefined)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
