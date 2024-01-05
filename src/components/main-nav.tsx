"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function MainNav() {
    const pathname = usePathname();

    return (
        <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Icons.logo className="h-6 w-6" />
                <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                    href="/edit"
                    className={cn("transition-colors hover:text-foreground/80", pathname === "/docs" ? "text-foreground" : "text-foreground/60")}
                >
                    Edit
                </Link>
                {/* <Link
                    href="/audio"
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname?.startsWith("/docs/components") ? "text-foreground" : "text-foreground/60",
                    )}
                >
                    Uplaoad audio
                </Link> */}
                {/* <Link href={siteConfig.links.github} className={cn("hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block")}>
                    GitHub
                </Link> */}
            </nav>
        </div>
    );
}
