import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '../../payload.config'
import { toTranslationKey } from '@/languages'

export const LivePreviewServer = async () => {
  const payload = await getPayloadHMR({ config })

  return (
    <div>
      <h1>{toTranslationKey('live_preview')}</h1>
    </div>
  )
}
