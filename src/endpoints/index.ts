import { User } from 'payload/auth'
import { Endpoint } from 'payload/config'
import { healthcheck } from './healthcheck'

const endpoints: Endpoint[] = [
  {
    path: '/health',
    method: 'get',
    handler: healthcheck,
  },
]

export default endpoints
