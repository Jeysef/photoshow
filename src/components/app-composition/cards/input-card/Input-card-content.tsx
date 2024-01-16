"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/card";
import { Form } from "@/components/components/form";
import { UploadDropzone } from "@/components/components/upload-dropzone";
import { useRef } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "../../../pages/edit/formSchema";
export interface IInputCardContentProps {
    form: UseFormReturn<FormValues>;
}

function InputCardContent(props: IInputCardContentProps) {
    const { form } = props;
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Upload Images</CardTitle>
                <CardDescription>Enter photos below</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form ref={formRef}>
                        <UploadDropzone
                            form={form}
                            formRef={formRef}
                            fileTypes={{ image: { maxFileCount: 4, maxFileSize: "8MB", contentDisposition: "inline" } }}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default InputCardContent;
