import { GreenlightStatus } from '.'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; const
      v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export class GuestPass extends GreenlightStatus {
  static modelName = 'guestPass'

  id: string = uuidv4()

  name?: string
}
