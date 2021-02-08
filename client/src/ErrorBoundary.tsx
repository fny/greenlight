import React from 'reactn'
import { Page, Block, Button } from 'framework7-react'
import { Trans } from '@lingui/macro'
import logger from './helpers/logger'
import EmailSupportLink from './components/EmailSupportLink'

interface DerivedState {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends React.Component<any, any> {
  state = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: any): DerivedState {
    const message = typeof error === 'string' ? error : error.message

    // Update state so the next render will show the fallback UI.
    return { hasError: true, message }
  }

  componentDidCatch(error: any, errorInfo: any): void {
    if (error.isNoCurrentUserError) {
      (window as any).location = '/'
    }
    logger.error(error, errorInfo)
  }

  render(): React.ReactNode {
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
              If this continues to happen please contact us at <EmailSupportLink />
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
