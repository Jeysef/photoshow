"use client";
import { AspectRatio } from "@/components/components/aspect-ratio";
import { Button } from "@/components/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/components/card";
import { Skeleton } from "@/components/components/skeleton";
import Text from "@/components/components/typography/text";
import { CurrentStateContext } from "@/components/pages/edit/pageContextProvider";
import { api } from "@/trpc/react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";

function Video() {
    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Video</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                <QueryErrorResetBoundary>
                    {({ reset }) => (
                        <ErrorBoundary
                            fallbackRender={({ error, resetErrorBoundary }) => (
                                <>
                                    <Text variant="lead">There was an error! </Text>
                                    <Button size={"sm"} onClick={() => resetErrorBoundary()}>
                                        Try again
                                    </Button>
                                    <pre className="col-span-2 whitespace-normal">{(error as Error).message}</pre>
                                </>
                            )}
                            onReset={reset}
                        >
                            <Suspense
                                fallback={
                                    <Skeleton>
                                        <AspectRatio ratio={16 / 9} className="flex items-center"></AspectRatio>
                                    </Skeleton>
                                }
                            >
                                <VideoInner />
                            </Suspense>
                        </ErrorBoundary>
                    )}
                </QueryErrorResetBoundary>
            </CardContent>
        </Card>
    );
}

function VideoInner() {
    const { videoUrl, videoId } = useContext(CurrentStateContext);
    const [videoUrlFromVideoId] = api.video.getUrlFromVideoId.useSuspenseQuery({ videoId });
    console.log("🚀 ~ file: video-card.tsx:48 ~ VideoInner ~ videoUrlFromVideoId:", videoUrlFromVideoId);
    return (
        <AspectRatio ratio={16 / 9} className="flex items-center">
            <video controls className="h-full w-full object-contain">
                <source src={videoUrlFromVideoId ?? ""} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </AspectRatio>
    );
}

export default Video;
