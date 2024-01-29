import { ShowStreamType, type IShowStreamData } from "@/types/types";
import { useState } from "react";
import type { FormValues } from "./formSchema";

export interface IUploaderProps {
    api?: string;
}
export interface IUploaderUploadProps {
    formData: FormData;
    formValues: FormValues;
}

export default function useUploader(props: IUploaderProps) {
    const { api = "/api/image-upload" } = props;
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [videoId, setVideoId] = useState("");

    const handleStream = new WritableStream<IShowStreamData>({
        write(data) {
            if (data.type === ShowStreamType.PROGRESS) {
                setProgress(data.progress);
            }
            if (data.type === ShowStreamType.VIDEO_ID) {
                setVideoId(data.videoId);
            }
            if (data.type === ShowStreamType.VIDEO_URL) {
                setIsUploading(false);
                setError("");
            }
        },
        close() {
            progress === 100 ? setIsUploading(false) : setError("The upload is not completed.");
        },
        abort(err: Error) {
            setError(err.message);
        },
    });

    const upload = async ({ formData, formValues }: IUploaderUploadProps) => {
        setIsUploading(true);
        fetch(api + "?" + new URLSearchParams(formValues).toString(), {
            method: "POST",
            body: formData,
            // signal: new AbortController().signal,
        })
            .then((response) => {
                if (!response.body) {
                    setError("The response body is empty.");
                    throw new Error("The response body is empty.");
                }

                const jsonParseTransformer = new TransformStream<string, IShowStreamData>({
                    transform(chunk, controller) {
                        try {
                            controller.enqueue(JSON.parse(chunk) as IShowStreamData);
                        } catch (err) {
                            controller.error(err);
                        }
                    },
                });

                void response.body.pipeThrough(new TextDecoderStream()).pipeThrough(jsonParseTransformer).pipeTo(handleStream);
            })
            .catch((err: Error) => {
                setIsUploading(false);
                setError(err.message);
            });

        return { isUploading, progress, error, upload };
    };
}
