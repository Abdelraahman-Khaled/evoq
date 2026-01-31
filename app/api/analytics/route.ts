import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const period = searchParams.get('period') || 'today'; // today, week, month, custom
        const customDate = searchParams.get('date');

        // Define date range
        const now = new Date();
        let startDate = new Date();
        let endDate: Date | undefined = undefined;

        if (period === 'custom' && customDate) {
            startDate = new Date(customDate);
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
        } else if (period === 'today') {
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        }

        // Fetch Completed Orders
        const whereClause: any = {
            status: 'completed',
            createdAt: { gte: startDate }
        };

        if (endDate) {
            whereClause.createdAt = { gte: startDate, lte: endDate };
        }

        const completedOrders = await prisma.order.findMany({
            where: whereClause,
            include: { items: { include: { menuItem: true } } }
        });

        // Calculate Stats
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = completedOrders.length;

        // Calculate Top Selling Items
        const itemStats: Record<string, { name: string; count: number; revenue: number }> = {};

        completedOrders.forEach(order => {
            order.items.forEach(item => {
                // Group by NAME to ensure deleted/re-created items are merged
                // Fallback to 'Unknown' if name is missing (shouldn't happen often)
                const key = item.menuItem?.name || item.menuItemId;

                if (!itemStats[key]) {
                    itemStats[key] = {
                        name: key,
                        count: 0,
                        revenue: 0
                    };
                }
                itemStats[key].count += item.quantity;
                itemStats[key].revenue += item.price * item.quantity;
            });
        });

        const topItems = Object.values(itemStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Calculate Guests (from Completed Orders + Arrived Reservations as fallback/validation if needed, 
        // but User requested counting from Orders for accuracy including walk-ins)

        // We will sum up 'guests' from the completed orders we already fetched.
        const totalGuests = completedOrders.reduce((sum, order) => sum + (order.guests || 1), 0);

        return NextResponse.json({
            revenue: totalRevenue,
            orders: totalOrders,
            guests: totalGuests,
            topItems,
            period
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
