import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/avatar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/components/form";
import { Input } from "@/components/components/input";
import { ImageIcon } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { FormFieldNames, type FormValues } from "../../pages/edit/formSchema";

export interface IFileInputProps {
    form: UseFormReturn<FormValues>;
    index: number;
    onFileUpload: () => void;
}

export default function FileInput(props: IFileInputProps) {
    const { form, index, onFileUpload } = props;

    const labelText = index === 0 ? "Enter photos" : "Enter more photos (Optional)";

    const [thumbnail, setThumbnail] = useState<typeof FileReader.prototype.result>();
    const [label, setLabel] = useState<string>(labelText);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target?.files?.[0];
        if (file) {
            onFileUpload();
            setLabel(file.name ?? labelText);
            const reader = new FileReader();
            reader.onload = (e) => {
                setThumbnail(e.target?.result);
            };
            reader.readAsDataURL(file);
            form.setValue(FormFieldNames.FILES, form.getValues(FormFieldNames.FILES) + 1);
        }
    }

    const Thumbnail = () => {
        if (!thumbnail) return null;
        return (
            <Avatar className="rounded-none">
                <AvatarImage src={(thumbnail || "") as string} alt="thumbnail" />
                <AvatarFallback>
                    <ImageIcon />
                </AvatarFallback>
            </Avatar>
        );
    };

    return (
        <FormField
            key={index}
            control={form.control}
            name={FormFieldNames.FILES}
            render={({ field }) => (
                <FormItem className="grid gap-2">
                    <FormLabel>{label}</FormLabel>
                    <div className="flex items-center space-x-2">
                        <Thumbnail />
                        <FormControl>
                            <Input type="file" multiple accept=".jpg, .jpeg, .png" {...field} value={undefined} onChange={handleFileChange} />
                        </FormControl>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
