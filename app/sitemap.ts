import { MetadataRoute } from 'next'
import { getVillas } from './admin/actions/villa'
import { getCabins } from './admin/actions/cabin'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dienggo.id' // Change to actual site URL

  // Fetch all villas and cabins
  const villas = await getVillas()
  const cabins = await getCabins()

  const villaEntries = villas.map((villa) => ({
    url: `${baseUrl}/villa/${villa.slug}`,
    lastModified: villa.updatedAt || villa.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const cabinEntries = cabins.map((cabin) => ({
    url: `${baseUrl}/hotel-cabin/${cabin.slug}`,
    lastModified: cabin.updatedAt || cabin.createdAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/villa`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotel-cabin`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wisata`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/jeep`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...villaEntries,
    ...cabinEntries,
  ]
}
