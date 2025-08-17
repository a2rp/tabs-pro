import { useEffect, useRef, useState } from "react";

/** Tiny hook: JSON get/set with a reset helper */
export default function useLocalStorage(key, initialValue) {
    const firstRenderRef = useRef(true);
    const [value, setValue] = useState(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw != null ? JSON.parse(raw) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }, [key, value]);

    const reset = () => {
        try {
            localStorage.removeItem(key);
        } catch {}
        setValue(initialValue);
    };

    return [value, setValue, reset];
}
