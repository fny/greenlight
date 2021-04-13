import { Block, BlockTitle, Button, List, ListInput, Row, Col, ListItem } from 'framework7-react'
import React, { useState } from 'reactn'
import Tr, { tr } from 'src/components/Tr'
import { currentUser } from 'src/helpers/global'
import { RegisteringUser } from 'src/models/RegisteringUser'

interface AddChildFormProps {
  user: RegisteringUser | null
  onSubmit: (child: RegisteringUser) => any
  onDelete?: () => any
  onBack?: () => any
  setLocation?: boolean
}

export default function AddChildForm(props: AddChildFormProps): JSX.Element {
  const [state, setState] = useState({ ...new RegisteringUser(), ...(props.user || {}) })
  const currUser = currentUser()
  return (
    <Block>
      <BlockTitle>
        <Tr en="Your child's information" es="La información de su hijo" />
      </BlockTitle>

      <List
        form
        noHairlines
        onSubmit={(e) => {
          e.preventDefault()
          props.onSubmit(state)
        }}
      >
        <List>
          <ListInput
            label={tr({ en: 'First Name', es: 'Primero' })}
            floatingLabel
            required
            value={state.firstName}
            onChange={(e) => setState({ ...state, firstName: e.target.value })}
          />
          <ListInput
            label={tr({ en: 'Last Name', es: 'Apellido' })}
            floatingLabel
            required
            value={state.lastName}
            onChange={(e) => setState({ ...state, lastName: e.target.value })}
          />
          {
            props.setLocation && currUser &&
            <ListInput
              label="School"
              type="select"
              placeholder="Please choose..."
              required
              onChange={(e) => setState({ ...state, locationId: e.target.value })}
            >
              <option></option>
              {
                currUser.affiliatedLocations().filter(l => l.isSchool()).map(l =>
                  <option value={l.id}>{l.name}</option>
                )
              }
            </ListInput>
          }
          {
            !props.setLocation
          }
          {/* TODO: Ask for primary care info */}
          {/* <ListItem
            checkbox
            header={tr({ en: "Don't have a primary care doctor?", es: '¿No tiene un médico de atención primaria?' })}
            title={tr({ en: 'Get help finding one.', es: 'Obtén ayuda para encontrar uno.' })}
            onChange={(e) => {
              setState({ ...state, needsPhysician: e.target.checked })
            }}
          />
          <ListInput
            label={tr({ id: 'WelcomeChildPage.doctor_name_label', message: 'Primary Care Doctor' })}
            placeholder={t({
              id: 'WelcomeChildPage.doctor_name_placeholder',
              message: t`${child.firstName}'s doctor's name`,
            })}
            type="text"
            onInput={(e) => {
              setState({ ...state, physicianName: e.target.value })
            }}
          />
          <ListInput
            label={tr({ id: 'WelcomeChildPage.doctor_phone_label', message: 'Primary Care Doctor Phone' })}
            placeholder={tr({
              id: 'WelcomeChildPage.doctor_phone_placeholder',
              message: t`Doctor's phone`,
            })}
            type="tel"
            onInput={(e) => {
              setState({ ...state, physicianPhoneNumber: e.target.value })
            }}
          /> */}
        </List>

        <Row>
          <Col>
            <Button fill type="submit">
              <Tr en="Submit" es="Enviar" />
            </Button>
          </Col>
          {props.user && props.onDelete && (
            <Col>
              <Button fill type="button" onClick={props.onDelete}>
                <Tr en="Delete" es="Enviar" />
              </Button>
            </Col>
          )}
          {props.onBack && (
            <Col>
              <Button fill type="button" onClick={props.onBack}>
                <Tr en="Back" es="Atrás" />
              </Button>
            </Col>
          )}
        </Row>
      </List>
    </Block>
  )
}
