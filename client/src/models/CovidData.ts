import { Model, attribute as attr, initialize, STRING, NUMBER } from '../lib/Model'

export class CovidData extends Model {
  static modelName = 'covidData'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  fips: string = ''

  @attr({ type: STRING })
  state: string = ''

  @attr({ type: STRING })
  county: string = ''

  @attr({ type: NUMBER })
  cases: number | null = null

  @attr({ type: NUMBER })
  deaths: number | null = null

  // @attr({ type: NUMBER })
  // confirmed_cases: number | null = null

  // @attr({ type: NUMBER })
  // confirmed_deaths: number | null = null

  // @attr({ type: NUMBER })
  // probable_cases: number | null = null

  // @attr({ type: NUMBER })
  // probable_deaths: number | null = null
}
