import { ModelRegistry } from './model'
import { User } from './user'
import { GreenlightStatus } from './greenlightStatus'
import { Location } from './location'
import { LocationAccount } from './locationAccount'
import { MedicalEvent } from './medicalEvent'


ModelRegistry.register(User, GreenlightStatus, Location, LocationAccount, MedicalEvent)

export { ModelRegistry, User, GreenlightStatus, Location, MedicalEvent }
