import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://admetos.xyz', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://admetos.xyz/explore', lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: 'https://admetos.xyz/bridge', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ]
}
