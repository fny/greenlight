import { f7, Page } from 'framework7-react'
import React, { useEffect } from 'react'
import { useGlobal, useMemo } from 'reactn'
import { checkLocationRegistrationCode } from 'src/api'
import { tr } from 'src/components/Tr'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotUndefined } from 'src/helpers/util'
import LocalStorage from 'src/helpers/LocalStorage'
import { Roles } from 'src/models/LocationAccount'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { F7Props } from 'src/types'
import LoadingPage from '../util/LoadingPage'

export default function LocationCheckRegistrationCodePage(props: F7Props): JSX.Element {
  const { locationId, registrationCode } = useMemo(() => props.f7route.params, [props.f7route.params])
  const [_registeringUser, setRegisteringUser] = useGlobal('registeringUser')

  assertNotUndefined(locationId)
  assertNotUndefined(registrationCode)

  const submitHandler = new SubmitHandler(f7, {
    onSuccess: (result) => {
      const registeringUser: RegisteringUser = new RegisteringUser()

      registeringUser.registrationCode = registrationCode
      if (result === 'teacher_staff') {
        registeringUser.availableRoles = [Roles.Teacher, Roles.Staff]
      } else if (result === 'student_parent') {
        registeringUser.availableRoles = [Roles.Parent, Roles.Student]
      } else {
        registeringUser.role = Roles.Staff
        registeringUser.availableRoles = []
      }
      setRegisteringUser(registeringUser)
      LocalStorage.setRegisteringUser(registeringUser)

      // !HACK: the page does not change if we don't wait for a reasonable time.
      setTimeout(() => {
        props.f7router.navigate(`/go/${locationId}/register/user`)
      }, 500)
    },
    errorTitle: tr({ en: 'Incorrect Code', es: 'Código Incorrecto' }),
    errorMessage: tr({
      en: 'The registration code you input is incorrect. Please try again with correct code!',
      es: 'El código de registro que ingresó es incorrecto. ¡Inténtelo de nuevo con el código correcto!',
    }),
    onError: () => {
      props.f7router.back()
    },
    onSubmit: () => checkLocationRegistrationCode(locationId, registrationCode),
  })

  useEffect(() => {
    submitHandler.submit()
  }, [])

  return (
    <Page>
      <LoadingPage />
    </Page>
  )
}
