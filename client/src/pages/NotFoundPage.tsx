import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';
import { Trans } from '@lingui/macro';

export default function NotFoundPage() {
  return (
    <Page>
      <Navbar title="Not found" backLink="Back" />
      <Block strong>
        <p>
          <Trans id="NotFoundPage.sorry">Sorry</Trans>
        </p>
        <p>
          <Trans id="NotFoundPage.not_found">Requested content not found.</Trans>
        </p>
      </Block>
    </Page>
  );
}
