"use client";

import { Label } from "@/components/components/label";
import { Progress } from "@/components/components/progress";
import { useEffect, useState } from "react";

export default function MyComponent() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setProgress((p) => p + 5), 500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid gap-2">
            <Label htmlFor="videoRender">Video rendering</Label>
            <Progress id="videoRender" value={progress} />
        </div>
    );
}
