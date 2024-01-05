import { Card, CardContent, CardHeader, CardTitle } from "@/components/components/card";
import { Label } from "@/components/components/label";
import { Progress } from "@/components/components/progress";

interface ILoadingProps {
    videoId: string;
    videoProgress: number;
}

function Loading(props: ILoadingProps) {
    const { videoId, videoProgress } = props;

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Loading video: {videoId}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                <div className="grid gap-2">
                    <Label htmlFor="video">Video</Label>
                    <Progress id="video" value={videoProgress} />
                </div>
            </CardContent>
        </Card>
    );
}

export default Loading;
