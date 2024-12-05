import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  owner: z.any(),
  published: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  topics: z.any(),

  thumbnailImage: z.any(),
  galleryTitle: z.string(),

  galleryDescription: z.string(),

  displayOrder: z.string(),
  galleryImages: z.any(),
  sourcesfield: z.any(),
})

export type Video = z.infer<typeof videoSchema>
