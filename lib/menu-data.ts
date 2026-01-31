export type Category = {
    id: string;
    name: string;
    nameAr: string;
};

export type MenuItem = {
    id: string;
    categoryId: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    price: number;
    image: string;
    isVegetarian?: boolean;
    isSpicy?: boolean;
    isNew?: boolean;
    available?: boolean;
};

export const CATEGORIES: Category[] = [
    { id: "starters", name: "Starters", nameAr: "المقبلات" },
    { id: "mains", name: "Main Course", nameAr: "الأطباق الرئيسية" },
    { id: "steaks", name: "Prime Steaks", nameAr: "الستيك الفاخر" },
    { id: "desserts", name: "Desserts", nameAr: "الحلويات" },
    { id: "drinks", name: "Beverages", nameAr: "المشروبات" },
];

export const MENU_ITEMS: MenuItem[] = [
    {
        id: "1",
        categoryId: "starters",
        name: "Truffle Arancini",
        nameAr: "أرانتشيني الترافل",
        description: "Crispy risotto balls infused with black truffle oil, served with garlic aioli.",
        descriptionAr: "كرات أرز مقرمشة بنكهة زيت الترافل الأسود، تقدم مع صلصة الثوم.",
        price: 65,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop",
        isVegetarian: true,
    },
    {
        id: "2",
        categoryId: "starters",
        name: "Wagyu Beef Carpaccio",
        nameAr: "كارباتشيو لحم الواغيو",
        description: "Thinly sliced raw beef, parmesan shavings, capers, truffle oil.",
        descriptionAr: "شرائح رقيقة من لحم البقر النيء، جبن بارميزان، نبات الكبر، وزيت الترافل.",
        price: 95,
        image: "https://images.unsplash.com/photo-1544025162-d7669d26563d?q=80&w=2069&auto=format&fit=crop",
    },
    {
        id: "3",
        categoryId: "mains",
        name: "Pan Seared Salmon",
        nameAr: "سالمون مشوي",
        description: "Crispy skin salmon, asparagus, lemon butter sauce.",
        descriptionAr: "سالمون بجلد مقرمش، هليون، وصلصة زبدة الليمون.",
        price: 140,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=1887&auto=format&fit=crop",
    },
    {
        id: "4",
        categoryId: "steaks",
        name: "Filet Mignon (200g)",
        nameAr: "فيليه مينيون (200 جرام)",
        description: "Tenderloin cut, served with mashed potatoes and peppercorn sauce.",
        descriptionAr: "قطعة تندرلوين، تقدم مع بطاطس مهروسة وصلصة الفلفل.",
        price: 220,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop", // Placeholder
    },
    {
        id: "5",
        categoryId: "desserts",
        name: "Golden Saffron Cake",
        nameAr: "كيكة الزعفران الذهبية",
        description: "Signature sponge cake soaked in saffron milk, topped with gold leaf.",
        descriptionAr: "كيكة إسفنجية مميزة بنكهة الزعفران، مغطاة بالذهب.",
        price: 60,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1989&auto=format&fit=crop",
        isNew: true,
    },
];
