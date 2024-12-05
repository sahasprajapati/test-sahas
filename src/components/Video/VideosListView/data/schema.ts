import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  owner: z.any(),
  published: z.string(),
  thumbnail: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
  topics: z.any(),
  video: z.string(),
  show: z.any(),
  slug: z.string(),
  description: z.string(),
  youtube: z.any(),
  thumbnailWebsite: z.string(),
  titleWebsite: z.string(),
  descriptionWebsite: z.string(),
})

export type Video = z.infer<typeof videoSchema>
