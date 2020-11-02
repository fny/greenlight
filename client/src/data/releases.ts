import { DateTime } from 'luxon'

export interface ReleaseData {
  version: string
  date: DateTime
  notesEn: string
  notesEs: string
  whatsNewEn: string[]
  whatsNewEs: string[]
  bugFixesEn: string[]
  bugFixesEs: string[]
}

function date(value: string) {
  return DateTime.fromFormat(value, 'D')
}

const releaseData: ReleaseData[] = [
  {
    version: '1.0.0',
    date: date('10/12/2020'),
    notesEn: `
    Welcome to our first release! 🎉&nbsp;
    We're so happy to have you with us.
    Please reach out if you need any help, have questions or feedback.
    We want to make sure you have an amazing experience with us.
    `,
    notesEs: `
    ¡Bienvenido a nuestro primer lanzamiento! 🎉&nbsp;
    ¡Estamos muy felices de tenerte con nosotros!
    Comuníquese con nosotros si necesita ayuda, tiene preguntas o comentarios.
    Queremos asegurarnos de que tenga una experiencia increíble con nosotros.
    `,
    whatsNewEn: [],
    whatsNewEs: [],
    bugFixesEn: [],
    bugFixesEs: [],
  },
]

export default releaseData
