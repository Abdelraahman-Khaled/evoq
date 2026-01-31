import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const reservations = await prisma.reservation.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(reservations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const reservation = await prisma.reservation.create({
            data: {
                name: body.name,
                date: body.date,
                time: body.time,
                guests: body.guests,
                phone: body.phone,
                notes: body.notes,
                status: 'pending', // Default
            },
        });
        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status, tableId, guests } = body;

        const updateData: any = { status };
        if (tableId) updateData.tableId = tableId;
        if (guests) updateData.guests = guests;

        const reservation = await prisma.reservation.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
    }
}
