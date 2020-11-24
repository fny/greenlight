import { FormikErrors, useField } from 'formik'
import { ListInput } from 'framework7-react'
import React, { ReactNode } from 'react'
import { assertNotUndefined, isPresent } from 'src/util'

function processError(
  error: string | FormikErrors<any> | string[] | FormikErrors<any>[] | undefined,
): string | undefined {
  if (typeof error === 'string' || !error) {
    return error
  }
  if (Array.isArray(error)) {
    return error.join('; ')
  }
  return error.toString()
}

export default function FormikInput(props: ListInput.Props & { children?: ReactNode }) {
  assertNotUndefined(props.name)
  const [field, meta] = useField(props.name)
  const errorMessage = processError(meta.error)

  const newProps = {
    onBlur: field.onBlur,
    onChange: field.onChange,
    name: props.name,
    value: field.value,
    errorMessage,
    autocomplete: 'off',
    autocorrect: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    errorMessageForce: isPresent(errorMessage) && meta.touched,
    ...props,
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListInput {...newProps} />
}

// We do this to prevent Framework7 from wrapping the list input in a ul
FormikInput.displayName = 'F7ListInput'
