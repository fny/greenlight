import React from 'react'
import { Dict } from 'src/common/types'
import { DateTime } from 'luxon'
import giphySchedule from 'src/data/giphySchedule'

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
  const id = giphySchedule[DateTime.local().toLocaleString(DateTime.DATE_SHORT)] || randomGiphyId()
  return <Giphy id={id} mode={mode} />
}
