import React from 'react'
import ReactAudioPlayer from 'react-audio-player'
import { useField } from '@payloadcms/ui/forms/useField'

const AudioPlayer: React.FC = () => {
  const audiosrc = useField({ path: 'audio' })

  //@ts-ignore
  return <ReactAudioPlayer src={audiosrc.value.url} autoPlay={false} controls />
}

export default AudioPlayer
