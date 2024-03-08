"use client";
import { OutputResolution } from "@/server/video/types/enums";
import { OrientationType } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { FormFieldNames, formSchema, type FormValues } from "../../../pages/edit/formSchema";
import InputCardContent from "./Input-card-content";

export const defaultValues: FormValues = {
    [FormFieldNames.ORIENTATION]: OrientationType.LANDSCAPE,
    [FormFieldNames.RESOLUTION]: OutputResolution.HD,
    [FormFieldNames.SOUNDTRACK]: "automatic",
    [FormFieldNames.FILES]: [],
};

export const FormContext = createContext<UseFormReturn<FormValues>>(null!);

function InputCard() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    return (
        <FormContext.Provider value={form}>
            <InputCardContent />
        </FormContext.Provider>
    );
}

export default InputCard;
