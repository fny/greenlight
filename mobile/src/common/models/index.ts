import { ModelRegistry } from './model'
import { User } from './user'
import { GreenlightStatus } from './greenlightStatus'
import { Location } from './location'
import { MedicalEvent } from './medicalEvent'


ModelRegistry.register(User, GreenlightStatus, Location, MedicalEvent)

export { ModelRegistry, User, GreenlightStatus, Location, MedicalEvent }
