import { Model, ModelRegistry } from './Model'
import { User } from './User'
import { GreenlightStatus } from './GreenlightStatus'
import { Location } from './Location'
import { LocationAccount } from './LocationAccount'
import { MedicalEvent } from './MedicalEvent'


ModelRegistry.register(User, GreenlightStatus, Location, LocationAccount, MedicalEvent)

export { Model, ModelRegistry, User, GreenlightStatus, Location, MedicalEvent }
