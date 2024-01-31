import { SiteHeader } from "@/components/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-x-0 top-0">
                <SiteHeader />
            </div>
            <div className="container relative h-full max-w-container">
                <div className="flex h-full flex-col items-center justify-center">{children}</div>
            </div>
        </div>
    );
}
