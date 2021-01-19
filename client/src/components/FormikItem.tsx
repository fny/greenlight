import { useField } from 'formik'
import { ListItem } from 'framework7-react'
import React from 'react'
import { assertNotUndefined } from 'src/helpers/util'

export default function FormikItem(props: ListItem.Props & { onChange?: (e: React.ChangeEvent<any>) => void }): JSX.Element {
  assertNotUndefined(props.name)
  const [field] = useField(props.name)
  const newProps = {
    onChange: (e: React.ChangeEvent<any>) => {
      if (props.onChange) props.onChange(e)
      field.onChange(e)
    },
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
