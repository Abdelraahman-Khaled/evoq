import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        menuItem: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(orders);
    } catch (error: any) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tableId, items, status, orderId, guests } = body;

        // CASE 1: Create Active Order (Customer places order)
        if (status === 'open') {
            // Validate and Sanitize Inputs
            const safeTableId = parseInt(String(tableId));

            let parsedGuests = parseInt(String(guests));
            if (isNaN(parsedGuests) || parsedGuests < 1) {
                parsedGuests = 1;
            }
            const safeGuests = parsedGuests;

            if (isNaN(safeTableId)) {
                throw new Error("Invalid Table ID: " + tableId);
            }

            // Validate Items
            const safeItems = items
                .map((item: any) => ({
                    id: String(item.id),
                    quantity: parseInt(String(item.quantity || 1)),
                    price: parseFloat(String(item.price || 0))
                }))
                .filter((item: any) => {
                    return item.id &&
                        item.id !== 'undefined' &&
                        !isNaN(item.price) &&
                        !isNaN(item.quantity) &&
                        item.quantity > 0;
                });

            if (safeItems.length === 0) {
                throw new Error("No valid items in order");
            }

            const total = safeItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            const finalTotal = isNaN(total) ? 0 : total;

            // Check if there is already an active order for this table
            let activeOrder = await prisma.order.findFirst({
                where: { tableId: safeTableId, status: 'open' }
            });

            if (activeOrder) {
                // Update Existing Order: Add new items
                await prisma.orderItem.createMany({
                    data: safeItems.map((item: any) => ({
                        orderId: activeOrder.id,
                        menuItemId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });

                // Recalculate Total and Update Order
                // Using findUnique to get fresh state before update
                const orderToUpdate = await prisma.order.findUnique({
                    where: { id: activeOrder.id },
                    include: { items: true }
                });

                if (orderToUpdate) {
                    const newTotal = orderToUpdate.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

                    const updatedOrder = await prisma.order.update({
                        where: { id: activeOrder.id },
                        data: { total: newTotal, guests: safeGuests },
                        include: { items: { include: { menuItem: true } } }
                    });

                    // Ensure Table link is active
                    await prisma.table.update({
                        where: { id: safeTableId },
                        data: { status: 'occupied', orderId: activeOrder.id }
                    });

                    return NextResponse.json(updatedOrder);
                }
            }

            // Create New Order
            // Using sequential operations for atomicity and clarity
            const newOrder = await prisma.order.create({
                data: {
                    tableId: safeTableId,
                    status: 'open',
                    total: finalTotal,
                    guests: safeGuests
                }
            });

            // Add Items
            await prisma.orderItem.createMany({
                data: safeItems.map((item: any) => ({
                    orderId: newOrder.id,
                    menuItemId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            // Fetch complete order with relations
            const completeOrder = await prisma.order.findUnique({
                where: { id: newOrder.id },
                include: { items: { include: { menuItem: true } } }
            });

            // Update Table
            await prisma.table.update({
                where: { id: safeTableId },
                data: {
                    status: 'occupied',
                    orderId: newOrder.id
                }
            });

            return NextResponse.json(completeOrder);
        }

        // CASE 2: Close Order
        if (status === 'completed' && orderId) {
            const completedOrder = await prisma.order.update({
                where: { id: orderId },
                data: { status: 'completed' }
            });

            await prisma.table.update({
                where: { id: parseInt(String(tableId)) },
                data: { status: 'free', orderId: null }
            });

            return NextResponse.json(completedOrder);
        }

        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    } catch (error: any) {
        console.error("Order Processing Error:", error);
        return NextResponse.json(
            { error: error.message || 'Failed to process order', details: String(error) },
            { status: 500 }
        );
    }
}