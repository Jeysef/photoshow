"use client"
import { Loader2, type LucideProps } from "lucide-react";
import { type FC } from "react";
import { cn } from "../lib/utils";

export const Loader: FC<LucideProps> = (props) => {
    return <Loader2  {...props} className={cn("mr-2 h-4 w-4 animate-spin", props.className)} />
};
