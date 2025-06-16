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
            className={`flex gap-2 py-2 px-4 rounded-3xl border text-sm shadow items-center ${className}`}
        >
            <div className="flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 leading-snug text-center">
                {message}
            </div>
        </div>
    );
}
