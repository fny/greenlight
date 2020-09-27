import React from 'react'
import { Page, Navbar, Block, Button } from 'framework7-react'
import { GiphyForToday } from 'src/components/Giphy'


export default function SurveyThankYouPage() {
  
  
  return <Page>
    <Navbar title="All Clear!" backLink="Back"></Navbar>

    <Block>
      <p style={{fontWeight: "bold"}}>You are cleared!</p>
      <p>Enjoy your day! Here's something we hope will make you smile. 😃</p>
      <GiphyForToday />
      <Button large fill href="/dashboard">
        Back Home
      </Button>
    </Block>
  </Page>
}
