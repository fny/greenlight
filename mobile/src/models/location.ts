import { Model, attribute as attr, Base } from "./base";

@Model({ singular: 'location', plural: 'locations' })
export class LocationX extends Base {
  @attr() id: number = -2
  @attr() name: string = ''
  @attr() phoneNumber: string | null = null
  @attr() email: string = ''
  @attr() zipCode: string | null = null
}

export interface Location  {
  id: number
  name: string
  phoneNumber?: string
  email: string
  zipCode?: string
  website?: string
}
