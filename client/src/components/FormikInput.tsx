import { ListInput } from 'framework7-react'
import React, { ReactNode } from 'react'
import { assertNotUndefined } from 'src/util'

export default function FormikInput(props: ListInput.Props & { formik: any, children?: ReactNode }) {
  assertNotUndefined(props.name)
  const newProps = {
    ...props, onChange: props.formik.handleChange, name: props.name,
  }
  delete newProps.formik
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListInput {...newProps} />
}
FormikInput.displayName = 'F7ListInput'
