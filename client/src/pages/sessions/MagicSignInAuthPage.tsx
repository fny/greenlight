import React from 'reactn'
import {
  Page,
  Navbar,
  Block,
  Link,
} from 'framework7-react'

import { Case, When } from 'src/components/Case'

import { Dict } from 'src/types'
import { getCurrentUser, magicSignIn } from 'src/api'
import { dynamicPaths, paths } from 'src/config/routes'
import logger from 'src/helpers/logger'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { tr } from 'src/components/Tr'

interface State {
  hasReceivedResponse: boolean
  isSuccess: boolean
}

export default class MagicSignInAuthPage extends React.Component<Dict<any>, State> {
  state = {
    hasReceivedResponse: true,
    isSuccess: false,
  }

  async authorize() {
    const { token } = this.$f7route.params
    const rememberMe = this.$f7route.params.remember === 'y'

    if (!token) return

    this.$f7.dialog.preloader('Signing in...')

    try {
      await magicSignIn(token, rememberMe)
      const user = await getCurrentUser()
      this.setState({ hasReceivedResponse: true, isSuccess: true })
      this.$f7.dialog.close()
      this.setGlobal({ currentUser: user })
      this.$f7router.navigate(dynamicPaths.currentUserHomePath())
    } catch (error) {
      logger.error(error)
      this.setState({ hasReceivedResponse: true, isSuccess: false })
      this.$f7.dialog.close()
    }
  }

  componentDidMount() {
    this.authorize()
  }

  render() {
    return (
      <Page className="MagicSignInAuthPage" noToolbar noSwipeback loginScreen>
        <Navbar title={tr({ en: 'Magic Sign In', es: 'Iniciar con Mágia' })} backLink="Back">
          <NavbarHomeLink slot="left" />
        </Navbar>
        <Block>
          <Case test={this.state.hasReceivedResponse && !this.state.isSuccess}>
            <When value>
              <Tr en="That magic sign in link didn't work. It may have expired." es="Ese enlace no trabajo." />
              <Link href={paths.rootPath}>
                <Tr en="Try again?" es="¿Otra vez?" />
              </Link>
            </When>
            <When value={false}>
              <Tr en="Signing in..." es="Iniciando session..." />
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
