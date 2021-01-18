import { List, ListItem } from 'framework7-react'
import React from 'react'
import { tr } from './Tr'

interface Props {
  /** Is this for a school? */
  isSchool?: boolean

  /** What to do when values are selected */
  onChange?: (values: string[]) => void
}

export function UsersFilter(props: Props): JSX.Element {
  return (
    <ListItem
      title="Filter"
      smartSelect
      smartSelectParams={{ searchbar: true, searchbarPlaceholder: 'Search' }}
    >
      <select
        name="user-filter"
        multiple
        defaultValue={[]}
        onChange={(e) => {
          if (!props.onChange) return
          const values = Array.from(e.currentTarget.selectedOptions).map((x) => x.value)
          props.onChange(values)
        }}
      >
        {
        props.isSchool
          && (
          <optgroup label={tr({ en: 'Role', es: 'Papel' })}>
            <option value="role:student">
              {tr({ en: 'Student', es: 'Estudiante' })}
            </option>
            <option value="role:teacher">
              {tr({ en: 'Teacher', es: 'Maestro' })}
            </option>
            <option value="role:staff">
              {tr({ en: 'Staff', es: 'Personal' })}
            </option>
          </optgroup>
          )
        }
        <optgroup label={tr({ en: 'Status', es: 'Estado' })}>
          <option value="status:cleared">
            {tr({ en: 'Cleared', es: 'Aprobado' })}
          </option>
          <option value="status:pending">
            {tr({ en: 'Pending', es: 'Pendiente' })}
          </option>
          <option value="status:recovery">
            {tr({ en: 'Recovery', es: 'Recuperación' })}
          </option>
          <option value="status:not_submitted">
            {tr({ en: 'Not Submitted', es: 'No Enviado' })}
          </option>
        </optgroup>
      </select>
    </ListItem>
  )
}

UsersFilter.displayName = 'F7ListItem'

export function UsersFilterList(props: Props): JSX.Element {
  return (
    <List noHairlines style={{ marginBottom: '0', marginTop: '0' }}>
      <UsersFilterList {...props} />
    </List>
  )
}
