import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://greenbritain.club'
  
  const ukCities = [
    "london", "manchester", "birmingham", "leeds", "liverpool", 
    "sheffield", "bristol", "glasgow", "edinburgh", "cardiff",
    "newcastle", "nottingham", "leicester", "coventry", "bradford",
    "stoke-on-trent", "wolverhampton", "plymouth", "southampton", "reading"
  ]

  const cityPages = ukCities.map(city => ({
    url: `${baseUrl}/${city}`,
    lastModified: new Date(),
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
      url: `${baseUrl}/telegram`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...cityPages,
  ]
} 