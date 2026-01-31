import { create } from 'zustand';
import { MenuItem } from './menu-data';

// Types
export type CartItem = MenuItem & { quantity: number };

export type Table = {
    id: number;
    seats: number;
    status: 'free' | 'occupied' | 'reserved';
    orderId: string | null;
    orders: CartItem[];
};

export type Reservation = {
    id: string;
    name: string;
    date: string;
    time: string;
    guests: number;
    phone: string;
    notes: string;
    tableId?: number; // Linked table
    status: 'pending' | 'confirmed' | 'arrived' | 'completed' | 'cancelled';
};

export type OrderHistoryItem = {
    id: string;
    tableId: number;
    date: string;
    total: number;
    items: CartItem[];
};

// Analytics Types
export type AnalyticsData = {
    revenue: number;
    orders: number;
    guests: number;
    topItems: { name: string; count: number; revenue: number }[];
    period: string;
}

type AppState = {
    // Initialization
    isLoading: boolean;
    fetchInitialData: () => Promise<void>;

    // Analytics
    analytics: AnalyticsData | null;
    fetchAnalytics: (period?: string, date?: string) => Promise<void>;

    // Menu State
    menuItems: MenuItem[];
    addMenuItem: (item: MenuItem) => Promise<void>;
    updateMenuItem: (id: string, updates: Partial<MenuItem>) => void; // TODO: Implement API
    deleteMenuItem: (id: string) => void; // TODO: Implement API

    // User Cart State
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;

    // POS / Table State
    tables: Table[];
    addTable: (table: Omit<Table, 'status' | 'orders' | 'orderId'>) => Promise<void>;
    deleteTable: (id: number) => Promise<void>;
    updateTableStatus: (id: number, status: Table['status']) => void; // TODO
    submitOrderToTable: (tableId: number, items: CartItem[], guests?: number) => Promise<{ success: boolean; error?: string }>;
    clearTable: (tableId: number) => Promise<void>; // Calls API to archive

    // Reservations
    reservations: Reservation[];
    addReservation: (reservation: Omit<Reservation, 'id' | 'status'>) => Promise<void>;
    updateReservationStatus: (id: string, status: Reservation['status'], tableId?: number, guests?: number) => Promise<void>;

    // Order History
    orderHistory: OrderHistoryItem[];
};

