import React from 'react'
import { Page, Navbar, Block } from 'framework7-react'
import Giphy from 'src/components/Giphy'
import giphySchedule from 'src/data/giphySchedule'
import { DateTime } from 'luxon'

function dateString(date: string) {
  return DateTime.fromFormat(date, 'L/d/yy').toLocaleString(DateTime.DATE_HUGE)
}

export default function GiphySchedulePage() {
  return (
    <Page>
      <Navbar title="Giphys on Deck" />
      <Block strong>
        Here's what's coming up.
        {Object.entries(giphySchedule).map(([date, id]) => (
          <div key={id}>
            <p>
              {dateString(date)}
              :
              {' '}
              {id}
            </p>
            <Giphy id={id} mode="video" />
          </div>
        ))}
      </Block>
    </Page>
  )
}
