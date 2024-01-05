import { Button } from "@/components/components/button";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "../../../pages/edit/formSchema";
import Options from "../../options/options";

interface IButtonsComponentProps {
    disableSubmit: boolean;
    form: UseFormReturn<FormValues>;
}

export default function ButtonsComponent(props: IButtonsComponentProps) {
    const { form } = props;
    const { pending } = useFormStatus();
    const disableSubmit = props.disableSubmit || pending;

    const submitButtonRef = useRef<HTMLButtonElement>(null);
    function clickSubmitButton() {
        submitButtonRef.current?.click();
    }
    return (
        <div className="flex flex-nowrap gap-4">
            <Options className="w-1/4" disabled={disableSubmit} onSubmit={clickSubmitButton} form={form} aria-disabled={disableSubmit} />
            <Button ref={submitButtonRef} type="submit" variant={"teal"} className="w-3/4" disabled={disableSubmit} aria-disabled={disableSubmit}>
                Generate
            </Button>
        </div>
    );
}
