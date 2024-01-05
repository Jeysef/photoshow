import "@/components/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark as clerkDarkTheme } from "@clerk/themes";
import "modern-normalize/modern-normalize.css";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { biennale as fontSans } from "../components/fonts/fonts";
import { ThemeProvider } from "../components/theme-provider";
import { siteConfig } from "../config/site";
import { cn } from "../lib/utils";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.name,
    description: siteConfig.description,
    authors: [{ name: "Josef Michalík", url: "https://github.com/Jeysef" }],
    creator: "Jeysef",
    keywords: ["video", "photos", "photoshow", "slideshow", "create", "make", "free", "easy", "fast", "simple", "online"],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 1080,
                alt: siteConfig.name,
            },
        ],
    },
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: clerkDarkTheme,
                layout: {
                    privacyPageUrl: "/privacy/login",
                },
                variables: {
                    fontSize: "1.1rem",
                    colorPrimary: "rgba(45,212,191,.9)",
                    colorTextOnPrimaryBackground: "black",
                },
            }}
        >
            <html lang="en">
                <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        <TRPCReactProvider cookies={cookies().toString()}>{children}</TRPCReactProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
