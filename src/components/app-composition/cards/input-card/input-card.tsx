import { getProcessData, submit } from "@/core/createShow";
import { OutputResolution } from "@/core/schemas/enums";
import { type IConfig, OrientationType, ProcessState, SubmitTripIdReturn } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "next-usequerystate";
import { useCallback, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormFieldNames, type FormValues, formSchema } from "../../../pages/edit/formSchema";
import { CurrentStateContext } from "../../../pages/edit/page-layout";
import { LoadingState } from "../../../pages/edit/types";
import InputCardContent from "./Input-card-content";

export const defaultValues: FormValues = {
    [FormFieldNames.ORIENTATION]: OrientationType.LANDSCAPE,
    [FormFieldNames.RESOLUTION]: OutputResolution.FULL_HD,
    [FormFieldNames.SOUNDTRACK]: "automatic",
    [FormFieldNames.FILES]: 0,
};

function InputCard() {
    const context = useContext(CurrentStateContext);
    const [query, setQuery] = useQueryState("videoId", { history: "push", shallow: false });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleIntervalTimeout = useCallback(
        (interval: NodeJS.Timeout) => {
            clearInterval(interval);
            if (context.state === LoadingState.CONNECTING || context.state === LoadingState.LOADING) {
                context.setState(LoadingState.ERROR);
            }
        },
        [context],
    );

    const handleSuccess = useCallback(
        (interval: NodeJS.Timeout) => {
            context.setState(LoadingState.SUCCESS);
            context.setVideoProgress(100);
            clearInterval(interval);
        },
        [context],
    );

    const handleError = useCallback(
        (interval: NodeJS.Timeout) => {
            context.setState(LoadingState.ERROR);
            clearInterval(interval);
        },
        [context],
    );

    const getProgress = useCallback(
        (videoId: string, interval: NodeJS.Timeout) => {
            getProcessData({ videoId })
                .then((progress) => {
                    if (progress === false) {
                        if (context.state === LoadingState.LOADING) {
                            context.setState(LoadingState.ERROR);
                        } else {
                            context.setState(LoadingState.CONNECTING);
                            setTimeout(handleIntervalTimeout, 6000);
                        }
                    } else if (progress.state === ProcessState.SUCCESS) {
                        handleSuccess(interval);
                    } else if (progress.state === ProcessState.ERROR) {
                        handleError(interval);
                    } else if (progress.state === ProcessState.LOADING_VIDEO || progress.state === ProcessState.LOADING_IMAGES) {
                        context.setState(LoadingState.LOADING);
                        context.setVideoProgress(progress.meta.videoProgress ?? 0);
                    } else {
                        handleError(interval);
                    }
                })
                .catch(() => {
                    handleError(interval);
                });
        },
        [context, handleError, handleIntervalTimeout, handleSuccess],
    );

    const pullProgress = useCallback(
        (videoId: string) => {
            const interval = setInterval(() => {
                getProgress(videoId, interval);
            }, 1000);
            setTimeout(handleIntervalTimeout, 120000);
        },
        [getProgress, handleIntervalTimeout],
    );

    const handleSubmit = async (formData: FormData) => {
        context.setState(LoadingState.CONNECTING);
        setTimeout(handleIntervalTimeout, 6000);

        const formValues = form.getValues();
        const config: IConfig = {
            soundtrack: formValues.soundtrack,
            resolution: formValues.resolution,
            orientation: formValues.orientation,
            title: formValues.title,
        };
        console.log("🚀 ~ file: input-card.tsx:102 ~ handleSubmit ~ formData:", formData.getAll(FormFieldNames.FILES));
        const response = await submit({ config, formData });
        console.log("🚀 ~ file: input-card.tsx:103 ~ handleSubmit ~ response:", response);
        context.setVideoId(response.videoId);
        switch (response.state) {
            case SubmitTripIdReturn.FINISHED:
                context.setState(LoadingState.SUCCESS);
                return response;
            case SubmitTripIdReturn.ERROR:
                context.setState(LoadingState.ERROR);
                return Promise.reject();
            case SubmitTripIdReturn.RUNNING:
                pullProgress(response.videoId);
                return response;
        }
    };

    const handleFormAction = async (formData: FormData) => {
        const returnValue = await handleSubmit(formData);
        void setQuery(returnValue.videoId);
    };

    useEffect(() => {
        const videoId = query;
        if (videoId) {
            getProcessData({ videoId })
                .then((progress) => {
                    if (progress) {
                        switch (progress.state) {
                            case ProcessState.SUCCESS:
                                context.setState(LoadingState.SUCCESS);
                                break;
                            case ProcessState.LOADING_IMAGES:
                            case ProcessState.LOADING_VIDEO:
                                pullProgress(videoId);
                                break;
                        }
                    }
                })
                .catch(() => {
                    context.setState(LoadingState.ERROR);
                });
        }
    }, [query]);

    return <InputCardContent form={form} handleFormAction={handleFormAction} />;
}

export default InputCard;
