import logger from "@/server/video/logger";
import { LoggerEmoji, LoggerState } from "@/server/video/logger/enums";
import { ShowStreamType, type IShowStreamData } from "@/types/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { FormValues } from "./formSchema";
import { LoadingState } from "./types";

export interface IUploaderProps {
    api?: string;
    setState: Dispatch<SetStateAction<LoadingState>>;
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
    const [videoUrl, setVideoUrl] = useState("");

    const jsonParseTransformer = new TransformStream<string, IShowStreamData>({
        transform(chunk, controller) {
            try {
                controller.enqueue(JSON.parse(chunk) as IShowStreamData);
            } catch (err) {
                controller.error(err);
            }
        },
    });

    const handleStream = new WritableStream<IShowStreamData>({
        write: (data) => {
            if (data.type === ShowStreamType.PROGRESS) {
                setProgress(data.progress);
                if (data.progress === 100) {
                    props.setState(LoadingState.VIDEO_UPLOADING);
                }
            }
            if (data.type === ShowStreamType.VIDEO_ID) {
                props.setState(LoadingState.VIDEO_RENDERING);
                setVideoId(data.videoId);
            }
            if (data.type === ShowStreamType.VIDEO_URL) {
                setVideoUrl(data.videoUrl);
                setIsUploading(false);
                setError("");
            }
        },
        close: () => {
            setIsUploading(false);
            props.setState(LoadingState.SUCCESS);
            console.log("🚀 ~ file: uploader.ts:56 ~ close ~ progress:", progress);

            setProgress(0);
            // if (progress === 100) {
            // } else {
            //     setError("The upload is not completed.");
            //     console.log("The upload is not completed.");
            //     props.setState(LoadingState.ERROR);
            // }
        },
        abort: (err: Error) => {
            setError(err.message);
            console.log(err.message);
            props.setState(LoadingState.ERROR);
            setProgress(0);
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

                void response.body.pipeThrough(new TextDecoderStream()).pipeThrough(jsonParseTransformer).pipeTo(handleStream);
            })
            .catch((err: Error) => {
                setIsUploading(false);
                setError(err.message);
                logger.log(LoggerState.ERROR, LoggerEmoji.EMPTY, err.message);
                props.setState(LoadingState.ERROR);
            });
    };
    return { isUploading, progress, error, videoId, videoUrl, upload };
}