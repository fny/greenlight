import { User } from './User'
import { Location } from './Location'
import {
  Model, attribute as attr, initialize, STRING, hasOne,
} from 'src/lib/Model'

export enum PermissionLevels {
  OWNER = 'owner',
  ADMIN = 'admin',
  NONE = 'none',
}

export enum Roles {
  STUDENT = 'student',
  TEACHER = 'teacher',
  STAFF = 'staff',
  UNKNOWN = 'unknown',
}

export class LocationAccount extends Model {
  static modelName = 'locationAccount'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING }) locationId: string | null = null

  @attr({ type: STRING }) externalId: string | null = null

  @attr({ type: STRING }) role: string | null = null

  @attr({ type: STRING }) title: string | null = null

  @attr({ type: STRING }) permissionLevel: PermissionLevels | null = null

  @attr({ type: STRING }) attendanceStatus: string | null = null

  @hasOne('Location')
  location: Location | null = null

  @hasOne('User')
  user: User | null = null

  isAdmin(): boolean {
    return this.permissionLevel === PermissionLevels.ADMIN || this.permissionLevel === PermissionLevels.OWNER
  }

  isOwner(): boolean {
    return this.permissionLevel === PermissionLevels.OWNER
  }

  isStudent(): boolean {
    return this.role === Roles.STUDENT
  }
}
