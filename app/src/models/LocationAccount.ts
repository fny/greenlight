import { User } from './User'
import { Location } from './Location'
import { Model, attribute as attr, initialize, relationship, STRING } from './Model'

export class LocationAccount extends Model {
  static singular = 'locationAccount'
  static plural = 'locationAccounts'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING }) locationId: string | null = null
  @attr({ type: STRING }) externalId: string | null = null
  @attr({ type: STRING }) role: string | null = null
  @attr({ type: STRING }) title: string | null = null
  @attr({ type: STRING }) permissionLevel: string | null = null
  @attr({ type: STRING }) attendanceStatus: string | null = null


  @relationship({ type: 'hasOne', model: 'location' })
  location: Location = new Location()

  @relationship({ type: 'hasOne', model: 'user' })
  user: User = new User()
}
