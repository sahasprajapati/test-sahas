import { kv } from '@vercel/kv'
import { Ratelimit } from '@upstash/ratelimit'
import { generateOpenAi } from './openAi'
import { NextRequest } from 'next/server'
import { generateGemini } from './gemini'
// Create an OpenAI API client (that's edge friendly!)
// Using LLamma's OpenAI client:

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = 'edge'

export async function POST(req: NextRequest): Promise<Response> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get('x-forwarded-for')
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, '1 d'),
    })

    const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`)

    if (!success) {
      return new Response('You have reached your request limit for the day.', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      })
    }
  }

  const token =
    req.headers.get('authorization')?.split('Bearer ')?.[1] ??
    req.cookies.get('payload-token')?.value

  if (!token)
    return new Response('Unauthorized Access', {
      status: 401,
    })

  let { prompt, option, command, language } = await req.json()
  const res = await fetch('http://localhost:3000/api/globals/aiModelConfiguration', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const { provider, apiKey } = (await res.json()) ?? {}

  switch (provider) {
    case 'gemini':
      return generateGemini({ prompt, option, command, apiKey, language })

    default:
    case 'openAi':
      return generateOpenAi({ prompt, option, command, apiKey, language })
  }
}
