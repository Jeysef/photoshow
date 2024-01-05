import LocalFont from "next/font/local";

const biennale = LocalFont({
    src: [
        {
            path: "./biennale_regular.otf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./biennale_semibold.otf",
            weight: "600",
            style: "normal",
        },
    ],
    display: "swap",
    variable: "--font-sans",
});

export { biennale };
