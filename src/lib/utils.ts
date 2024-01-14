import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Space = " ";

type PrefixClassNames<C extends string, P extends string, Acc extends string = ""> = C extends `${infer First} ${infer Rest}`
    ? PrefixClassNames<Rest, P, `${Acc}${P}${First} `>
    : C extends ""
      ? Acc
      : `${Acc}${P}${C}`;

export function prefixClassNames<C extends string, P extends string>(classNames: C, prefix: P): PrefixClassNames<C, P> {
    if (!classNames) {
        return classNames as unknown as PrefixClassNames<C, P>;
    }

    return classNames
        .split(" ")
        .map((className) => `${prefix}${className}`)
        .join(" ") as PrefixClassNames<C, P>;
}
