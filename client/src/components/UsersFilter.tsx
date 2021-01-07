import { List, ListItem } from 'framework7-react'
import React from 'react'

interface Props {
  naked?: boolean
}

export function UsersFilter(props: Props): JSX.Element {
  const content = (
    <ListItem
      title="Filter"
      smartSelect
      smartSelectParams={{ searchbar: true, searchbarPlaceholder: 'Search' }}
    >
      <select
        name="cohort"
        multiple
        defaultValue={[]}
      >
        <optgroup label="Role">
          <option value="role:student">Student</option>
          <option value="role:teacher">Teacher</option>
          <option value="role:staff">Staff</option>
        </optgroup>
        <optgroup label="Status">
          <option value="status:cleared">Cleared</option>
          <option value="status:pending">Pending</option>
          <option value="status:recovery">Recovery</option>
          <option value="status:unknown">Unknown</option>
        </optgroup>
        <optgroup label="Timezone">
          <option value="timezone:est">EST</option>
          <option value="timezone:cst">CST</option>
          <option value="timezone:mst">MST</option>
          <option value="timezone:pst">PST</option>
        </optgroup>
        <optgroup label="Team">
          <option value="team:ed">Ed</option>
          <option value="team:business">Business</option>
        </optgroup>
      </select>
    </ListItem>
  )

  if (props.naked) {
    return content
  }

  return (
    <List noHairlines style={{ marginBottom: '0', marginTop: '0' }}>
      {content}
    </List>
  )
}
