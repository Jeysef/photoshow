
const url = process.env.VERCEL_URL;
export const siteConfig = {
    name: "Photoshow",
    url: `${url}`,
    ogImage: `${url}/og.png`,
    description: "Create a video from your photos and videos automatically.",
    links: {
        github: "https://github.com/Jeysef",
    },
} as const;

export type SiteConfig = typeof siteConfig;
