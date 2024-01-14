"use client";
import { buttonVariants } from "@/components/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/card";
import { Form } from "@/components/components/form";
import { typographyVariants } from "@/components/components/typography";
import { UploadDropzone } from "@/components/components/uploadthing";
import { cn } from "@/lib/utils";
import { type IConfig } from "@/types/types";
import { UploadCloud } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "../../../pages/edit/formSchema";
import Options from "../../options/options";
import styles from "./styles.module.css";

export interface IInputCardContentProps {
    form: UseFormReturn<FormValues>;
}

function InputCardContent(props: IInputCardContentProps) {
    const { form } = props;
    const [disabled, setDisabled] = useState(false);
    const config = useRef<IConfig>({});
    const wrapperId = useId();
    const portalId = useId();
    // const [isButtonVisible, setIsButtonVisible] = useState(false);
    const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);

    const ImageUploadDropzone = useMemo(() => {
        return (
            <UploadDropzone
                input={{ config }}
                endpoint="imageUploader"
                appearance={{
                    button: cn(buttonVariants({ variant: "default" }), "after:bg-brand", "col-span-1 justify-self-start order-10", "[&>svg]:text-black"),
                    label: cn(typographyVariants({ variant: "p" }), "hover:text-brand", "col-span-2"),
                    allowedContent: cn(typographyVariants({ variant: "mutedText" }), "col-span-2"),
                    container: cn("grid justify-items-center grid-cols-2 gap-x-4", styles.container),
                }}
                content={{
                    uploadIcon: (
                        <>
                            <UploadCloud width={48} height={48} className="col-span-2 hover:opacity-90" />
                            <div id={portalId}></div>
                        </>
                    ),
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
                onBeforeUploadBegin={(files) => {
                    const formValues = form.getValues();
                    config.current = {
                        soundtrack: formValues.soundtrack,
                        resolution: formValues.resolution,
                        orientation: formValues.orientation,
                        title: formValues.title,
                    } as IConfig;
                    return files;
                }}
                onUploadBegin={() => setDisabled(true)}
                onClientUploadComplete={() => setDisabled(false)}
                config={{
                    appendOnPaste: true,
                    mode: "manual",
                }}
            />
        );
    }, []);

    useEffect(() => {
        const targetNode = document.getElementById(wrapperId); // Replace with the actual ID of your component root
        const config = { childList: true, subtree: true };

        const callback: MutationCallback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node as Element).matches && (node as Element).matches('[data-ut-element="button"]')) {
                            // The added node is an element with the specified data attribute
                            console.log('Element with data-ut-element="button" added:', node);

                            // const newDiv = document.createElement("div");
                            // newDiv.id = buttonWrapperId;
                            // newDiv.className = "mt-4 col-span-1 justify-self-end";

                            // Wrap the button with the new div
                            if (node.parentElement) {
                                setContainerElement(node.parentElement);
                            }
                        }
                    });
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (node as Element).matches && (node as Element).matches('[data-ut-element="button"]')) {
                            // The removed node is an element with the specified data attribute
                            console.log('Element with data-ut-element="button" removed:', node);

                            // Unwrap the button from the div
                            setContainerElement(null);
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);

        if (targetNode) {
            observer.observe(targetNode, config);
        }

        return () => observer.disconnect();
    }, []);

    // const buttonElement = document.querySelector(`[data-ut-element="button"]`);
    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Upload Images</CardTitle>
                <CardDescription>Enter photos below</CardDescription>
            </CardHeader>
            <CardContent>
                <div id={wrapperId}>{ImageUploadDropzone}</div>
                <Form {...form}>
                    <form>
                        {containerElement &&
                            createPortal(
                                <Options
                                    className="order-9 mt-4 w-1/4 justify-self-end"
                                    disabled={disabled}
                                    onSubmit={() => {
                                        undefined;
                                    }}
                                    form={form}
                                    aria-disabled={disabled}
                                />,
                                containerElement,
                            )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default InputCardContent;
