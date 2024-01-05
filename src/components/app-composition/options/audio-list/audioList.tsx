"use client";
import { useEffect, useMemo, useState } from "react";
import Audio from "./audio";

export interface IAudioList {
    component: {
        description: JSX.Element;
        preview: JSX.Element;
    };
    name: string;
}

function AudioList(): IAudioList[] {
    const [audioNames, setAudioNames] = useState<string[]>([]);

    useEffect(() => {
        void (async () => {
            const response = await fetch(`/api/audioNames`, { method: "GET", next: { revalidate: 3600 } });
            const audioNames = (await response.json()) as string[];
            setAudioNames(audioNames);
        })();
    }, []);

    const audios = useMemo(() => {
        return audioNames.map((audioName: string) => {
            return { component: Audio({ audioName }), name: audioName };
        });
    }, [audioNames]);

    return audios;
}

export default AudioList;
