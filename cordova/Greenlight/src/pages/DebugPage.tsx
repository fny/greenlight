import React, { useGlobal } from 'reactn'
import {
  Page, Navbar, Block, ListItem, List, AccordionContent,
} from 'framework7-react'

export default function DebugPage() {
  const [currentUser] = useGlobal('currentUser')

  return (
    <Page>
      <Navbar title="Debug" />
      <List accordionList>
        <ListItem accordionItem title="Current User">
          <AccordionContent>
            <Block>
              <pre>
                {
                  !currentUser ? 'Not Found' : JSON.stringify(currentUser, null, 2)
                }
              </pre>
            </Block>
          </AccordionContent>
        </ListItem>
      </List>
    </Page>
  )
}
