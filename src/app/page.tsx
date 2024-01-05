import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Button } from "@/components/components/button";

export default async function Home() {
    return (
        <div className="container relative h-full">
            <div className="flex h-full flex-col items-center justify-center">
                <div className="text-center md:text-left">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl">{siteConfig.name}</h1>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">{siteConfig.description}</p>
                    <br />
                    <div className="my-6 w-full overflow-y-auto">
                        <Button asChild>
                            <Link href="/edit">Start editing</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// async function CrudShowcase() {
//   const data = await api.post.getAll.;

//   return (
//     <div className="w-full max-w-xs">
//         <p>You have no posts yet.</p>

//       <CreatePost />
//     </div>
//   );
// }
