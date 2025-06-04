import { useEffect, useRef } from "react";

export function useAutoResizeTextarea(value: string, maxRows = 3) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || "20");
            const maxHeight = lineHeight * maxRows;

            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        }
    }, [value, maxRows]);

    return textareaRef;
}

