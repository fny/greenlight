export default class Version {
  major: number

  minor: number

  patch: number

  constructor(value: string) {
    const matches = value.match(/(\d+\.)(\d+\.)(\d+)/)
    if (!matches) throw new Error(`${value} is not a valid version string`)
    this.major = parseInt(matches[1], 10)
    this.minor = parseInt(matches[2], 10)
    this.patch = parseInt(matches[3], 10)
  }

  valueOf() {
    return this.major * 1000000 + this.minor * 1000 + this.patch
  }
}
