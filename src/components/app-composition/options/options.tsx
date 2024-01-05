import { Button, type ButtonProps } from "@/components/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/components/dialog";
import { ScrollArea } from "@/components/components/scroll-area";
import { cn } from "@/lib/utils";
import { type FC } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "../../pages/edit/formSchema";
import audio from "./audio-list/audioList";
import styles from "./options.module.css";
import { OrientationForm, ResolutionForm, SoundtrackForm, TitleForm } from "./optionsItems";

interface IOptionsProps {
    form: UseFormReturn<FormValues>;
}

export const Options: FC<Omit<ButtonProps, keyof IOptionsProps> & IOptionsProps> = (props) => {
    const { onSubmit, form, ...rest } = props;
    const audioList = audio();

    return (
        <Dialog modal>
            <DialogTrigger asChild>
                <Button {...rest} variant="outline">
                    <p className="truncate">Configure</p>
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
                        <SoundtrackForm form={form} audioList={audioList} />
                        <ResolutionForm form={form} />
                        <OrientationForm form={form} />
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogTrigger asChild>
                        <Button type="submit" onClick={onSubmit} variant={"teal"} className="sm:w-3/4" disabled={props.disabled}>
                            Generate
                        </Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                        <Button type="button" variant={"secondary"} className="sm:w-1/4">
                            Back
                        </Button>
                    </DialogTrigger>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Options;
