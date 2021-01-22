import { Block, BlockTitle, Button, List, ListInput, Row, Col } from 'framework7-react'
import { useState } from 'reactn'
import { RegisteringUser } from 'src/models/RegisteringUser'

interface AddChildFormProps {
  onSubmit: (child: RegisteringUser) => any
  onDiscard?: () => any
}

export default function AddChildForm(props: AddChildFormProps): JSX.Element {
  const [value, setValue] = useState(new RegisteringUser())
  return (
    <Block>
      <BlockTitle>Add your child's information</BlockTitle>

      <List
        form
        noHairlines
        onSubmit={(e) => {
          e.preventDefault()
          props.onSubmit(value)
        }}
      >
        <BlockTitle>Basic Info</BlockTitle>
        <List>
          <ListInput
            label="First Name"
            floatingLabel
            required
            value={value.firstName}
            onChange={(e) => setValue({ ...value, firstName: e.target.value })}
          />
          <ListInput
            label="Last Name"
            floatingLabel
            required
            value={value.lastName}
            onChange={(e) => setValue({ ...value, lastName: e.target.value })}
          />
        </List>

        <Row>
          <Col>
            <Button fill type="submit">
              Submit
            </Button>
          </Col>
          {props.onDiscard && (
            <Col>
              <Button fill type="button" onClick={props.onDiscard}>
                Discard
              </Button>
            </Col>
          )}
        </Row>
      </List>
    </Block>
  )
}
