import { buttonVariants } from "@/components/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/card";
import { typographyVariants } from "@/components/components/typography";
import { UploadDropzone } from "@/components/components/uploadthing";
import { OutputResolution } from "@/core/schemas/enums";
import { cn } from "@/lib/utils";
import { OrientationType } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { FormFieldNames, formSchema, type FormValues } from "../../../pages/edit/formSchema";
import ButtonsComponent from "../input-card/input-buttons";

export const defaultValues: FormValues = {
    [FormFieldNames.ORIENTATION]: OrientationType.LANDSCAPE,
    [FormFieldNames.RESOLUTION]: OutputResolution.FULL_HD,
    [FormFieldNames.SOUNDTRACK]: "automatic",
};

function InputCard() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });
    const config = {};
    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Upload Images</CardTitle>
                <CardDescription>Drop or paste photos below</CardDescription>
            </CardHeader>
            <CardContent>
                <UploadDropzone
                    input={{ config: "test" }}
                    endpoint="imageUploader"
                    appearance={{
                        button: cn(buttonVariants({ variant: "default" }), "after:bg-accent"),
                        label: cn(typographyVariants({ variant: "p" }), "hover:text-accent"),
                        allowedContent: cn(typographyVariants({ variant: "mutedText" })),
                    }}
                    onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                    }}
                    onBeforeUploadBegin={(files) => {
                        return files;
                    }}
                    config={{
                        appendOnPaste: true,
                        mode: "manual",
                    }}
                />
                <Form {...form}>
                    <form className="grid gap-4">
                        <ButtonsComponent disableSubmit={false} form={form} />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default InputCard;
