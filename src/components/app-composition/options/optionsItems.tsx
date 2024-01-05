"use client";
import Center from "@/components/center";
import { Loader } from "@/components/loader";
import { Button } from "@/components/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/components/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/components/form";
import { Input } from "@/components/components/input";
import { RadioGroup, RadioGroupItem } from "@/components/components/radio-group";
import { OutputResolution } from "@/core/schemas/enums";
import { OrientationType } from "@/types/types";
import { ChevronsUpDown } from "lucide-react";
import { type FC, type PropsWithChildren, Suspense } from "react";
import { type UseFormReturn } from "react-hook-form";
import { FormFieldNames, type FormValues } from "../../pages/edit/formSchema";
import { type IAudioList } from "./audio-list/audioList";

interface IWithFormProps {
    form: UseFormReturn<FormValues>;
}

interface IFormItemWrapperProps {
    label: string;
    defaultOpen?: boolean;
}

const FormItemWrapper: FC<PropsWithChildren<IFormItemWrapperProps>> = ({ children, label, defaultOpen }) => (
    <FormItem className="space-y-3">
        <Collapsible defaultOpen={defaultOpen}>
            <FormLabel>{label}</FormLabel>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="m-2">{children}</CollapsibleContent>
        </Collapsible>
        <FormMessage />
    </FormItem>
);

const SoundtrackItemList = ({ audioList }: { audioList: IAudioList[] }) => {
    const list = audioList.map(({ component, name }, index) => (
        <>
            <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                <Suspense
                    fallback={
                        <Center>
                            <Loader className="h-20 w-20" />
                        </Center>
                    }
                >
                    <FormControl>
                        <RadioGroupItem value={name} />
                    </FormControl>
                    <FormLabel className="font-normal">{component.description}</FormLabel>
                    <FormMessage />
                </Suspense>
            </FormItem>
            <div className="col-span-1">{component.preview}</div>
        </>
    ));
    return [
        <FormItem className="col-span-2 flex items-center space-x-3 space-y-0" key={"automatic"}>
            <FormControl>
                <RadioGroupItem value={"automatic"} />
            </FormControl>
            <FormLabel className="font-normal">{"automatic"}</FormLabel>
        </FormItem>,
        ...list,
    ];
};

export const SoundtrackForm = ({ form, audioList }: IWithFormProps & { audioList: IAudioList[] }) => (
    <FormField
        control={form.control}
        name={FormFieldNames.SOUNDTRACK}
        render={({ field }) => (
            <FormItemWrapper label="Soundtrack">
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-flow-row grid-cols-2 space-y-1"
                        style={{ gridAutoColumns: "40% auto" }}
                    >
                        <SoundtrackItemList audioList={audioList} />
                    </RadioGroup>
                </FormControl>
            </FormItemWrapper>
        )}
    />
);

export const ResolutionForm = ({ form }: IWithFormProps) => (
    <FormField
        control={form.control}
        name={FormFieldNames.RESOLUTION}
        render={({ field }) => (
            <FormItemWrapper label="Resolution">
                <FormControl>
                    <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-flow-row grid-cols-2 space-y-1"
                        style={{ gridAutoColumns: "40% auto" }}
                    >
                        {Object.entries(OutputResolution).map(([name, value], index) => (
                            <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value={value} />
                                <FormLabel className="font-normal">{name}</FormLabel>
                                <FormMessage />
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
            </FormItemWrapper>
        )}
    />
);

export const TitleForm = ({ form }: IWithFormProps) => (
    <FormField
        control={form.control}
        name={FormFieldNames.TITLE}
        render={({ field }) => (
            <FormItemWrapper label="Title" defaultOpen={true}>
                <FormControl>
                    <Input type="string" {...field} />
                </FormControl>
            </FormItemWrapper>
        )}
    />
);

export const OrientationForm = ({ form }: IWithFormProps) => (
    <FormField
        control={form.control}
        name={FormFieldNames.ORIENTATION}
        render={({ field }) => (
            <FormItemWrapper label="Orientation">
                <FormControl>
                    <FormItem>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-flow-row grid-cols-2 space-y-1"
                            style={{ gridAutoColumns: "1fr 1fr" }}
                        >
                            {Object.entries(OrientationType).map(([name, value], index) => (
                                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                                    <RadioGroupItem value={value} />
                                    <FormLabel className="font-normal">{name}</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormItem>
                </FormControl>
            </FormItemWrapper>
        )}
    />
);
