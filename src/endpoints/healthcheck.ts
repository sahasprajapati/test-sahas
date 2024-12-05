import { PayloadHandler } from 'payload/config'

export const healthcheck: PayloadHandler = () => {
  return new Response('OK', { status: 200 })
}
