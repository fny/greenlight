import React from 'react'
import { Page, Navbar, Block } from 'framework7-react'
import Giphy, { giphySchedule } from 'src/components/Giphy'

export default () => (
  <Page>
    <Navbar title="Giphys on Deck" backLink="Back" />
    <Block strong>
      Here's what's coming up.
      {Object.entries(giphySchedule).map(([date, id]) => {
        return <div><p>{date}</p><Giphy id={id} mode="video" /></div>
      })}
    </Block>
  </Page>
)
