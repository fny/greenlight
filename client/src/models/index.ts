import { Model, ModelRegistry } from 'src/lib/Model'
import { User } from './User'
import { GreenlightStatus } from './GreenlightStatus'
import { Location } from './Location'
import { LocationAccount } from './LocationAccount'
import { MedicalEvent } from './MedicalEvent'
import { UserSettings } from './UserSettings'
import { CovidData } from './CovidData'

ModelRegistry.register(User, UserSettings, GreenlightStatus, Location, LocationAccount, MedicalEvent, CovidData)

export { Model, ModelRegistry, User, UserSettings, GreenlightStatus, Location, MedicalEvent, CovidData }
