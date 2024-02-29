import { buttonVariants } from "@/components/components/button";
import Heading from "@/components/components/typography/heading";
import Text from "@/components/components/typography/text";
import { SiteHeader } from "@/components/site-header";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "./styles.module.css";

export default function AboutMe() {
    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-x-0 top-0">
                <SiteHeader />
            </div>
            <div className="container relative h-full max-w-container">
                <div className={styles.blob} />
                <div className="flex h-full flex-col items-center justify-center">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
                        <div className="lg:w-full lg:max-w-lg lg:pb-8">
                            <Heading variant="h2">About Me</Heading>
                            <Text>
                                I'm Josef, a student at a secondary school in Olomouc. I have a passion for creating cool websites and exploring the endless
                                possibilities of web development.
                            </Text>
                            <Text className="mt-4">
                                Whether it's coding, designing, or experimenting with new technologies, I love diving into the world of web development and
                                bringing my ideas to life.
                            </Text>
                            <Text>
                                <Link className={buttonVariants({ size: "sm" , variant: "link"})} href="/">
                                    <ArrowLeft className="pe-2"/>Back to Home
                                </Link>
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
