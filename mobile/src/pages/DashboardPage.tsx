import React from "react";
import { Card, CardHeader, CardContent, Page, List, ListItem, Navbar, Link, Block, BlockTitle } from "framework7-react";
import * as jdenticon from 'jdenticon'

jdenticon.configure({
  hues: [149],
  lightness: {
    color: [0.24, 0.78],
    grayscale: [0.3, 0.9],
  },
  saturation: {
    color: 0.49,
    grayscale: 0.77,
  },
  backColor: '#edfff5',
})

export default () => (
  <Page>
    <Navbar title="Greenlight" backLink="Back"></Navbar>
    <BlockTitle>Your Children</BlockTitle>
    <List>
      <ListItem link="#" title="Bart Simpson" after="Not Submitted">
        <span style={{ borderRadius: '4px'}}
          slot="media"
          dangerouslySetInnerHTML={{ __html: jdenticon.toSvg("Bart", 29) }}
        ></span>
      </ListItem>
      <ListItem link="#" title="Lisa Simpson" after="Not Submitted">
        <span
          slot="media"
          dangerouslySetInnerHTML={{ __html: jdenticon.toSvg("Lisa", 29) }}
        ></span>
      </ListItem>
      <ListItem link="#" title="Maggie Simpson" after="Not Submitted">
        <span
          slot="media"
          dangerouslySetInnerHTML={{ __html: jdenticon.toSvg("Maggie", 29) }}
        ></span>
      </ListItem>
    </List>
    <BlockTitle>Resources</BlockTitle>
    <List>
      <ListItem
        link="#"
        title="Get Connected"
        footer="Contact a Careworker"
      ></ListItem>
      <ListItem
        link="#"
        title="Find Testing"
        footer="Testing Sites Near You"
      ></ListItem>
      <ListItem
        link="#"
        title="Social Services"
        footer="Additional Services to Help"
      ></ListItem>
    </List>
  </Page>
);
