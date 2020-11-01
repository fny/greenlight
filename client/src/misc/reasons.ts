/* eslint-disable @typescript-eslint/no-unused-vars */

import { DateTime } from 'luxon'
import { GreenlightStatus, User } from 'src/models'

const REASON_REPLACEMENTS = {
  '{you}': (status: GreenlightStatus, submittingUser: User, targetUser: User) => {
    if (submittingUser === targetUser) {
      return 'you'
    }
    return targetUser.firstName || ''
  },
  '{You}': (status: GreenlightStatus, submittingUser: User, targetUser: User) => {
    if (submittingUser === targetUser) {
      return 'You'
    }
    return targetUser.firstName || ''
  },
  '{usted}': (status: GreenlightStatus, submittingUser: User, targetUser: User) => {
    if (submittingUser === targetUser) {
      return 'usted'
    }
    return targetUser.firstName || ''
  },
  '{Usted}': (status: GreenlightStatus, submittingUser: User, targetUser: User) => {
    if (submittingUser === targetUser) {
      return 'Usted'
    }
    return targetUser.firstName || ''
  },
  '{date}': (status: GreenlightStatus, submittingUser: User, targetUser: User) => status.expirationDate.plus({ days: 1 }).toLocaleString(DateTime.DATE_SHORT),
  '{days}': (status: GreenlightStatus, submittingUser: User, targetUser: User) => {
    const count = status.expirationDate.diff(status.submissionDate, 'days').days + 1
    if (count === 1) {
      return '1 day'
    }
    return `${count} days`
  },
  '{días}': (status: GreenlightStatus, submittingUser: User, targetUser: User) => {
    const count = status.expirationDate.diff(status.submissionDate, 'days').days + 1
    if (count === 1) {
      return '1 día'
    }
    return `${count} diás`
  },
}

const REASONS = {
  en: {
    recovery_asymptomatic_covid_exposure: {
      title: 'Please Stay Home',
      message: 'After a COVID-19 exposure, {you} will need to stay home for 14 days from first contact. You will be cleared to return in {days} on {date}.',
    },
    recovery_diagnosed_asymptomatic: {
      title: 'Please Stay Home',
      message: '{You} can return 10 days if no symptoms develop. {You} should be able to return in {days} on {date}.',
    },
    recovery_from_diagnosis: {
      title: 'Please Stay Home',
      message: 'Get well soon! {You} should stay home for at least {days}. If symptoms improve, {you} can return on {date}.',
    },
    pending_needs_diagnosis: {
      title: 'Seek Care',
      message: 'You should get in touch with a doctor immediately and schedule a test. {You} should be able to return in {days} on {date}. If you need help accessing resources, contact COVID-19 support from the home screen.',
    },
    recovery_not_covid_has_fever: {
      title: 'Please Stay Home',
      message: 'Due to the fever, {you} should stay home until 24 hours after the fever subsides.',
    },
    recovery_return_tomorrow: {
      title: 'One More Day!',
      message: 'The recovery period is almost done! {You} should stay home today, but {you} should be cleared to return tomorrow.',
    },
  },
  es: {
    recovery_asymptomatic_covid_exposure: {
      title: 'Por favor, quédese en casa',
      message: 'Después de una exposición al COVID-19, {usted} necesita quedarse en casa durante 14 días desde el primer contacto. {Usted} tendrá autorización para regresar en {días} el {date}.',
    },
    recovery_diagnosed_asymptomatic: {
      title: 'Por favor, quédese en casa',
      message: '{Usted} puede regresar 10 días si no se presentan síntomas. {Usted} debería poder regresar en {días} el {date}.',
    },
    recovery_from_diagnosis: {
      title: 'Por favor, quédese en casa',
      message: '¡Mejorate pronto! {Usted} debería quedarse en casa durante al menos {días}. Si los síntomas mejoran, {usted} puede regresar el {date}.',
    },
    pending_needs_diagnosis: {
      title: 'Busque atención',
      message: 'Debe ponerse en contacto con un médico de inmediato y programar una prueba. {Usted} debería poder regresar en {días} el {date}. Si necesita ayuda para acceder a los recursos, comuníquese con el soporte de COVID-19 desde la pantalla de inicio.',
    },
    recovery_not_covid_has_fever: {
      title: 'Por favor, quédese en casa',
      message: 'Debido a la fiebre, {usted} debe quedarse en casa hasta 24 horas después de que la fiebre desaparezca.',
    },
    recovery_return_tomorrow: {
      title: '¡Un día mas!',
      message: 'El período de recuperación casi ha terminado. {Usted} debería quedarse en casa hoy, pero {usted} debería tener autorización para regresar mañana.',
    },
  },
}

function interpolate(value: string, status: GreenlightStatus, submittingUser: User, targetUser: User) {
  for (const [key, replacer] of Object.entries(REASON_REPLACEMENTS)) {
    (
      value = value.replace(key, replacer(status, submittingUser, targetUser))
    )
  }
  return value
}

export function reasonTitle(targetUser: User, submittingUser: User) {
  const status = targetUser.greenlightStatus()
  const bundle = (REASONS[submittingUser.locale || 'en'] as any)[status.reason]
  return interpolate(bundle?.title || '', status, submittingUser, targetUser)
}

export function reasonMessage(targetUser: User, submittingUser: User) {
  const status = targetUser.greenlightStatus()
  const bundle = (REASONS[submittingUser.locale || 'en'] as any)[status.reason]
  return interpolate(bundle?.message || '', status, submittingUser, targetUser)
}
