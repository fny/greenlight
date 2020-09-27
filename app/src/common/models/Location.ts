import { Model, attribute as attr, initialize, STRING, BOOLEAN } from './Model'

export class Location extends Model {
  static singular = 'location'
  static plural = 'locations'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING }) name: string | null = null
  @attr({ type: STRING }) phoneNumber:  string | null = null
  @attr({ type: STRING }) website: string | null = null
  @attr({ type: STRING }) permalink:  string | null = null
  @attr({ type: STRING }) category:  string | null = null
  @attr({ type: STRING }) email:  string | null = null
  @attr({ type: STRING }) zipCode: string | null = null
  @attr({ type: BOOLEAN }) hidden = true
}
