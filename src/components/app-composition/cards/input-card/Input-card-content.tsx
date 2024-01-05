"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/components/card";
import { Form } from "@/components/components/form";
import { useEffect, useState } from "react";
import { type UseFormReturn, useWatch } from "react-hook-form";
import { FormFieldNames, type FormValues } from "../../../pages/edit/formSchema";
import FileInputList from "../../file-input-list/file-input-list";
import ButtonsComponent from "./input-buttons";

export interface IInputCardContentProps {
    form: UseFormReturn<FormValues>;
    handleFormAction: (formData: FormData) => Promise<void>;
}

function InputCardContent(props: IInputCardContentProps) {
    const { form, handleFormAction } = props;

    const [disabledSubmitInit, setDisabledSubmitInit] = useState(true);

    const files = useWatch({
        control: form.control,
        name: FormFieldNames.FILES,
    });

    useEffect(() => {
        if (disabledSubmitInit) {
            setDisabledSubmitInit(false);
        }
    }, [files]);

    return (
        <Card>
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Upload Images</CardTitle>
                <CardDescription>Enter photos below</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form action={handleFormAction} className="grid gap-4">
                        <FileInputList form={form} />
                        <ButtonsComponent disableSubmit={disabledSubmitInit} form={form} />
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default InputCardContent;
