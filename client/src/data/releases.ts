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
    version: '1.2.0',
    date: date('11/20/2020'),
    notesEn: `
    It's been far too long. Happy Friday!
    `,
    notesEs: '',
    whatsNewEn: [
      'Welcome Durham City and County! Thanks to a grant, business in Durham can use Greenlight for free!',
      "We've added community health worker requests to the dashboard! You can now make health social service requests directly from community members of the Triangle area.",
      "We've added maps and COVID statistics for you to investigate for the state",
      'A new settings page is available which allows you to update your notification preferences and make changes to your user account',
      // 'This releases page!',
      // "We've added the Duke COVID testing hotline",
      // "We've added more Spanish language translations",
      // "The app will now tell you if you're disconnected from the internet.",
      // 'The app will now tell you if our servers are down.',
      // "We've a bug report button to the app.",
    ],
    whatsNewEs: [
      // '¡Esta página de lanzamientos!',
      // 'Hemos agregado la línea directa de prueba de Duke COVID',
      // 'Hemos agregado más traducciones al español',
      // 'La aplicación ahora te dirá si estás desconectado de Internet',
      // 'La aplicación ahora le dirá si nuestros servidores están caídos.',
      // 'Tenemos un botón de informe de errores en la aplicación.',
    ],
    bugFixesEn: [
      "Need to fix: Spanish language is not currently loaded. We're working on a fix.",
    ],
    bugFixesEs: [
      // 'Algunos usuarios informaron problemas en versiones anteriores de Internet Explorer. Aunque no recomendamos utilizar IE, creemos que debería poder utilizarlo para enviar una encuesta',
    ],
  },
  {
    version: '1.1.0',
    date: date('11/6/2020'),
    notesEn: `
    Happy Friday! We've added a lot a new changes to the app.
    `,
    notesEs: `
    TODO:
    `,
    whatsNewEn: [
      'This releases page!',
      "We've added the Duke COVID testing hotline",
      "We've added more Spanish language translations",
      "The app will now tell you if you're disconnected from the internet.",
      'The app will now tell you if our servers are down.',
      "We've a bug report button to the app.",
    ],
    whatsNewEs: [
      '¡Esta página de lanzamientos!',
      'Hemos agregado la línea directa de prueba de Duke COVID',
      'Hemos agregado más traducciones al español',
      'La aplicación ahora te dirá si estás desconectado de Internet',
      'La aplicación ahora le dirá si nuestros servidores están caídos.',
      'Tenemos un botón de informe de errores en la aplicación.',
    ],
    bugFixesEn: [
      "Some users reported issues on older versions of Internet Explorer. While we don't recommend using IE, we think you should be able to submit a survey with it.",
    ],
    bugFixesEs: [
      'Algunos usuarios informaron problemas en versiones anteriores de Internet Explorer. Aunque no recomendamos utilizar IE, creemos que debería poder utilizarlo para enviar una encuesta',
    ],
  },
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
