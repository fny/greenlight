import {
  Model, attribute as attr, initialize, STRING, hasOne,
} from 'src/lib/Model'
import { User } from './User'
import { Location } from './Location'

export enum PermissionLevels {
  // Has access to everything including student data
  MEDICAL_STAFF = 'medical_staff',
  // Has access to everything except health data data
  OWNER = 'owner',
  // DEPRECATED: Alias for student manager
  ADMIN = 'admin',
  // Has access and can make changes to staff, including permissions, and student data
  STAFF_MANAGER = 'staff_manager',
  // Has access and can make changes to student data
  STUDENT_MANAGER = 'student_manager',
  // No permissions
  NONE = 'none',
}

export enum Roles {
  Unknown = 'unknown',
  Student = 'student',
  Parent = 'parent',
  Teacher = 'teacher',
  Staff = 'staff',
}

export class LocationAccount extends Model {
  static modelName = 'locationAccount'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING }) locationId: string | null = null

  @attr({ type: STRING }) externalId: string | null = null

  @attr({ type: STRING }) role: Roles | null = null

  @attr({ type: STRING }) permissionLevel: PermissionLevels | null = null

  @hasOne('Location')
  location: Location | null = null

  @hasOne('User')
  user: User | null = null

  /**
   * @returns whether account can administer staff data
   */
  hasStaffAccess(): boolean {
    return [
      PermissionLevels.MEDICAL_STAFF,
      PermissionLevels.OWNER,
      PermissionLevels.STAFF_MANAGER,
    ].includes(this.permissionLevel || PermissionLevels.NONE)
  }

  /**
   * @returns whether account can administer student data
   */
  hasStudentAccess(): boolean {
    return [
      PermissionLevels.MEDICAL_STAFF,
      PermissionLevels.OWNER,
      PermissionLevels.STAFF_MANAGER,
      PermissionLevels.STUDENT_MANAGER,
    ].includes(this.permissionLevel || PermissionLevels.NONE)
  }

  /**
   * @returns whether account can administer medical data
   */
  hasMedicalAccess(): boolean {
    return this.permissionLevel === PermissionLevels.MEDICAL_STAFF
  }

  isStudent(): boolean {
    return this.role === Roles.Student
  }

  isOwner(): boolean {
    return this.permissionLevel === PermissionLevels.OWNER
  }

  /**
   * @returns Whether account has any administrative privileges whatsoever
   */
  isAdmin(): boolean {
    return this.permissionLevel !== PermissionLevels.NONE
  }
}
