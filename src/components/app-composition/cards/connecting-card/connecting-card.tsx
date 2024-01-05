import { Loader } from "@/components/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/components/card";

function Connecting() {
    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Connecting...</CardTitle>
            </CardHeader>
            <CardContent className="grid place-content-center gap-2">
                <Loader className="h-20 w-20" />
            </CardContent>
        </Card>
    );
}

export default Connecting;
