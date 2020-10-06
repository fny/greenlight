import React from 'reactn'
import { Page, Navbar, Block, List, ListInput, Button, Toggle, ListItem } from 'framework7-react'
import { When, Case } from '../../components/Case'
import { SyntheticEvent } from 'react'
import { updateUser } from 'src/common/api'
import { dynamicPaths } from 'src/routes'
import { User } from 'src/common/models'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/common/errors'


interface State {
  password: string
  errorMessage: string | null
  showErrorMessage: boolean
  isPasswordHidden: boolean
  currentUser: User
}

export default class extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props)
    
    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }

    this.state = {
      password: '',
      errorMessage: null,
      showErrorMessage: false,
      isPasswordHidden: true,
      currentUser: this.global.currentUser
    }
  
  }

  toggleReveal(e: SyntheticEvent) {
    this.setState({ isPasswordHidden: !(e.target as any).checked })
    // this.$f7.input.validateInputs('#WelcomePasswordPage-form')
  }
  async submit() {
    if (this.state.password.length < 8) {
      this.setState({ errorMessage: 'Password is too short.', showErrorMessage: true })
      return
    }
    this.setState({ errorMessage: '', showErrorMessage: false })
    this.$f7.input.validateInputs('#WelcomePasswordPage-form')

    this.$f7.dialog.preloader('Submitting changes...')
    try {
      const user = await updateUser(this.state.currentUser, { password: this.state.password } as Partial<User>)
      this.setGlobal({ currentUser: user })
      this.$f7.dialog.close()
      this.$f7router.navigate(dynamicPaths.afterWelcomePasswordPath())
    } catch (error) {
      this.$f7.dialog.close()
      console.error(error)
      // TODO: i18n
      this.$f7.dialog.alert('Something went wrong', 'Update Failed')
    }
  }

  render() {
    return (
      <Page>
        <Navbar title="Set Your Password"></Navbar>
        <Block>
          <p>
            You can your email address or mobile number and this
            password. It must be at least 8 characters long.
          </p>
        </Block>
        <Block>
          <List noHairlines form id="WelcomePasswordPage-form">
          <ListInput
            label="Password"
            type={this.state.isPasswordHidden ? "password" : "text"} 
            placeholder="Password"
            value={this.state.password}
            errorMessage={this.state.errorMessage || ''}
            errorMessageForce={this.state.showErrorMessage}
            onChange={(e) => {
              this.setState({ password: e.target.value })
            }}
            required
            validate
          />

          <ListItem>
            <span>Reveal Password</span>
            {/*  TODO: This color is off */}
            <Toggle color="green" onChange={(e) => this.toggleReveal(e)} />
          </ListItem>
          </List>
          <img
            alt="Greenlight gives security highest importance."
            src="/images/welcome-secure.svg"
          />

          <Case test={this.state.currentUser.children.length > 0}>
            <When value={true}>
              <p>Next you'll review your children.</p>

            </When>
            <When value={false}>
              <p>Next you'll fill out your first survey!</p>
            </When>
          </Case>

          <Button large fill onClick={() => this.submit()}>
            Continue
          </Button>

        </Block>
      </Page>
    )
  }
}
