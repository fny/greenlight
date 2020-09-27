import React from 'react'
import { Dict } from 'src/common/types'
import moment from 'moment'

export const giphySchedule: Dict<string> = {
  '9/26/20': '22YOkQog92fpS',
  '9/27/20': 'tSaApE2vVQKE8',
  '9/28/20': 'i34oXbluCO0G4',
  '9/29/20': '10A0XQ5AOSrJao',
  '9/30/20': 'BZiSRzmpLYKiKo0yyf',
  '10/1/20': 'Xw6yFn7frR3Y4',
  '10/2/20': 'cdNSp4L5vCU7aQrYnV'
}

export function giphyEmbedURL(id: string) {
  return `https://giphy.com/embed/${id}`
}

export function giphyVideoURL(id: string) {
  return `https://media.giphy.com/media/${id}/giphy.mp4`
}

export function giphyGifURL(id: string) {
  return `https://media.giphy.com/media/${id}/giphy-downsized.gif`
}

interface Props {
  id: string
  mode?: 'embed' | 'gif' | 'video'
}

export default function Giphy({ id, mode }: Props) {
  if (mode === 'gif') { 
    return <img src={giphyGifURL(id)} alt="Funny image" style={{width:'100%'}} />
  }
  if (mode === 'embed') {
    return <div style={{width:'100%', height:0, paddingBottom:'100%', position: 'relative'}}>
      <iframe src={giphyEmbedURL(id)} width="100%" height="100%" style={{position: 'absolute'}} frameBorder="0" className="giphy-embed" allowFullScreen />
    </div>
  }

  return <video width="100%" autoPlay loop>
    <source src={giphyVideoURL(id)} type="video/mp4" />
    <img src={giphyGifURL(id)} alt="GIF of the day! 😀" style={{width:'100%'}} />
  </video>

}

function randomGiphyId() {
  const ids = Object.values(giphySchedule)
  return ids[Math.floor(Math.random() * ids.length)]
}

export function GiphyForToday({ mode }: { mode?: 'embed' | 'gif' | 'video' }) {
  const id = giphySchedule[moment().format('M/DD/YY')] || randomGiphyId()
  return <Giphy id={id} mode={mode} />
}
