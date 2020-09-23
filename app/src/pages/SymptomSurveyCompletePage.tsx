import React from 'react';
import { Page, Navbar, Block, BlockTitle, Button } from 'framework7-react';

export default () => (
  <Page>
    <Navbar title="All Clear!" backLink="Back"></Navbar>

    <Block>
      <p style={{fontWeight: "bold"}}>You are cleared!</p>
      <p>Enjoy your day! Here's something we hope will make you smile. 😃</p>
      <div dangerouslySetInnerHTML={{__html: '<div style="width:100%;height:0;padding-bottom:100%;position:relative;"><iframe src="https://giphy.com/embed/22YOkQog92fpS" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/cheezburger-funny-fail-22YOkQog92fpS">via GIPHY</a></p>' }}>
      </div>
      <Button large fill href="/dashboard">
        Back Home
      </Button>
    </Block>
  </Page>
);
