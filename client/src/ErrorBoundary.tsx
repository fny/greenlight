import React from 'reactn'
import { Page, Block, Button } from 'framework7-react'
import logger from './helpers/logger'
import EmailSupportLink from './components/EmailSupportLink'
import Tr, { En, Es } from './components/Tr'

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
              <Tr en="Something went wrong." es="Algo salió mal" />
            </h1>
            <pre>
              <Tr en="Error Message:" es="Error:" />
              {' '}
              {this.state.message}
            </pre>
            <p>
              <Tr>
                <En>If this continues to happen please contact us at <EmailSupportLink /></En>
                <Es>Si esto continúa, contáctenos en<EmailSupportLink /></Es>
              </Tr>

            </p>
            <Button fill onClick={() => { window.location.href = '/' }}>
              <Tr en="Return Home" es="Volver al inicio" />
            </Button>
          </Block>
        </Page>
      )
    }

    return this.props.children
  }
}
