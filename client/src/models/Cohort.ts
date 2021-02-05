import { DateTime } from 'luxon'
import {
  Model, attribute as attr, initialize, STRING, BOOLEAN, NUMBER, DATETIME,
} from 'src/lib/Model'

export class Cohort extends Model {
  static modelName = 'cohort'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  location_id: string = ''

  @attr({ type: STRING })
  category: string = ''

  @attr({ type: STRING })
  name: string = ''

  @attr({ type: DATETIME })
  createdAt: DateTime = DateTime.fromISO('')
}
