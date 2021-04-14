import { Model, ModelRegistry } from 'src/lib/Model'
import { User } from './User'
import { GreenlightStatus } from './GreenlightStatus'
import { Location } from './Location'
import { LocationAccount } from './LocationAccount'
import { MedicalEvent } from './MedicalEvent'
import { UserSettings } from './UserSettings'
import { Cohort } from './Cohort'
import CurrentUser from './CurrentUser'
import { GuestPass } from './GuestPass'

ModelRegistry.register(
  User, CurrentUser, UserSettings, GreenlightStatus, Location, LocationAccount, MedicalEvent, Cohort, GuestPass,
)

export {
  Model, ModelRegistry, User, CurrentUser, UserSettings, GreenlightStatus, Location, LocationAccount, MedicalEvent, Cohort, GuestPass,
}
