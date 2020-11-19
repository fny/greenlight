import React from 'reactn'
import { Page, Navbar, BlockTitle, Badge, Block, Button } from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { FunctionComponent, F7Props } from 'src/types'
import { assertNotUndefined } from 'src/util'
import { paths } from 'src/routes'

import './LocationPage.css'

const LocationPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const { location } = f7route.params
  assertNotUndefined(location)

  return (
    <Page>
      <Navbar title={t({ id: 'LocationPage.title', message: 'Location' })} />

      <Block>
        <BlockTitle medium className="title">
          <b>GreenLight Cafe</b>
          <Badge color="green" className="title-badge">
            Restaurant
          </Badge>
        </BlockTitle>

        <p>
          2021 Magic Lane <br />
          Durham, NC 27701
        </p>

        <p>greenlightready.com</p>

        <p>
          (330) 333 - 2729 <br />
          faraz@greenlightready.com
        </p>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25822.149827208956!2d-78.9135567917163!3d36.001517103135996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89ace46dec0e9e7f%3A0xeef6c9a43274dec5!2sDurham%2C%20NC%2027701!5e0!3m2!1sen!2sus!4v1605517641901!5m2!1sen!2sus"
          width="100%"
          height="250"
          className="map-image"
        ></iframe>

        <Button large fill href={paths.mobileVerificationPath}>
          <Trans id="Location.register">Register</Trans>
        </Button>
      </Block>
    </Page>
  )
}

export default LocationPage
