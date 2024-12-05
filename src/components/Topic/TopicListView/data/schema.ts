import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const topicSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnailImage: z.string(),
  slug: z.string(),
  pageTitle: z.any(),
  createdAt: z.string(),
  updatedAt: z.string(),
  contentCurationList: z.any(),
})

export type Topic = z.infer<typeof topicSchema>
