import {
  Block, BlockTitle, Button, List, ListInput, ListItem, Navbar, Page,
} from 'framework7-react'
import React from 'react'
import { paths } from 'src/config/routes'

export default function AddChildrenPage(): JSX.Element {
  return (
    <Page>
      <Navbar title="Greenlight Academy: Add a Child" />
      <BlockTitle>
        Add Your Child to Greenlight Academy
      </BlockTitle>

      <Block>
        <p>Add your child's information along with any cohorts that they belong to.</p>

        <List form noHairlines>
          <BlockTitle>Basic Info</BlockTitle>
          <List>
            <ListInput
              label="First Name"
              floatingLabel
            />
            <ListInput
              label="Last Name"
              floatingLabel
            />
          </List>
          <BlockTitle>Cohorts</BlockTitle>
          <List noHairlines>
            <ListItem title="Homeroom" link="#" />
            <ListItem title="Bus Route" link="#" />
          </List>
          <Button fill type="submit">
            Submit
          </Button>
        </List>
      </Block>
    </Page>
  )
}
