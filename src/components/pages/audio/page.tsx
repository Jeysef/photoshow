"use client";
import { Button } from "@/components/components/button";
import { Skeleton } from "@/components/components/skeleton";
import type { IMood } from "@/types/types";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { analyze } from "web-audio-beat-detector";
import { writeToJsonFile } from "./WriteToMood";

export default function Home() {
    const [bpm, setBpm] = useState<number | null>(null);
    const onDrop = (files: File[]) => {
        void (async (files: File[]) => {
            setBpm(null);
            if (files && files.length > 0 && files[0]) {
                const file = files[0];
                const audioContext = new AudioContext();
                const audioBuffer = await readFileAsArrayBuffer(file);
                const decodedBuffer = await decodeAudioData(audioContext, audioBuffer);
                let tempo = await analyze(decodedBuffer);
                tempo = Math.round(tempo);

                const reader = new FileReader();

                reader.onload = () => {
                    const audioElement = new Audio(reader.result as string);
                    console.log("🚀 ~ file: page.tsx:29 ~ onDrop ~ audioElement:", audioElement);

                    audioElement.onloadedmetadata = async () => {
                        const data: IMood = {
                            name: file.name,
                            tempo,
                            duration: audioElement.duration,
                            manual: false,
                        };

                        await writeToJsonFile(data);
                        setBpm(tempo);
                    };
                };

                reader.readAsDataURL(file);
            } else console.warn("No files provided.");
        })(files);
    };

    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        onDrop: (acceptedFiles) => {
            void onDrop(acceptedFiles);
        },
        accept: { "audio/*": [] },
        multiple: false,
    });
    const acceptedFile = acceptedFiles[0];

    const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    resolve(reader.result);
                } else {
                    reject(new Error("Failed to read audio file."));
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const decodeAudioData = (audioContext: AudioContext, audioBuffer: ArrayBuffer): Promise<AudioBuffer> => {
        return new Promise((resolve, reject) => {
            void audioContext.decodeAudioData(audioBuffer, resolve, reject);
        });
    };

    return (
        <div className="flex h-full flex-col place-content-center items-center gap-4">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Audio Analyzer</h1>
            <div
                {...getRootProps()}
                className="flex border-spacing-0.5 cursor-pointer flex-col items-center gap-4 rounded-sm border-2 border-dashed border-gray-100 px-32 py-8 outline-1 -outline-offset-1 outline-[--background] "
            >
                <p className="leading-7">Drop an audio file here to analyze it.</p>
                <p className="text-sm text-muted-foreground">Or</p>
                <Button onClick={open}>Open File Dialog</Button>
                <input type="file" accept="audio/*" {...getInputProps()} />
            </div>
            <div className="grid grid-cols-1 grid-rows-2 items-center justify-start">
                <div className="flex items-center">
                    <p className="leading-7">Filename:&nbsp;</p>
                    {!acceptedFile?.name ? (
                        <Skeleton className="flex h-[1em] w-48 items-center leading-7" />
                    ) : (
                        <span className="leading-7">{acceptedFile?.name || "Lorem ipsum dolor sit amet."}</span>
                    )}
                </div>
                <div className="flex items-center">
                    <p className="leading-7">BPM:&nbsp;</p>
                    {!(bpm && acceptedFile?.name) ? (
                        <Skeleton className="flex h-[1em] w-10 items-center leading-7" />
                    ) : (
                        <span className="leading-7">{bpm || 100}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
