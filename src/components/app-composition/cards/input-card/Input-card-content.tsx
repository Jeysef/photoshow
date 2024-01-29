"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/card";
import { Form } from "@/components/components/form";
import { UploadDropzone } from "@/components/components/upload-dropzone";
import { CurrentStateContext } from "@/components/pages/edit/page-layout";
import { useContext } from "react";
import { type UseFormReturn } from "react-hook-form";
import { FormFieldNames, type FormValues } from "../../../pages/edit/formSchema";
export interface IInputCardContentProps {
    form: UseFormReturn<FormValues>;
}

function InputCardContent(props: IInputCardContentProps) {
    const { form } = props;
    const context = useContext(CurrentStateContext);

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Upload Images</CardTitle>
                <CardDescription>Enter photos below</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form>
                        <UploadDropzone
                            onSubmit={async (files) => {
                                const formData = new FormData();
                                files.forEach((file) => {
                                    formData.append(FormFieldNames.FILES, file);
                                });
                                void context.upload({
                                    formData,
                                    formValues: form.getValues(),
                                });
                            }}
                            form={form}
                            fileTypes={{ image: { maxFileCount: 4, maxFileSize: "8MB", contentDisposition: "inline" } }}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default InputCardContent;