export const useStore = create<AppState>((set, get) => ({
    isLoading: false,

    fetchInitialData: async () => {
        set({ isLoading: true });
        try {
            const [menuRes, tablesRes, resRes, ordersRes] = await Promise.all([
                fetch('/api/menu'),
                fetch('/api/tables'),
                fetch('/api/reservations'),
                fetch('/api/orders')
            ]);

            const rawMenuItems = await menuRes.json();
            const flattenedMenuItems = Array.isArray(rawMenuItems) ? rawMenuItems.map((item: any) => ({
                ...item,
                categoryId: item.category // Map DB category to frontend categoryId
            })) : [];

            const tables = await tablesRes.json();
            const reservations = await resRes.json();
            const orderHistory = await ordersRes.json();

            // Transform DB Tables (Prisma) to Frontend Table structure if needed
            // Prisma tables come with relations, we need to map them to the frontend `Table` type
            const formattedTables = tables.map((t: any) => {
                const activeOrder = t.orders?.[0];
                const mappedOrders = activeOrder ? activeOrder.items.map((i: any) => ({
                    id: i.menuItemId,
                    name: i.menuItem?.name || "Unknown Item",
                    nameAr: i.menuItem?.nameAr,
                    price: i.price,
                    description: i.menuItem?.description,
                    categoryId: i.menuItem?.category,
                    image: i.menuItem?.image,
                    quantity: i.quantity
                })) : [];

                return {
                    id: t.id,
                    seats: t.seats,
                    status: t.status as any,
                    orderId: activeOrder?.id || null,
                    orders: mappedOrders
                };
            });

            // Transform Orders (History)
            const formattedHistory = orderHistory.map((o: any) => ({
                id: o.id,
                tableId: o.tableId,
                date: new Date(o.createdAt).toLocaleString(),
                total: o.total,
                items: o.items.map((i: any) => ({
                    id: i.menuItemId,
                    // We need name/image from menu items ideally, 
                    // but history typically stores snapshot. 
                    // For now, let's trust the item data is enough or mapped
                    price: i.price,
                    quantity: i.quantity,
                    name: "Item" // Placeholder if not joined
                }))
            }));


            set({
                menuItems: flattenedMenuItems,
                tables: Array.isArray(formattedTables) ? formattedTables : [],
                reservations: Array.isArray(reservations) ? reservations : [],
                orderHistory: Array.isArray(formattedHistory) ? formattedHistory : [],
                isLoading: false
            });
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            set({ isLoading: false });
        }
    },

    // Analytics
    analytics: null,
    fetchAnalytics: async (period = 'today', date?: string) => {
        try {
            let url = `/api/analytics?period=${period}`;
            if (date) {
                url += `&date=${date}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            set({ analytics: data });
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        }
    },

    // Menu
    menuItems: [],
    addMenuItem: async (item) => {
        const res = await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (res.ok) {
            const newItem = await res.json();
            set(state => ({ menuItems: [...state.menuItems, newItem] }));
        }
    },
    updateMenuItem: async (id, updates) => {
        // Optimistic update
        set((state) => ({
            menuItems: state.menuItems.map((item) => item.id === id ? { ...item, ...updates } : item)
        }));

        // API Call
        try {
            await fetch('/api/menu', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates })
            });
        } catch (error) {
            console.error("Failed to update menu item", error);
            // Revert? For now, assume success or reload.
        }
    },
    deleteMenuItem: async (id) => {
        // Optimistic update
        set((state) => ({ menuItems: state.menuItems.filter((i) => i.id !== id) }));

        // API Call
        try {
            await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
        } catch (error) {
            console.error("Failed to delete menu item", error);
        }
    },

    // Cart (Client only for now)
    cart: [],
    addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id);
        if (existing) {
            return {
                cart: state.cart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
    removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== itemId),
    })),
    clearCart: () => set({ cart: [] }),

    // POS
    tables: [],
    addTable: async (table) => {
        const res = await fetch('/api/tables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(table)
        });
        if (res.ok) {
            const newTable = await res.json();
            set(state => ({
                tables: [...state.tables, { ...newTable, orders: [] }].sort((a, b) => a.id - b.id)
            }));
        }
    },
    deleteTable: async (id) => {
        await fetch(`/api/tables?id=${id}`, { method: 'DELETE' });
        set(state => ({ tables: state.tables.filter((t) => t.id !== id) }));
    },
    updateTableStatus: async (id, status) => {
        // Optimistic
        set((state) => ({
            tables: state.tables.map((t) => t.id === id ? { ...t, status } : t)
        }));

        await fetch('/api/tables', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
    },
    submitOrderToTable: async (tableId, items, guests) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableId,
                    items,
                    status: 'open',
                    guests: guests || 1
                })
            });

            if (res.ok) {
                const newOrder = await res.json();

                // Map the API order items to the store CartItem format
                const mappedOrderItems = newOrder.items.map((i: any) => ({
                    id: i.menuItemId,
                    name: i.menuItem?.name || "Item",
                    nameAr: i.menuItem?.nameAr,
                    description: i.menuItem?.description,
                    image: i.menuItem?.image,
                    categoryId: i.menuItem?.category,
                    price: i.price,
                    quantity: i.quantity,
                }));

                set((state) => ({
                    tables: state.tables.map((t) => {
                        if (t.id === tableId) {
                            return {
                                ...t,
                                status: 'occupied',
                                orders: mappedOrderItems,
                                orderId: newOrder.id
                            };
                        }
                        return t;
                    }),
                    cart: []
                }));

                get().fetchInitialData();
                get().fetchAnalytics();
                return { success: true };
            }

            const errorData = await res.json().catch(() => ({}));
            return { success: false, error: errorData.error || 'Server error' };

        } catch (error: any) {
            console.error("Failed to submit order", error);
            return { success: false, error: error.message || 'Network error' };
        }
    },
    clearTable: async (tableId) => {
        const state = get();
        const table = state.tables.find(t => t.id === tableId);

        if (table && table.orders.length > 0) {
            // Archive Order via API
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableId,
                    items: table.orders,
                    orderId: table.orderId
                })
            });

            // Re-fetch or manually update? Manually update for speed
            // Also need to complete linked reservation
            const linkedReservation = state.reservations.find(r => r.tableId === tableId && r.status === 'arrived');
            let newReservations = state.reservations;
            if (linkedReservation) {
                newReservations = state.reservations.map(r => r.id === linkedReservation.id ? { ...r, status: 'completed' } : r);
            }

            set({
                reservations: newReservations,
                tables: state.tables.map((t) => t.id === tableId ? { ...t, status: 'free', orders: [], orderId: null } : t),
                // We could fetch history again to see the new order
            });

            // Background fetch history to be safe
            get().fetchInitialData();
        } else {
            set({
                tables: state.tables.map((t) => t.id === tableId ? { ...t, status: 'free', orders: [], orderId: null } : t)
            });
        }
    },

    // Reservations
    reservations: [],
    addReservation: async (res) => {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(res)
        });
        if (response.ok) {
            const newRes = await response.json();
            set(state => ({ reservations: [newRes, ...state.reservations] }));
        }
    },
    updateReservationStatus: async (id, status, tableId, guests) => {
        await fetch('/api/reservations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, tableId, guests })
        });

        set((state) => {
            const newReservations = state.reservations.map((r) => r.id === id ? {
                ...r,
                status,
                tableId,
                guests: guests || r.guests // Update guests if provided
            } : r);

            // Logic for table update
            if (status === 'arrived' && tableId) {
                return {
                    reservations: newReservations,
                    tables: state.tables.map(t => t.id === tableId ? { ...t, status: 'occupied' } : t)
                };
            }
            if (status === 'completed' && tableId) {
                return {
                    reservations: newReservations,
                    tables: state.tables.map(t => t.id === tableId ? { ...t, status: 'free', orders: [], orderId: null } : t)
                };
            }
            return { reservations: newReservations };
        });
    },

    orderHistory: [],
}));
