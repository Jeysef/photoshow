import { Card, CardContent, CardHeader, CardTitle } from "@/components/components/card";
import { Label } from "@/components/components/label";
import { Progress } from "@/components/components/progress";
import { CurrentStateContext, VideoContext } from "@/components/pages/edit/pageContextProvider";
import { LoadingState } from "@/components/pages/edit/types";
import { cn } from "@/lib/utils";
import { useContext, useMemo } from "react";
import styles from "./loading-card.module.css";

function VideoRenderingProgress() {
    const { progress } = useContext(VideoContext);
    return (
        <div className="grid gap-2">
            <Label htmlFor="videoRender">Video rendering</Label>
            <Progress id="videoRender" value={progress} />
        </div>
    );
}

function VideoUploadingProgress() {
    return (
        <div className="grid gap-2">
            <Label htmlFor="videoUpload">Video uploading</Label>
            <Progress id="videoUpload" className={cn("[&>div]:animate-progress-indeterminate", styles.gradient)} value={100} />
        </div>
    );
}

function Loading() {
    const { state } = useContext(CurrentStateContext);
    const { videoId } = useContext(VideoContext);

    const VideoRenderingProgressComponent = useMemo(() => <VideoRenderingProgress />, []);

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Loading video: {videoId}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                {VideoRenderingProgressComponent}
                {state === LoadingState.VIDEO_UPLOADING && <VideoUploadingProgress />}
            </CardContent>
        </Card>
    );
}

export default Loading;
