import { User } from './user'
import { Location } from './location'
import { Model, attribute as attr, initialize, relationship, STRING } from './model'

export class LocationAccount extends Model {
  static singular = 'locationAccount'
  static plural = 'locationAccounts'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }


  @attr({ type: STRING }) name: string = ''
  @attr({ type: STRING }) phoneNumber: string | null = null
  @attr({ type: STRING }) website: string | null = null
  @attr({ type: STRING }) email: string = ''
  @attr({ type: STRING }) zipCode: string | null = null

  @relationship({ type: 'hasOne', model: 'location' })
  location: Location = new Location()

  @relationship({ type: 'hasOne', model: 'user' })
  user: User = new User()
}
