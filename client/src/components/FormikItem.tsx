import { ListItem } from 'framework7-react'
import React from 'react'
import { assertNotUndefined } from 'src/util'

export default function FormikItem(props: ListItem.Props & { formik: any }) {
  assertNotUndefined(props.name)
  const newProps = {
    ...props, onChange: props.formik.handleChange, name: props.name,
  }

  if (props.checkbox) {
    newProps.checked = props.formik.values[props.name]
  }
  delete newProps.formik
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem {...newProps} />
}
FormikItem.displayName = 'F7ListItem'
