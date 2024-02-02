import { Button } from "@/components/components/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/components/collapsible";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/components/form";
import { Input } from "@/components/components/input";
import { RadioGroup, RadioGroupItem } from "@/components/components/radio-group";
import { Separator } from "@/components/components/separator";
import { Skeleton } from "@/components/components/skeleton";
import Text from "@/components/components/typography/text";
import { OutputResolution } from "@/server/video/types/enums";
import { api } from "@/trpc/react";
import { OrientationType } from "@/types/types";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import { Suspense, useContext, type FC, type PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type ControllerRenderProps } from "react-hook-form";
import { FormFieldNames, type FormValues } from "../../pages/edit/formSchema";
import { FormContext } from "../cards/input-card/input-card";

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
            <CollapsibleContent className="m-2 space-y-4">{children}</CollapsibleContent>
        </Collapsible>
        <FormMessage />
    </FormItem>
);

const SoundtrackPreview = ({ audioName }: { audioName: string }) => {
    return (
        <div className="col-span-1">
            <span className="flex h-8 flex-shrink-0 flex-grow basis-full overflow-hidden">
                <video src={`/api/audio/get-audio?audioName=${audioName}`} controls={true} className="h-8" style={{ aspectRatio: "100" }} />
            </span>
        </div>
    );
};

const SoundtrackItemListFetched = () => {
    const [audioList] = api.audio.getAllAudioNames.useSuspenseQuery();
    const list = audioList.map((audioName, index) => {
        return (
            <>
                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                        <RadioGroupItem value={audioName} />
                    </FormControl>
                    <FormLabel>
                        <Text>{audioName}</Text>
                    </FormLabel>
                    <FormMessage />
                </FormItem>
                <SoundtrackPreview audioName={audioName} />
            </>
        );
    });
    return list;
};

const SoundtrackItemList = () => {
    return [
        <FormItem className="col-span-2 flex items-center space-x-3 space-y-0" key={"automatic"}>
            <FormControl>
                <RadioGroupItem value={"automatic"} />
            </FormControl>
            <FormLabel className="font-normal">{"automatic"}</FormLabel>
        </FormItem>,
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary
                    fallbackRender={({ error, resetErrorBoundary }) => (
                        <>
                            <Text variant="lead">There was an error! </Text>
                            <Button size={"sm"} onClick={() => resetErrorBoundary()}>
                                Try again
                            </Button>
                            <pre className="col-span-2 whitespace-normal">{(error as Error).message}</pre>
                        </>
                    )}
                    onReset={reset}
                >
                    <Suspense
                        fallback={
                            <>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-full rounded-none" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-8 w-full rounded-none" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-8 w-full rounded-none" />
                            </>
                        }
                    >
                        <SoundtrackItemListFetched />
                    </Suspense>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>,
    ];
};

export const SoundtrackForm = () => {
    const form = useContext(FormContext);
    return (
        <FormField
            control={form.control}
            name={FormFieldNames.SOUNDTRACK}
            render={({ field }) => (
                <FormItemWrapper label="Soundtrack">
                    <SoundtrackUploadForm field={field} />
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={typeof field.value === "string" ? field.value : "automatic"}
                            className="grid grid-flow-row grid-cols-2 space-y-1"
                            style={{ gridAutoColumns: "40% auto" }}
                        >
                            <SoundtrackItemList />
                        </RadioGroup>
                    </FormControl>
                </FormItemWrapper>
            )}
        />
    );
};

export const ResolutionForm = () => {
    const form = useContext(FormContext);
    return (
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
};

export const TitleForm = () => {
    const form = useContext(FormContext);
    return (
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
};

export const OrientationForm = () => {
    const form = useContext(FormContext);
    return (
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
};

interface ISoundtrackUploadFormProps {
    field: ControllerRenderProps<FormValues, FormFieldNames.SOUNDTRACK>;
}
function SoundtrackUploadForm({ field: { value, ...field } }: ISoundtrackUploadFormProps) {
    return (
        <>
            <FormItem className="mb-6 grid grid-cols-2 items-center space-y-0">
                <FormLabel>
                    <Text variant="p">{"Upload your soundtrack"}</Text>
                </FormLabel>
                <FormControl>
                    <Input {...field} type="file" accept="audio/*" />
                </FormControl>
            </FormItem>
            <Separator>
                <Text variant="mutedText" className="mx-auto flex w-fit -translate-y-1/2 bg-background px-2">
                    {"or select from options below"}
                </Text>
            </Separator>
        </>
    );
}
