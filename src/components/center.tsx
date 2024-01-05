import { cn } from "@/lib/utils";
import React, { type FC } from "react";

const Center: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (props) => (
    <div {...props} className={cn("grid h-full w-full place-content-center", props.className)} />
);

export default Center;
