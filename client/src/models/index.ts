import { Model, ModelRegistry } from 'src/lib/Model'
import { User } from './User'
import { GreenlightStatus } from './GreenlightStatus'
import { Location } from './Location'
import { LocationAccount } from './LocationAccount'
import { MedicalEvent } from './MedicalEvent'
import { UserSettings } from './UserSettings'
import { Cohort } from './Cohort'
import CurrentUser from './CurrentUser'

ModelRegistry.register(
  User, CurrentUser, UserSettings, GreenlightStatus, Location, LocationAccount, MedicalEvent, Cohort,
)

export {
  Model, ModelRegistry, User, CurrentUser, UserSettings, GreenlightStatus, Location, LocationAccount, MedicalEvent, Cohort,
}
