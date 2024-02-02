import { Button, type ButtonProps } from "@/components/components/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/components/dialog";
import { ScrollArea } from "@/components/components/scroll-area";
import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";
import { useContext, type FC } from "react";
import { FormContext } from "../cards/input-card/input-card";
import styles from "./options.module.css";
import { OrientationForm, ResolutionForm, SoundtrackForm, TitleForm } from "./optionsItems";

export const Options: FC<ButtonProps> = (props) => {
    const { onSubmit, ...rest } = props;
    const form = useContext(FormContext);

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
                        <TitleForm />
                        <SoundtrackForm />
                        <ResolutionForm />
                        <OrientationForm />
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
