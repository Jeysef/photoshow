"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { siteConfig } from "../config/site";
import { buttonVariants } from "./components/button";
import { Separator } from "./components/separator";
import { Icons } from "./icons";
import { MainNav } from "./main-nav";
import { ModeToggle } from "./theme-toggle";

export function SiteHeader() {
    return (
        <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-14 items-center">
                <MainNav />
                <div className="flex h-full flex-1 items-center justify-between space-x-2 py-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none"></div>
                    <nav className="flex h-full items-center space-x-2">
                        <Link
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                                buttonVariants({
                                    variant: "ghost",
                                }),
                                "w-9 px-0",
                            )}
                        >
                            <Icons.gitHub className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <ModeToggle />
                        <Separator orientation="vertical" />
                        <div />
                        <UserButtonComponent />
                    </nav>
                </div>
            </div>
        </header>
    );
}

function UserButtonComponent() {
    return (
        <div className="">
            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <SignInButton afterSignUpUrl="/" />
            </SignedOut>
        </div>
    );
}
