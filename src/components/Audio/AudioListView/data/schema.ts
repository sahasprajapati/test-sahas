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

  description: z.string(),
  audio: z.any(),
  slug: z.string(),
  transcript: z.any(),
  featuredImage: z.any(),
  show: z.any(),
  artist: z.string(),
})

export type Video = z.infer<typeof videoSchema>
