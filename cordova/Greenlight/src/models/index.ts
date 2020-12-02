import { Model, ModelRegistry } from './Model'
import { User } from './User'
import { GreenlightStatus } from './GreenlightStatus'
import { Location } from './Location'
import { LocationAccount } from './LocationAccount'
import { MedicalEvent } from './MedicalEvent'
import { UserSettings } from './UserSettings'

ModelRegistry.register(User, UserSettings, GreenlightStatus, Location, LocationAccount, MedicalEvent)

export {
  Model, ModelRegistry, User, UserSettings, GreenlightStatus, Location, MedicalEvent,
}
