"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "../config/site";
import { Icons } from "./icons";
import { MainNav } from "./main-nav";
import { ModeToggle } from "./theme-toggle";
import { buttonVariants } from "./components/button";

export function SiteHeader() {
    return (
        <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-14 items-center">
                <MainNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none"></div>
                    <nav className="flex items-center">
                        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                            <div
                                className={cn(
                                    buttonVariants({
                                        variant: "ghost",
                                    }),
                                    "w-9 px-0",
                                )}
                            >
                                <Icons.gitHub className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </div>
                        </Link>
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}
