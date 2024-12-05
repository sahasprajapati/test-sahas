import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  coverImage: z.string(),
  authors: z.any(),
  owner: z.any(),
  published: z.string(),
  thumbnail: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
  topics: z.any(),
})

export type Article = z.infer<typeof articleSchema>
