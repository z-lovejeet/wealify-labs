"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getPlatformSettings } from "@/app/actions/settings";
import Link from "next/link";
import { X } from "lucide-react";

export default function AnnouncementBanner() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getPlatformSettings();
            setSettings(data);
            if (data.banner_active === 'true' && !pathname.startsWith('/admin')) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        fetchSettings();
    }, [pathname]);

    if (!isVisible) return null;

    return (
        <div className="bg-primary text-primary-foreground px-4 py-2 text-center text-sm font-medium relative">
            {settings.banner_link ? (
                <Link href={settings.banner_link} className="hover:underline">
                    {settings.banner_text}
                </Link>
            ) : (
                <span>{settings.banner_text}</span>
            )}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/80 hover:text-primary-foreground"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
