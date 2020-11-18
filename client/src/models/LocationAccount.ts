import { User } from './User'
import { Location } from './Location'
import {
  Model, attribute as attr, initialize, STRING, hasOne,
} from './Model'

export enum PermissionLevels {
  ADMIN = 'admin',
  NONE = 'none',
}

export class LocationAccount extends Model {
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

  @hasOne('Location')
  location: Location | null = null

  @hasOne('User')
  user: User | null = null
}
