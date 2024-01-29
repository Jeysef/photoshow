import { Button, type ButtonProps } from "@/components/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/components/dialog";
import { ScrollArea } from "@/components/components/scroll-area";
import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";
import { type FC } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "../../pages/edit/formSchema";
import styles from "./options.module.css";
import { OrientationForm, ResolutionForm, SoundtrackForm, TitleForm } from "./optionsItems";

interface IOptionsProps {
    form: UseFormReturn<FormValues>;
}

export const Options: FC<Omit<ButtonProps, keyof IOptionsProps> & IOptionsProps> = (props) => {
    const { onSubmit, form, ...rest } = props;

    return (
        <Dialog modal>
            <DialogTrigger asChild>
                <Button {...rest} variant="outline" size="icon">
                    <Settings2 />
                </Button>
            </DialogTrigger>
            <DialogContent className={"w-4/5 sm:max-w-[520px]"}>
                <DialogHeader>
                    <DialogTitle>Configure Photoshow</DialogTitle>
                    <DialogDescription>{"Make changes to preset here. Click save when you're done."}</DialogDescription>
                </DialogHeader>
                <ScrollArea className={cn(styles.scrollArea, "w-full")}>
                    <div className="p-4">
                        <TitleForm form={form} />
                        <SoundtrackForm form={form} />
                        <ResolutionForm form={form} />
                        <OrientationForm form={form} />
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant={"secondary"}
                            className="sm:w-1/4"
                            onClick={() => {
                                form.reset();
                            }}
                        >
                            Reset
                        </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                        <Button type="submit" onClick={onSubmit} variant={"default"} className="sm:w-3/4" disabled={props.disabled}>
                            Submit
                        </Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Options;
