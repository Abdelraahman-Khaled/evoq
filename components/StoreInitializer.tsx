



"use client";

import { useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function StoreInitializer() {
    const initialized = useRef(false);
    const { fetchInitialData } = useStore();

    useEffect(() => {
        if (!initialized.current) {
            fetchInitialData();
            initialized.current = true;
        }
    }, [fetchInitialData]);

    return null;
}
