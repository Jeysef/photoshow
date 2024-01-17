import { OutputResolution } from "@/core/schemas/enums";
import { OrientationType } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormFieldNames, formSchema, type FormValues } from "../../../pages/edit/formSchema";
import InputCardContent from "./Input-card-content";

export const defaultValues: FormValues = {
    [FormFieldNames.ORIENTATION]: OrientationType.LANDSCAPE,
    [FormFieldNames.RESOLUTION]: OutputResolution.FULL_HD,
    [FormFieldNames.SOUNDTRACK]: "automatic",
    [FormFieldNames.FILES]: "",
};

function InputCard() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    return <InputCardContent form={form} />;
}

export default InputCard;
