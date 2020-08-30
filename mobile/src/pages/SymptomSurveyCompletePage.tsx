import React from 'react';
import { Page, Navbar, Block, BlockTitle, Button } from 'framework7-react';

export default () => (
  <Page>
    <Navbar title="All Clear!" backLink="Back"></Navbar>

    <Block>
      <p style={{textAlign: "center", fontWeight: "bold"}}>Your children are cleared for school!</p>
      <img
        style={{ width: "100%" }}
        src="https://media.giphy.com/media/322FvxfciE8UsYvILG/giphy.gif"
        alt="Image of the Day"
      />
      <Button large fill>
        Back Home
      </Button>
    </Block>
  </Page>
);
