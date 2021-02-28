import { t, Trans } from '@lingui/macro'
import { FormikProvider, useFormik } from 'formik'
import { Block, BlockTitle, Button, f7, List, ListInput, ListItem, Navbar, Page } from 'framework7-react'
import React, { useGlobal, useRef } from 'reactn'
import { store } from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { User } from 'src/models'
import { paths } from 'src/config/routes'
import { assertNotNull, formatPhone } from 'src/helpers/util'
import * as Yup from 'yup'
import { F7Props, FunctionComponent } from '../../types'
import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import FakeF7ListItem from 'src/components/FakeF7ListItem'
import { tr } from 'src/components/Tr'

interface EditUserInput {
  firstName: string
  lastName: string
  emailOrMobile: string
}

const schema = Yup.object<EditUserInput>().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  zipCode: Yup.string().matches(/^\d{5}$/, {
    excludeEmptyString: true,
    message: t({ id: 'EditUserPage.invalid_zip_code', message: 'Zip code should be 5 digits' }),
  }),
})

const ParentNewPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)
  const submissionHandler = new SubmitHandler(f7)
  const emailOrMobileRef = useRef<EmailOrPhoneListInput>(null)

  const { userId } = f7route.params

  const user = store.findEntity<User>(`user-${userId}`)

  if (!user) {
    f7router.navigate(paths.notFoundPath)
    return <></>
  }

  const formik = useFormik<EditUserInput>({
    validationSchema: schema,
    validateOnChange: true,
    initialValues: {
      firstName: '',
      lastName: '',
      emailOrMobile: '',
    },
    onSubmit: (values) => {
      console.log('onSubmit', values)
    },
  })

  return (
    <Page>
      <Navbar title={tr({ en: 'Add Parent', es: 'Editar padre', reviewTrans: true })} backLink />

      <FormikProvider value={formik}>
        <List form id="EditUserPage-form" onSubmit={formik.handleSubmit} noHairlines>
          <ListInput
            name="firstName"
            label={t({ id: 'EditUserPage.first_name_label', message: 'First Name' })}
            validateOnBlur
            value={formik.values.firstName}
            required
            onInput={formik.handleChange}
            errorMessage={t({ id: 'EditUserPage.first_name_missing', message: 'Please enter your first name.' })}
          />
          <ListInput
            name="lastName"
            label={t({ id: 'EditUserPage.last_name_label', message: 'Last Name' })}
            validateOnBlur
            value={formik.values.lastName}
            required
            onInput={formik.handleChange}
            errorMessage={t({ id: 'EditUserPage.last_name_missing', message: 'Please enter your last name.' })}
          />
          <EmailOrPhoneListInput
            value={formik.values.emailOrMobile}
            ref={emailOrMobileRef}
            onInput={(e) => {
              formik.setFieldValue('emailOrMobile', e.target.value)
            }}
          />

          <Block>
            <Button type="submit" outline fill>
              <Trans id="Common.submit">Submit</Trans>
            </Button>
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}

export default ParentNewPage
