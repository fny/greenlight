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
    version: '1.7.2',
    date: date('2/5/2020'),
    notesEn: 'Status display fixes',
    notesEs: 'Correcciones para los estados',
    whatsNewEn: [],
    whatsNewEs: [],
    bugFixesEn: ['We corrected a major issue with prevent statuses from displaying properly'],
    bugFixesEs: ['Corregimos un problema importante al evitar que se mostraran los estados'],
  },
  {
    version: '1.7.1',
    date: date('2/2/2020'),
    notesEn: 'New quarantine guidance, new admin features, bug fixes',
    notesEs: 'Nueva guía de cuarentena, nuevas funciones de administración, corrección de errores',
    whatsNewEn: [
      'Staff and students now have their own lists.',
      'You can filter by recovery and pending statuses',
      'Page loads on rosters are much faster now',
      'We added a new owner permission level',
      'Owners can now make updates to statuses'
    ],
    whatsNewEs: [
      'El personal y los estudiantes ahora tienen sus propias listas',
      'Puede filtrar por recuperación y estados pendientes',
      "La carga de páginas en las listas es mucho más rápida ahora",
      'Agregamos un nuevo nivel de permiso de propietario',
      "Los propietarios ahora pueden actualizar los estados"
    ],
    bugFixesEn: [
      'Personal Greenlight pass pages were not rendering properly',
      'We are looking into issues with repeat account lookups',
      'We are looking into fixing the chart counts to make sure individuals with pending or recovery statuses are counted even when they do not submit',
      'We are updating the status determination logic to the latest guidance, stay tuned!'
    ],
    bugFixesEs: [
      "Las páginas de pases personales de Greenlight no se mostraban correctamente",
      "Estamos investigando problemas con las búsquedas repetidas de cuentas",
      'Estamos buscando corregir los recuentos de gráficos para asegurarnos de que las personas con estados pendientes o de recuperación se cuenten incluso cuando no se envíen',
      "Estamos actualizando la lógica de determinación del estado a la última guía, ¡estad atentos!"
    ],
  },
  {
    version: '1.6.0',
    date: date('1/20/2020'),
    notesEn: 'New look, admin features and more!',
    notesEs: '¡Nuevo diseño, funciones de administración y más!',
    whatsNewEn: [
      'Welcome to the new Greenlight! With a Great new design, we have tons of new features too!',
      'Loading times on roster pages are 10x faster, note a few issues with search need to be fixed',
      'A new registration flow has been added to allow organizations to sign up for Greenlight',
    ],
    whatsNewEs: [
      '¡Bienvenido al nuevo Greenlight! ¡Tenemos un nuevo diseño y nuevas funciones también!',
      'Los tiempos de carga en las páginas de la lista son 10x más rápidos, tenga en cuenta que es necesario solucionar algunos problemas con la búsqueda',
      'Hay un nuevo flujo de registro para permitir que las organizaciones se registren en Greenlight',
    ],
    bugFixesEn: [
      'Some organizations and individuals were receiving notifications incorrectly',
    ],
    bugFixesEs: [
      'Algunas organizaciones e individuos estaban recibiendo notificaciones incorrectamente',
    ],
  },
  {
    version: '1.5.0',
    date: date('1/12/2020'),
    notesEn: "Happy Tuesday! We've added many new features and changes to Greenlight!",
    notesEs: '¡Feliz martes! Hemos agregado muchas funciones nuevas y cambios a Greenlight.',
    whatsNewEn: [
      'Password reset is finally here!',
      'Administrators now have a dashboard which presents all the details about their location',
      'New features have been released to enable larger schools to use Greenlight',
      'The school score card is now available for administrators',
      "We've added a new page for getting more information on how to deal with a positive case",
      "We've added more animated gifs for the year",
      'Update links to terms of service and privacy policy',
      'Add spanish translations to pages',
    ],
    whatsNewEs: [
      '¡El restablecimiento de contraseña finalmente está aquí!',
      'Los administradores ahora tienen un panel que presenta todos los detalles sobre su ubicación',
      'Se han lanzado nuevas funciones para permitir que las escuelas más grandes utilicen Greenlight',
      'La tarjeta de puntuación de la escuela ya está disponible para los administradores',
      'Agregamos una nueva página para obtener más información sobre cómo lidiar con un caso positivo',
      'Hemos agregado más gifs animados para el año',
      'Actualizar enlaces a los términos de servicio y la política de privacidad',
      'Agregar traducciones en español a las páginas',
    ],
    bugFixesEn: [
      "We've fixed the back button issue on the administrative pages",
      'We removed a few animated gifs that concerned some individuals',
      "We've added more information about issues when registering using Microsoft based accounts",
      'Improve loading times for resource pages',
    ],
    bugFixesEs: [
      'Hemos solucionado el problema del botón Atrás en las páginas administrativas',
      'Eliminamos algunos gifs animados que preocupaban a algunas personas',
      'Hemos agregado más información sobre problemas al registrarse con cuentas basadas en Microsoft',
      'Mejorar los tiempos de carga de las páginas de recursos',
    ],
  },
  {
    version: '1.4.0',
    date: date('12/1/2020'),
    notesEn: 'Minor fixes and administrative updates.',
    notesEs: 'Pequeñas correcciones y actualizaciones administrativas.',
    whatsNewEn: [
      'We can now register staff and students through a roster upload',
      "Users can now request an invite from a location's page",
    ],
    whatsNewEs: [
      'Ahora podemos registrar al personal y a los estudiantes a través de una carga de lista',
      'Los usuarios ahora pueden solicitar una invitación desde la página de una ubicación',
    ],
    bugFixesEn: [],
    bugFixesEs: [],
  },
  {
    version: '1.3.1',
    date: date('11/25/2020'),
    notesEn: "🦃 Happy Thanksgiving! We've fixed a lot of things that were broken. Thank you for bearing with us!",
    notesEs: '🦃 ¡Feliz día de acción de gracias! Hemos arreglado muchas cosas que estaban dañadas. ¡Gracias por entender!',
    whatsNewEn: [
      'Spanish is back!',
      "We've added a new way to search for test sites near you.",
      'You can now send requests to community health workers.',
      'Administrators can now promote other people to administrators.',
      'You can now join other businesses on Green.',
      'We added a button so you can easily return to the home screen from most pages.',
    ],
    whatsNewEs: [
      '¡Vuelve el español!',
      'Hemos agregado una nueva forma de buscar sitios de prueba cerca de usted.',
      'Ahora puede enviar solicitudes a los trabajadores de salud comunitarios.',
      'Los administradores ahora pueden promover a otras personas a administradores.',
      'Ahora puede unirse a otras empresas.',
    ],
    bugFixesEn: [
      'Notifications were not going out for some customers.',
      'Magic sign in was not working for some customers.',
      'We fixed lots of typos.',
      'We fixed rendering issues on iOS.',
      'The link to our privacy policy now works.',
    ],
    bugFixesEs: [
      'Las notificaciones no salían para algunos clientes',
      'El inicio de sesión mágico no funcionaba para algunos clientes',
      'Arreglamos muchos errores tipográficos',
      'Solucionamos problemas de renderizado en iOS',
      'El enlace a nuestra política de privacidad ahora funciona',
    ],
  },
  {
    version: '1.2.0',
    date: date('11/20/2020'),
    notesEn: `
    It's been far too long. Happy Friday!
    `,
    notesEs: 'Ha pasado demasiado tiempo. ¡Feliz viernes!',
    whatsNewEn: [
      'Welcome Durham City and County! Thanks to a grant, business in Durham can use Greenlight for free!',
      "We've added community health worker requests to the dashboard! You can now make health social service requests directly from community members of the Triangle area.",
      "We've added maps and COVID statistics for you to investigate for the state",
      'A new settings page is available which allows you to update your notification preferences and make changes to your user account',
    ],
    whatsNewEs: [
      'Bienvenidos la ciudad y el condado de Durham! ¡Gracias a una subvención, las empresas de Durham pueden usar Greenlight gratis!',
      '¡Hemos agregado solicitudes de trabajadores de salud comunitarios al tablero! Ahora puede realizar solicitudes de servicios sociales de salud directamente de los miembros de la comunidad del área de Triangle',
      'Hemos agregado mapas y estadísticas de COVID para que investigue para el estado',
      'Hay una nueva página de configuración disponible que le permite actualizar sus preferencias de notificación y realizar cambios en su cuenta de usuario',
    ],
    bugFixesEn: [
      "Need to fix: Spanish language is not currently loaded. We're working on a fix.",
    ],
    bugFixesEs: [
      'Necesidad de corregir: el idioma español no está cargado actualmente. Estamos trabajando en una solución',
    ],
  },
  {
    version: '1.1.0',
    date: date('11/6/2020'),
    notesEn: `
    Happy Friday! We've added a lot a new changes to the app.
    `,
    notesEs: `
    ¡Feliz viernes! Hemos agregado muchos cambios nuevos a la aplicación.
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
