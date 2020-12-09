import { useField } from 'formik'
import { ListItem } from 'framework7-react'
import React from 'react'
import { assertNotUndefined } from 'src/helpers/util'

export default function FormikItem(props: ListItem.Props) {
  assertNotUndefined(props.name)
  const [field] = useField(props.name)
  const newProps = {
    onChange: field.onChange,
    name: props.name,
    ...props,
  }

  if (props.checkbox) {
    newProps.checked = field.value
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <ListItem {...newProps} />
}
FormikItem.displayName = 'F7ListItem'
