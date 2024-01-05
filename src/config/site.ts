const url = process.env.NODE_ENV === "production" ? "https://do1.service.worldee.com" : "http://localhost:3000";
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
