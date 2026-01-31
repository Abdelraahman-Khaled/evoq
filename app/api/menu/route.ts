import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const items = await prisma.menuItem.findMany();
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check for duplicate name
        const existingItem = await prisma.menuItem.findFirst({
            where: { name: body.name }
        });

        if (existingItem) {
            return NextResponse.json({ error: 'Item with this name already exists' }, { status: 400 });
        }

        const item = await prisma.menuItem.create({
            data: {
                name: body.name,
                description: body.description,
                price: parseFloat(body.price),
                category: body.categoryId || body.category, // Map categoryId to category
                image: body.image,
                available: body.available ?? true,
            },
        });
        // Map back to frontend structure if necessary, or ensure frontend handles 'category'
        // For now, we return as is.
        return NextResponse.json(item);
    } catch (error) {
        console.error("Create Menu Item Error:", error);
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        await prisma.menuItem.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        // Handle category mapping if present
        if (updates.categoryId) {
            updates.category = updates.categoryId;
            delete updates.categoryId;
        }

        const item = await prisma.menuItem.update({
            where: { id },
            data: updates
        });
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}
