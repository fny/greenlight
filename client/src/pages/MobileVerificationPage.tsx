import React, { useState } from 'reactn'
import {
  f7, Page, Navbar, Block, Button, List, ListInput, ListItem,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'
import { useFormik, FormikProvider } from 'formik'
import ReactCodeInput from 'react-verification-code-input'
import * as Yup from 'yup'

import { FunctionComponent, F7Props } from 'src/types'
import SubmitHandler from 'src/helpers/SubmitHandler'

import './MobileVerificationPage.css'

interface MobileInput {
  mobileNumber: string
  mobileCarrier: string
}

const schema = Yup.object<MobileInput>().shape({
  mobileNumber: Yup.string()
    .required()
    .matches(/^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})( x\d{4})?$/gm, {
      excludeEmptyString: true,
      message: t({ id: 'MobileVerificationPage.invalid_phone_number', message: 'Invalid Phone Number' }),
    }),
  mobileCarrier: Yup.string().required(),
})

const submissionHandler = new SubmitHandler(f7)

const MobileVerificationPage: FunctionComponent<F7Props> = () => {
  const [isCodeSent, setCodeSent] = useState(false)
  const [verificationCodeInput, setVerificationCodeInput] = useState({
    value: '',
    isValid: false,
    touched: false,
  })

  const formik = useFormik<MobileInput>({
    validationSchema: schema,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      mobileNumber: '',
      mobileCarrier: '',
    },
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        console.log('submit', values)
        setCodeSent(true)
        return Promise.resolve()
      })
    },
  })

  return (
    <Page>
      <Navbar title={t({ id: 'MobileVerificationPage.title', message: 'Mobile Verification' })} />

      <FormikProvider value={formik}>
        <List form id="MobileVerificationPage-form" onSubmit={formik.handleSubmit} noHairlines>
          <ListInput
            name="mobileNumber"
            label={t({ id: 'MobileVerificationPage.mobile_number_label', message: 'Mobile Number' })}
            value={formik.values.mobileNumber}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.mobileNumber}
            errorMessageForce
          />

          <ListInput
            name="mobileCarrier"
            label={t({ id: 'MobileVerificationPage.mobile_carrier_label', message: 'Mobile Carrier' })}
            type="select"
            value={formik.values.mobileCarrier}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.mobileCarrier}
            errorMessageForce
          >
            <option value="something1">Something1</option>
            <option value="something2">Something2</option>
            <option value="something3">Something3</option>
            <option value="something4">Something4</option>
            <option value="something5">Something5</option>
          </ListInput>

          {isCodeSent && (
            <ListInput
              label={t({ id: 'MobileVerificationPage.verification_code', message: 'Verification Code' })}
              input={false}
              errorMessage={
                !verificationCodeInput.isValid && verificationCodeInput.touched
                  ? t({
                    id: 'MobileVerificationPage.verification_code_required',
                    message: 'Verification Code is Required',
                  })
                  : undefined
              }
              errorMessageForce
            >
              <div slot="input">
                <ReactCodeInput
                  fields={6}
                  className="verification-input"
                  onChange={(v) => setVerificationCodeInput((originalValue) => ({ ...originalValue, value: v, isValid: false }))}
                  onComplete={(v) => setVerificationCodeInput({ value: v, isValid: true, touched: true })}
                />
              </div>
            </ListInput>
          )}

          {isCodeSent && (
            <ListItem>
              <div>
                <span>
                  <Trans id="MobileVerificationPage.code_not_received">Didn't receive one?</Trans>
                </span>
                <span onClick={() => formik.handleSubmit()} className="resend-code">
                  <Trans id="MobileVerificationPage.click_here_to_resend">Click here to try again</Trans>
                </span>
              </div>
            </ListItem>
          )}

          <Block>
            {isCodeSent ? (
              <Button
                type="button"
                outline
                fill
                onClick={() => {
                  setVerificationCodeInput((v) => ({ ...v, touched: true }))
                }}
              >
                <Trans id="Common.submit">Submit</Trans>
              </Button>
            ) : (
              <Button type="submit" outline fill>
                <Trans id="Common.send_code">Send Code</Trans>
              </Button>
            )}
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}

export default MobileVerificationPage
