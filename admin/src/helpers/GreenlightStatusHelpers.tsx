import React from 'react'

import { GreenlightStatus } from '../common/models'

function greenlightStatusCssClass(status: GreenlightStatus) {
  switch (status.status) {
    case GreenlightStatus.STATUSES.GREEN:
      return 'sucess'
    case GreenlightStatus.STATUSES.YELLOW:
      return 'warning'
    case GreenlightStatus.STATUSES.RED:
      return 'danger'
    case GreenlightStatus.STATUSES.ABSENT:
      return 'primary'
    case GreenlightStatus.STATUSES.UNKNOWN:
      return 'secondary'
    default:
      throw new Error(`Status not found ${status.status}.`)
  }
}



export function greenlightStatusLabel(status: GreenlightStatus) {
  return <span
    className={`label label-lg label-light-${greenlightStatusCssClass(status)} label-inline`}
    >
      {/* {UserStatusTitles[row.status]} */}
    </span>
}





