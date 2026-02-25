'use client'
import { useEffect, useState } from "react"

export function useIsDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return true;
        return matchMedia("(prefers-color-scheme:dark)").matches
    });
    useEffect(() => {
        const controller = new AbortController()
        window.matchMedia("(prefers-color-scheme:dark)").addEventListener('change', (e) => {
            setIsDark(e.matches);
        }, { signal: controller.signal })
        return () => {
            controller.abort();
        }
    })

    return isDark
}