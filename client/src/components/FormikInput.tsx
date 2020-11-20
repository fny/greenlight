import {
  FormikComputedProps, FormikErrors, FormikHandlers, FormikHelpers, FormikState,
} from 'formik'
import { ListInput } from 'framework7-react'
import React, { ReactNode } from 'react'
import { FormikInstance } from 'src/types'
import { assertNotUndefined, isPresent } from 'src/util'

function processError(error: string | FormikErrors<any> | string[] | FormikErrors<any>[] | undefined): string | undefined {
  if (typeof error === 'string' || !error) {
    return error
  }
  if (Array.isArray(error)) {
    // FIXME: error could be a FormikErrors<any>[]
    return error.join('; ')
  }
  // FIXME: error could be a FormikErrors<any>
  return error.toString()
}

export default function FormikInput(props: ListInput.Props & { formik: FormikInstance<any>, children?: ReactNode }) {
  assertNotUndefined(props.name)
  const { formik } = props
  const errorMessage = processError(formik.errors && formik.errors[props.name])

  const newProps = {
    onBlur: formik.handleBlur,
    onChange: formik.handleChange,
    name: props.name,
    value: formik.values[props.name],
    errorMessage,
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    errorMessageForce: isPresent(errorMessage) && formik.touched[props.name],
    ...props,
  }

  // delete newProps.formik
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListInput {...newProps} />
}

// We do this to prevent Framework7 from wrapping the list input in a ul
FormikInput.displayName = 'F7ListInput'
