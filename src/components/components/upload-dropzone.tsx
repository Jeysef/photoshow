import type { ExpandedRouteConfig } from "@uploadthing/shared";
import { UploadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { type UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { allowedContentTextLabelGenerator, classNames, generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
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
    onSubmit: (files: File[]) => Promise<void>;
    form: UseFormReturn<FormValues>;
    config?: {
        mode?: "auto" | "manual";
        appendOnPaste?: boolean;
    };
    fileTypes: ExpandedRouteConfig;
};

export function UploadDropzone(props: UploadDropzoneProps) {
    const onSubmit = props.onSubmit;

    const { mode = "manual", appendOnPaste = false } = props.config ?? {};

    const [files, setFiles] = useState<File[]>([]);

    const { fileTypes } = generatePermittedFileTypes(props.fileTypes);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setFiles(acceptedFiles);
            // If mode is auto, start upload immediately
            if (mode === "auto") {
                void onSubmit(acceptedFiles);
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
        void onSubmit(files);
    };

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            if (!appendOnPaste) return;
            if (document.activeElement !== rootRef.current) return;

            const pastedFiles = getFilesFromClipboardEvent(event);
            if (!pastedFiles) return;

            setFiles((prev) => [...prev, ...pastedFiles]);

            if (mode === "auto") {
                void onSubmit(files);
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, [props, appendOnPaste, mode, fileTypes, rootRef, files]);

    const state = (() => {
        if (!ready) return "readying";
        if (ready) return "ready";
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
                    <Options className="w-1/4" onSubmit={onUploadClick} form={props.form} />

                    <Button variant={"default"} className={"w-36 overflow-hidden"} onClick={onUploadClick} data-ut-element="button" data-state={state}>
                        {`Upload ${files.length} file${files.length === 1 ? "" : "s"}`}
                    </Button>
                </div>
            )}
        </div>
    );
}
