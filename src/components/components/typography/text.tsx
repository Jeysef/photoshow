import React from "react";
import { type StrictExtract } from "ts-essentials";
import { Typography, type TypographyVariantType, type VariantPropsTypographyWithoutVariant } from ".";

// Specify the variants you want to allow (linting error will be thrown when using exported component with a variant (1) not specified here or (2) not within TypographyVariant)
type AllowedVariants = StrictExtract<TypographyVariantType, "p" | "lead" | "largeText" | "mutedText" | "smallText">;
type HTMLTypographyElement = HTMLParagraphElement;

interface TextProps extends React.HTMLAttributes<HTMLTypographyElement>, VariantPropsTypographyWithoutVariant {
    variant?: AllowedVariants;
    as?: string;
}

const Text = React.forwardRef<HTMLTypographyElement, TextProps>(({ variant = "p", ...props }, ref) => {
    return <Typography ref={ref} variant={variant} {...props} />;
});

export default Text;
