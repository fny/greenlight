import React, { useGlobal } from 'reactn'
import { Page, Navbar, Block, ListItem, List, AccordionContent } from 'framework7-react'
import { session } from 'src/common/api'

export default () => {
  const [ currentUser ] = useGlobal('currentUser')

  return <Page>
    <Navbar title="Debug" />
      <List accordionList>
        <ListItem accordionItem title="Current User">
          <AccordionContent>
            <Block>
              <pre>
                {
                  !currentUser ? "Not Found" : JSON.stringify(currentUser, null, 2)
                }
              </pre>
            </Block>
          </AccordionContent>
        </ListItem>
        <ListItem accordionItem title="Session">
          <AccordionContent>
            <Block>
              <pre style={{whiteSpace: 'pre-wrap'}}>
                {JSON.stringify(session, null, 2)}
              </pre>
            </Block>
          </AccordionContent>
        </ListItem>
      </List>        
  </Page>
}
