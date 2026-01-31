import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const tables = await prisma.table.findMany({
            include: {
                orders: {
                    where: { status: 'open' },
                    include: {
                        items: {
                            include: { menuItem: true }
                        }
                    }
                }
            }
        });
        // Mapper to match frontend structure check later
        return NextResponse.json(tables);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const table = await prisma.table.create({
            data: {
                id: body.id,
                seats: body.seats,
                status: body.status || 'free',
            },
        });
        return NextResponse.json(table);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        await prisma.table.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
    }
}
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        const table = await prisma.table.update({
            where: { id },
            data: { status }
        });
        return NextResponse.json(table);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update table status' }, { status: 500 });
    }
}
