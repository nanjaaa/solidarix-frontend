import { type ReactNode } from "react";

interface InfoBannerProps {
    icon: ReactNode;
    message: ReactNode;
    className?: string;
}

export default function InfoBanner({
    icon,
    message,
    className = "",
}: InfoBannerProps) {
    return (
        <div
            className={`flex items-center justify-center gap-2 p-2 px-4 rounded-full border text-sm shadow ${className}`}
        >
            {icon}
            <span>{message}</span>
        </div>
    );
}
