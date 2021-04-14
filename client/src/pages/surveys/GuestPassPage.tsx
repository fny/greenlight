import {
  Block,
  BlockTitle,
  Button,
  f7,
  List,
  ListItem,
  Page,
  Toggle,
} from 'framework7-react'
import React, { useState } from 'react'
import { dynamicPaths } from 'src/config/routes'
import { F7Props } from 'src/types'
import { FormikProvider, useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import * as Yup from 'yup'
import SubmitHandler from 'src/helpers/SubmitHandler'
import 'src/lib/yup-phone'
import Tr, { En, Es, tr } from 'src/components/Tr'
import LocalStorage from 'src/helpers/LocalStorage'
import { DateTime } from 'luxon'

class RequestPassInput {
  name: string = ''
}

const schema = Yup.object<RequestPassInput>().shape({
  name: Yup.string().required(tr({ en: "Can't be blank", es: 'No puede quedar vacío' })),
})

export default function GuestPassPage(props: F7Props): JSX.Element {
  const [state, setState] = useState({
    guestPasses: LocalStorage.getGuestPasses().reverse(),
  })

  const submissionHandler = new SubmitHandler(f7)

  const formik = useFormik<RequestPassInput>({
    validationSchema: schema,
    initialValues: { ...new RequestPassInput() },
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          props.f7router.navigate(dynamicPaths.userSurveysNewPath({ userId: 'guest' }, { guestName: values.name }))
        }
      })
    },
  })

  const recentPasses = state.guestPasses.filter((p) => p.submissionDate.diffNow('day').days > -2)
  const olderPasses = state.guestPasses.filter((p) => p.submissionDate.diffNow('day').days <= -2)

  return (
    <Page>
      <Block>
        <h1>
          Guest Passes
        </h1>
        <p>
          Create a guest pass if you're having trouble signing in or don't have
          an account. Note that your pass will only be saved on your phone.
          You will need to share it with your school or business.
          <br />
          You can submit this form for as many people as needed.
        </p>
        <FormikProvider value={formik}>
          <List
            noHairlines
            form
            onSubmit={(e) => {
              e.preventDefault()
              formik.submitForm()
            }}
          >
            <FormikInput
              label={tr({ en: 'Who is this pass for?', es: 'Nombre' })}
              name="name"
              type="text"
            />
            <Button style={{ marginTop: '1rem' }} type="submit" outline fill>
              Request Guest Pass
            </Button>
          </List>
        </FormikProvider>
      </Block>
      {
        recentPasses.length > 0 && (
        <Block>
          <BlockTitle>Your Recent Passes</BlockTitle>
          <List>
            {
              recentPasses.map((pass) => <ListItem title={pass.name || 'Unknown Name'} after={pass.title() === 'Pending' ? 'Stay Home' : pass.title()} footer={pass.createdAt.toLocaleString(DateTime.DATETIME_SHORT)} />)
            }
          </List>
        </Block>
        )
      }

    </Page>
  )
}
