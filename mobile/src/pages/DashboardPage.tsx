import React, { useGlobal } from 'reactn'
import { AccordionContent, Card, CardHeader, CardContent, Page, List, ListItem, Navbar, Link, Block, BlockTitle, NavLeft, NavTitle, NavRight, Icon } from "framework7-react";
import JDenticon from '../components/JDenticon'
import { User } from '../common/models/user'

export default () => {
  const currentUser: User = useGlobal('currentUser')[0]

  return (
    <Page>
      <Navbar>
        <NavTitle>Greenlight</NavTitle>
        <NavRight>
          <Link>
            <Icon f7="person_circle" />
          </Link>
        </NavRight>
      </Navbar>
      <BlockTitle>
        <b>Good Morning, {currentUser.firstName}!</b>
      </BlockTitle>
      <div className="GLCard">
        <div className="GLCard-title">Submit Daily Check-In</div>
        <div className="GLCard-body">
          How are your children feeling today? Tell us so they can get the
          Greenlight.
        </div>
        <div className="GLCard-action">
          <div style={{ width: '50%', display: 'inline-block' }}>
            Go to Check-In
          </div>
          <div
            style={{
              width: '50%',
              display: 'inline-block',
              textAlign: 'right',
            }}
          >
            <Icon f7="arrow_right" />
          </div>
        </div>
      </div>

      <BlockTitle>Your Children</BlockTitle>
      <List>
        {currentUser.children.map((child) => (
          <ListItem
            accordionItem
            link="#"
            title={child.firstName}
            after="Not Submitted"
          >
            <div slot="media">
              <JDenticon user={child} size={29} />
            </div>
            <AccordionContent>
              <List>
                <ListItem
                  link={`/users/${child.id}/covid-test`}
                  title="Submit COVID Test"
                ></ListItem>
                <ListItem
                  link={`/users/${child.id}/pass`}
                  title="Greenlight Pass"
                ></ListItem>
                <ListItem
                  link={`/users/${child.id}/absence`}
                  title="Schedule Absence"
                ></ListItem>
                <ListItem
                  link={`/users/${child.id}/locations`}
                  title="Locations"
                ></ListItem>
              </List>
            </AccordionContent>
          </ListItem>
        ))}
      </List>
      <BlockTitle>Resources For You</BlockTitle>
      <List>
        {/* https://www.communitycarenc.org/what-we-do/supporting-primary-care */}
        <ListItem
          link="#"
          title="Get Connected"
          footer="Contact a Health Careworker"
        ></ListItem>
        <ListItem
          link="#"
          title="Find Testing"
          footer="Testing Sites Near You"
        ></ListItem>
        {/* https://ncchildcare.ncdhhs.gov/Portals/0/documents/pdf/P/Parent_and_Families_School_Age_Child_Care.pdf?ver=2020-08-26-122445-963 */}
        <ListItem
          link="#"
          title="Child Care Services"
          footer="Additional Services to Help"
        ></ListItem>
        <ListItem
          link="#"
          title="More Resources"
          footer="Additional Services to Help"
        ></ListItem>
      </List>
    </Page>
  )
}
