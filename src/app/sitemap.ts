import { type MetadataRoute } from 'next';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.VERCEL_URL?? ""
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
  ]
}