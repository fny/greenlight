import { t, Trans } from '@lingui/macro'
import { AccordionContent, Block, BlockTitle, List, ListInput, ListItem, Navbar, Page } from 'framework7-react'
import React, { useState } from 'reactn'

export default function NotificationsPage() {
  useState()
  return <Page>
    <Navbar
      title={t({ id: 'NotificationsPage.title', message: 'Notifications' })}
      backLink
    />
    <Block>
      <BlockTitle>
        <Trans id="NotificationsPage.daily_reminders_title">
          Daily Reminders
        </Trans>
      </BlockTitle>
      <List accordionList>
        <ListInput
          label="How to Send Reminders"
          type="select"
          placeholder="Please choose..."
        >
          <option value="text">Send Reminders via Text</option>
          <option value="email">Send Reminders via Email</option>
          {/* <option value="push">Send Reminders via Push Notification</option> */}
          <option value="none">Disable All Reminders</option>
        </ListInput>
        <ListItem checkbox title="Set my own reminder times" footer="This will override the reminder times set by your locations." />


        <ListInput type="time" />
        <ListItem accordionItem title="Days of the Week to Receive Reminders">
          <AccordionContent>
          <List>
            <ListItem checkbox title="Monday" name="demo-checkbox" />
            <ListItem checkbox title="Tuesday" name="demo-checkbox" />
            <ListItem checkbox title="Wednesday" name="demo-checkbox" />
            <ListItem checkbox title="Thursday" name="demo-checkbox" />
            <ListItem checkbox title="Friday" name="demo-checkbox" />
            <ListItem checkbox title="Saturday" name="demo-checkbox" />
            <ListItem checkbox title="Sunday" name="demo-checkbox" />
          </List>
          </AccordionContent>
        </ListItem>


      </List>
    </Block>
  </Page>
}
