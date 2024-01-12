import camera from "./camera.jpg";
import photo from "./photo.jpg";
import photos from "./photos.jpg";
import slideshow from "./slideshow.jpg";
import { buttonVariants } from "@/components/components/button";
import Heading from "@/components/components/typography/heading";
import Text from "@/components/components/typography/text";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/config/site";
import { ArrowDownCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-x-0 top-0">
                <SiteHeader />
            </div>
            <div className="container relative h-full max-w-container">
                <div className="flex h-full flex-col items-center justify-center">
                    <div className="text-center md:text-left">
                        <Heading variant={"h1"}>{siteConfig.name}</Heading>
                        <Text className="leading-7 [&:not(:first-child)]:mt-6">{siteConfig.description}</Text>
                        <br />
                        <Link className={buttonVariants({ className: "mt-8" })} href="/edit">
                            Start editing
                        </Link>
                    </div>
                    <div className="absolute inset-auto bottom-8">
                        <Link href="#about">
                            <ArrowDownCircle className="h-12 w-12 text-primary-foreground" />
                        </Link>
                    </div>
                </div>
                <div id="about" className="mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
                        <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
                            <Heading variant="h2">What is Photoshow?</Heading>
                            <Text>
                                Photoshow is a web application that allows users to create stunning photo slideshows with ease. Whether you want to showcase
                                your travel adventures, highlight your portfolio, or create a memorable presentation, Photoshow has got you covered.
                            </Text>
                            <Text className="mt-4">
                                With a user-friendly interface and a wide range of customization options, Photoshow empowers you to create visually stunning
                                slideshows that captivate your audience.
                            </Text>
                            <Text>Get started today and unleash your creativity with Photoshow!</Text>
                            <Text>
                                <Link className={buttonVariants({ size: "sm" })} href="/edit">
                                    Start editing
                                </Link>
                            </Text>
                        </div>
                        <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                            <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                                <Image src={photos} alt="Slideshow example" className="ml-4 aspect-[7/5] w-[37rem] max-w-none rounded-2xl object-cover" />
                            </div>
                            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                                <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                                    <Image
                                        src={camera}
                                        alt="Slideshow example"
                                        className=" aspect-[4/3] h-auto w-[24rem] max-w-none flex-none rounded-2xl object-cover"
                                    />
                                </div>
                                <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                                    <Image
                                        src={slideshow}
                                        alt="Slideshow example"
                                        className="aspect-[7/5] h-auto  w-[37rem] max-w-none flex-none rounded-2xl object-cover"
                                    />
                                </div>
                                <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                                    <Image src={photo} alt="Slideshow example" className=" aspect-[4/3] h-auto w-[24rem] max-w-none rounded-2xl object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
