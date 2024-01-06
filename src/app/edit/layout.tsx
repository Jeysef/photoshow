import { SiteHeader } from "@/components/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full w-full">
            <SiteHeader />
            <div className="container relative">{children}</div>
        </div>
    );
}
