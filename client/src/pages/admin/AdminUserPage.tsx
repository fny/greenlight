import React from 'react'
import { Page, Block, Navbar, List, ListItem, BlockTitle, AccordionContent } from 'framework7-react'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, copyTextToClipboard, formatPhone } from 'src/helpers/util'

import { User } from 'src/models'
import { getUserParents } from 'src/api'
import { dynamicPaths } from 'src/config/routes'
import LoadingUserContent from 'src/components/LoadingUserContent'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import LoadingBundleContent from 'src/components/LoadingBundleContent'
import FakeF7ListItem from 'src/components/FakeF7ListItem'
import Tr, { tr } from 'src/components/Tr'

export default function AdminUserPage(props: F7Props): JSX.Element {
  const { locationId, userId } = props.f7route.params
  assertNotUndefined(locationId)
  assertNotUndefined(userId)

  return (
    <Page>
      <LoadingLocationContent
        showNavbar
        showAsPage
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)
          return (
            <LoadingUserContent
              showAsPage
              userId={userId}
              content={(state) => {
                const { user } = state
                assertNotNull(user)
                const locationAccount = user.accountFor(location)
                assertNotNull(locationAccount)
                return (
                  <>
                    <Navbar title={`${user.firstName} ${user.lastName}`} />
                    <Block>
                      <p>
                        {user.firstName} {user.lastName} is a {locationAccount.role} at {location.name}.
                      </p>
                    </Block>
                    <Block>
                      <BlockTitle>Actions</BlockTitle>
                      <List>
                        {user.hasNotSubmittedOwnSurvey() ? (
                          <ListItem
                            link={dynamicPaths.userSurveysNewPath(user.id, { redirect: props.f7route.path })}
                            title="Check-In"
                          />
                        ) : (
                          <FakeF7ListItem>
                            <ListItem link={dynamicPaths.userGreenlightPassPath(user.id)} title="Greenlight Pass" />
                            {/* <ListItem
                                link="#"
                                title="Submit Updated Symptoms"
                                footer="Submit an updated survey"
                              /> */}
                          </FakeF7ListItem>
                        )}
                        {/* <ListItem
                          link="#"
                          title="Submit Medical Data"
                          footer="Submit a test or vaccine result"
                        /> */}
                        {/* <ListItem
                          link="#"
                          title={`Edit ${user.firstName}`}
                          footer="Change name and contact info"
                        /> */}
                        {/* <ListItem
                          link="#"
                          title="Unlink"
                          footer={`Unlink ${user.firstName} from ${location.name}`}
                        /> */}
                        {!locationAccount.isStudent() && (
                          <ListItem
                            link={dynamicPaths.userLocationPermissionsPath({
                              userId: user.id,
                              locationId: location.id,
                            })}
                            title="Permissions"
                          />
                        )}
                      </List>
                    </Block>
                    <Block>
                      <BlockTitle>Contact</BlockTitle>

                      <List>
                        {user.mobileNumber && (
                          <ListItem
                            external
                            link={`tel:${user.mobileNumber}`}
                            title={`Call ${user.firstName}`}
                            footer={formatPhone(user.mobileNumber)}
                          />
                        )}
                        {user.email && (
                          <ListItem
                            external
                            link={`mailto:${user.email}`}
                            title={`Email ${user.firstName}`}
                            footer={user.email}
                          />
                        )}
                      </List>
                    </Block>

                    <Block>
                      <BlockTitle>
                        <Tr en="Parents" es="Padres" reviewTrans />
                      </BlockTitle>

                      <LoadingBundleContent<User[]>
                        showAsPage
                        action={() => getUserParents(userId)}
                        content={(state) => {
                          const parents = state.bundle || []
                          return (
                            <List>
                              {parents.map((parent) => (
                                <ListItem
                                  link={dynamicPaths.editParentPath({ userId: userId, parentId: parent.id })}
                                  key={parent.id}
                                  title={`${parent.firstName} ${parent.lastName}`}
                                />
                              ))}
                              <ListItem
                                link={dynamicPaths.editParentPath({ userId: userId, parentId: 'new' })}
                                title={tr({ en: 'Add a new parent', es: '', reviewTrans: true })}
                              />
                            </List>
                          )
                        }}
                      />
                    </Block>
                  </>
                )
              }}
            />
          )
        }}
      />
    </Page>
  )
}
