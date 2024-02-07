import { type MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const url = process.env.VERCEL_URL?? ""
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${url}/sitemap.xml`,
  }
}