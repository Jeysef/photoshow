"use client";
import { AspectRatio } from "@/components/components/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/components/card";

interface IVideoProps {
    url: string;
}

function Video(props: IVideoProps) {
    const { url } = props;
    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Video</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                <AspectRatio ratio={16 / 9} className="flex items-center">
                    <video controls className="h-full w-full object-contain">
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </AspectRatio>
            </CardContent>
        </Card>
    );
}

export default Video;
