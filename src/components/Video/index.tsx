import React from 'react'
import { getVideoDurationInSeconds } from 'get-video-duration'

const VideoLength = () => {
    getVideoDurationInSeconds(
        'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      ).then((duration) => {
        console.log(duration)
      })
      
  return (
    <div>
      
    </div>
  )
}

export default VideoLength
