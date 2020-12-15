import {
  Block, BlockTitle, List, ListItem, Page, Panel, View,
} from 'framework7-react'
import React from 'react'

export default function SidePanel() {
  return (
    <Panel left reveal>
      <View>
        <Page>
          <BlockTitle>Menu</BlockTitle>
          <Block>
            <List>
              <ListItem>Home</ListItem>
            </List>
          </Block>
        </Page>
      </View>
    </Panel>
  )
}

SidePanel.displayName = 'F7Panel'
