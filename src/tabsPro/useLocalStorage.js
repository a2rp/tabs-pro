import { useEffect, useRef, useState } from "react";

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
        } catch {
            /* Storage may be unavailable, so the in-memory state remains usable. */
        }
    }, [key, value]);

    const reset = () => {
        try {
            localStorage.removeItem(key);
        } catch {
            /* Storage may be unavailable, but the in-memory state can still reset. */
        }
        setValue(initialValue);
    };

    return [value, setValue, reset];
}
