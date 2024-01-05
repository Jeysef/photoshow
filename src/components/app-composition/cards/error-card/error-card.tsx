import { Alert, AlertDescription, AlertTitle } from "@/components/components/alert";

export function Error() {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="leading-7">We are sorry, but we could not load the video. Please try again later.</AlertDescription>
        </Alert>
    );
}
