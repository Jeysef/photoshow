import { cn } from "@/lib/utils";
import PageContextProvider from "./pageContextProvider";
import { InputSide, VideoSide } from "./pageSides";

export function CardContainer({ children }: { children: JSX.Element }) {
    return (
        <div className="grid items-start">
            <div className={cn("flex items-center justify-center [&>div]:w-full")}>{children}</div>
        </div>
    );
}

function PageLayout() {
    return (
        <PageContextProvider>
            <InputSide />
            <VideoSide />
        </PageContextProvider>
    );
}

export default PageLayout;
