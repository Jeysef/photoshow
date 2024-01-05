import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type FormValues } from "../../pages/edit/formSchema";
import FileInput from "./file-input";

export interface IFileInputProps {
    form: UseFormReturn<FormValues>;
}

export default function FileInputList(props: IFileInputProps) {
    const { form } = props;

    const [files, setFiles] = useState(new Set<number>());

    const fileArray = [...Array(files.size + 1).keys()];
    return fileArray.map((_, index) => {
        return <FileInput key={index} form={form} index={index} onFileUpload={() => setFiles((files) => new Set(files.add(index)))} />;
    });
}
