const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.menuItem.createMany({
        data: [
            {
                name: "Luminescence Salad",
                description: "Organic greens, edible flowers, bioluminescent dressing.",
                price: 18,
                category: "Starters",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
                available: true
            },
            {
                name: "Nebula Steak",
                description: "A5 Wagyu beef, truffle dust, galaxy glaze.",
                price: 85,
                category: "Mains",
                image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
                available: true
            },
            {
                name: "Stardust Mousse",
                description: "Dark chocolate, gold dust, raspberry core.",
                price: 16,
                category: "Desserts",
                image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
                available: true
            },
            {
                name: "Moonlight Elixir",
                description: "Butterfly pea flower tea, lemon, silver edible glitter.",
                price: 12,
                category: "Drinks",
                image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
                available: true
            }
        ],
    });

    await prisma.table.createMany({
        data: [
            { id: 1, seats: 2, status: 'free' },
            { id: 2, seats: 4, status: 'free' },
            { id: 3, seats: 4, status: 'reserved' },
            { id: 4, seats: 6, status: 'free' },
            { id: 5, seats: 2, status: 'occupied' }, // Will need orders logic in real app, simply occupied here
            { id: 6, seats: 8, status: 'free' },
        ]
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
