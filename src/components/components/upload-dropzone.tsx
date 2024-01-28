import { useCallback, useEffect, useState, type RefObject } from "react";
import { twMerge } from "tailwind-merge";

import { allowedContentTextLabelGenerator, classNames, generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";

import type { ExpandedRouteConfig } from "@uploadthing/shared";
import { Loader2, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { type UseFormReturn } from "react-hook-form";
import Options from "../app-composition/options/options";
import { FormFieldNames, type FormValues } from "../pages/edit/formSchema";
import { Button } from "./button";
import { FormControl, FormField, FormItem } from "./form";
import { Input } from "./input";
import { Label } from "./label";
import { typographyVariants } from "./typography";
import Text from "./typography/text";
import { getFilesFromClipboardEvent } from "./upload-dropzone-shared";

export type UploadDropzoneProps = {
    // onSubmit: (files: File[]) => void;
    form: UseFormReturn<FormValues>;
    formRef: RefObject<HTMLFormElement>;
    config?: {
        mode?: "auto" | "manual";
        appendOnPaste?: boolean;
    };
    fileTypes: ExpandedRouteConfig;
};

export function UploadDropzone(props: UploadDropzoneProps) {
    // Cast back to UploadthingComponentProps<TRouter> to get the correct type
    // since the ErrorMessage messes it up otherwise
    const { mode = "manual", appendOnPaste = false } = props.config ?? {};

    const [files, setFiles] = useState<File[]>([]);

    const [uploadProgressState, setUploadProgress] = useState(0);

    const [isUploading, setIsUploading] = useState(false);

    async function startUpload(formData: FormData, formValues: FormValues) {
        const textDecoder = new TextDecoder();
        const consoleLogStream = new WritableStream<Uint8Array>({
            write(chunk) {
                console.log(textDecoder.decode(chunk));
            },
            close() {
                console.log("done");
            },
            abort(err) {
                console.log("err", err);
            },
        });

        setIsUploading(true);
        fetch("/api/image-upload?" + new URLSearchParams(formValues).toString(), {
            method: "POST",
            body: formData,
            signal: new AbortController().signal,
        })
            .then((response) => {
                if (!response.body) {
                    throw new Error("The response body is empty.");
                }
                void response.body.pipeTo(consoleLogStream);
            })
            .catch((err) => {
                console.log("err", err);
                // handleUnexpectedError(error);
            });
    }

    const { fileTypes } = generatePermittedFileTypes(props.fileTypes);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setFiles(acceptedFiles);
            // If mode is auto, start upload immediately
            if (mode === "auto") {
                // props.onSubmit(acceptedFiles);
                const formData = new FormData();
                acceptedFiles.forEach((file) => {
                    formData.append(FormFieldNames.FILES, file);
                });
                void startUpload(formData, props.form.getValues());
            }
        },
        [props, mode],
    );

    const { getRootProps, getInputProps, isDragActive, rootRef } = useDropzone({
        onDrop,
        accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
        disabled: false,
    });

    const ready = fileTypes.length > 0;

    const onUploadClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!files) return;
        // props.onSubmit(files);
        const formData = new FormData();
        files.forEach((file) => {
            formData.append(FormFieldNames.FILES, file);
        });
        void startUpload(formData, props.form.getValues());
    };

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            if (!appendOnPaste) return;
            if (document.activeElement !== rootRef.current) return;

            const pastedFiles = getFilesFromClipboardEvent(event);
            if (!pastedFiles) return;

            setFiles((prev) => [...prev, ...pastedFiles]);

            if (mode === "auto") {
                // props.onSubmit(files);
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append(FormFieldNames.FILES, file);
                });
                void startUpload(formData, props.form.getValues());
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, [props, appendOnPaste, mode, fileTypes, rootRef, files]);

    const state = (() => {
        if (!ready) return "readying";
        if (ready && !isUploading) return "ready";

        return "uploading";
    })();

    return (
        <div
            className={twMerge(
                "mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center",
                isDragActive && "bg-zinc-600/10",
            )}
            {...getRootProps()}
            data-state={state}
        >
            {<UploadCloud width={48} height={48} />}
            <Label
                htmlFor="file-upload"
                className={twMerge(
                    classNames(
                        "cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-zinc-600 focus-within:ring-offset-2",
                        typographyVariants({ variant: "p", className: "font-semibold" }),
                        ready ? "text-foreground hover:text-brand" : "text-gray-500",
                    ),
                )}
                data-ut-element="label"
                data-state={state}
            >
                {ready ? `Choose files or drag and drop` : `Loading...`}
                <FormField
                    control={props.form.control}
                    name={FormFieldNames.FILES}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="sr-only" {...field} {...getInputProps()} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </Label>
            <Text variant="mutedText" data-ut-element="allowed-content" data-state={state}>
                {allowedContentTextLabelGenerator(props.fileTypes)}
            </Text>
            {files.length > 0 && (
                <div
                    className="mt-4 flex items-center justify-center gap-x-4"
                    onClick={(e) => {
                        e.preventDefault(), e.stopPropagation();
                    }}
                >
                    <Options
                        className="w-1/4"
                        onSubmit={onUploadClick}
                        form={props.form}
                        disabled={state === "uploading"}
                        aria-disabled={state === "uploading"}
                    />

                    <Button
                        variant={"default"}
                        className={"w-36 overflow-hidden"}
                        onClick={onUploadClick}
                        data-ut-element="button"
                        data-state={state}
                        disabled={state === "uploading"}
                        aria-disabled={state === "uploading"}
                    >
                        {state === "uploading" ? (
                            <Loader2 className="z-10 block h-5 w-5 animate-spin align-middle text-black" />
                        ) : (
                            `Upload ${files.length} file${files.length === 1 ? "" : "s"}`
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
