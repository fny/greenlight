import React from 'react'
import { DateTime } from 'luxon'
import giphySchedule from 'src/assets/data/giphySchedule'

export function giphyEmbedURL(id: string): string {
  return `https://giphy.com/embed/${id}`
}

export function giphyVideoURL(id: string): string {
  return `https://media.giphy.com/media/${id}/giphy.mp4`
}

export function giphyGifURL(id: string): string {
  return `https://media.giphy.com/media/${id}/giphy-downsized.gif`
}

interface Props {
  id: string
  mode?: 'embed' | 'gif' | 'video'
}

export default function Giphy({ id, mode }: Props): JSX.Element {
  if (mode === 'gif') {
    return <img src={giphyGifURL(id)} alt="Something funny" style={{ width: '100%' }} />
  }
  if (mode === 'embed') {
    return (
      <div style={{
        width: '100%', height: 0, paddingBottom: '100%', position: 'relative',
      }}
      >
        <iframe title="It's a Giphy!" src={giphyEmbedURL(id)} width="100%" style={{ position: 'absolute' }} frameBorder="0" className="giphy-embed" allowFullScreen />
      </div>
    )
  }

  return (
    <video width="100%" autoPlay loop>
      <source src={giphyVideoURL(id)} type="video/mp4" />
      <img src={giphyGifURL(id)} alt="GIF of the day! 😀" style={{ width: '100%' }} />
    </video>
  )
}

function randomGiphyId() {
  const ids = Object.values(giphySchedule)
  return ids[Math.floor(Math.random() * ids.length)]
}

export function GiphyForToday({ mode }: { mode?: 'embed' | 'gif' | 'video' }): JSX.Element {
  const id = giphySchedule[DateTime.local().toLocaleString(DateTime.DATE_SHORT)] || randomGiphyId()
  return (
    <Giphy id={id} mode={mode} />
  )
}
