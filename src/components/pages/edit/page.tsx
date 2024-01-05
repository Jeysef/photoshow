import { type Metadata } from "next";
import PageLayout from "./page-layout";

export const metadata: Metadata = {
    title: "Edit",
    description: "Start your video creation here.",
};

function Page() {
    return (
        <div className="items-start justify-center gap-6 rounded-lg px-8 py-4 md:px-8 md:py-8 grid grid-cols-1 lg:grid-cols-2">
            <PageLayout />
        </div>
    );
}
export default Page;
