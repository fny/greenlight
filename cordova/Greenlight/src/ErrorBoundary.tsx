import React from 'reactn'
import { Page, Block, Button } from 'framework7-react'
import { Trans } from '@lingui/macro'
import logger from './logger'
import EmailLink, { SUPPORT_EMAIL } from './components/EmailLink'

export class ErrorBoundary extends React.Component<any, any> {
  state = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: any) {
    const message = typeof error === 'string' ? error : error.message

    // Update state so the next render will show the fallback UI.
    return { hasError: true, message }
  }

  componentDidCatch(error: any, errorInfo: any) {
    logger.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Page>
          <Block>
            <h1>
              <Trans id="ErrorBoundary.something_went_wrong">
                Something went wrong.
              </Trans>
            </h1>
            <pre>
              <Trans id="ErrorBoundary.error_message">Error Message:</Trans>
              {' '}
              {this.state.message}
            </pre>
            <p>
              If this continues to happen please contact us at <EmailLink email={SUPPORT_EMAIL} />
            </p>
            <Button fill onClick={() => { window.location.href = '/' }}>
              <Trans id="ErrorBoundary.return_home">Return Home</Trans>
            </Button>
          </Block>
        </Page>
      )
    }

    return this.props.children
  }
}
