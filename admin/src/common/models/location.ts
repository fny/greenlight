import { Model, attribute as attr, initialize, STRING } from './model'

export class Location extends Model {
  static singular = 'location'
  static plural = 'locations'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING }) name: string = ''
  @attr({ type: STRING }) phoneNumber: string | null = null
  @attr({ type: STRING }) website: string | null = null
  @attr({ type: STRING }) email: string = ''
  @attr({ type: STRING }) zipCode: string | null = null
}
