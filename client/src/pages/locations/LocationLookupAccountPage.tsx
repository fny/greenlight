import {
  Badge, Block, BlockTitle, Button, f7, List, ListInput, Page,
} from 'framework7-react'
import React, { useMemo, useState } from 'react'
import { mailInvite } from 'src/api'
import EmailSupportLink from 'src/components/EmailSupportLink'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import Tr, { En, Es, tr } from 'src/components/Tr'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { lcTrans } from 'src/models/Location'
import { F7Props } from 'src/types'

export default function LocationLookupAccountPage({ f7route, f7router }: F7Props) {
  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  return (
    <Page>
      <LoadingLocationContent
        showNavbar
        showAsPage
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)
          assertNotUndefined(location)

          return (
            <Block>
              <BlockTitle medium className="title">
                <b>{location.name}</b>
                <Badge className="title-badge">
                  {lcTrans(location.category)}
                </Badge>
              </BlockTitle>
              <p>
                <Tr>
                  <En>
                    If you have a Hotmail, MSN, Live, Outlook or other Microsoft email account
                    and don't receive an invite, please contact us at{' '}
                    <EmailSupportLink />
                  </En>
                  <Es>
                    Si tiene una cuenta de correo electrónico de Hotmail, MSN, Live, Outlook u otra cuenta de Microsoft
                    y no recibe una invitación, comuníquese con nosotros a <EmailSupportLink />
                  </Es>
                </Tr>

              </p>
              <LookupAccount />
            </Block>
          )
        }}
      />
    </Page>
  )
}

function LookupAccount(): JSX.Element {
  const [emailOrMobile, setEmailOrMobile] = useState<string>('')

  const submitHandler = useMemo(
    () => new SubmitHandler(f7, {
      onSuccess: () => {
        f7.dialog.alert(
          tr({
            en: 'You should receive a text or email with instructions from Greenlight soon. Please check spam too!',
            es: 'Pronto recibirá un mensaje de texto o correo electrónico con instrucciones. ¡Por favor revise el spam también!',
          }),
          tr({ en: 'Success', es: 'Éxito' }),
        )
      },
      errorTitle: tr({ en: 'Not Found', es: 'No Encontrado' }),
      errorMessage: tr({
        en: 'No matching email or phone number was found. Maybe you already finished registration?',
        es: 'No se encontró ningún correo electrónico o número de teléfono que coincida. ¿Quizás ya terminó de registrarse?',
      }),
      onSubmit: async () => {
        await mailInvite(emailOrMobile)
      },
    }),
    [emailOrMobile],
  )

  return (
    <List
      form
      noHairlines
      onSubmit={(e) => {
        e.preventDefault()

        submitHandler.submit()
      }}
    >
      {/* TODO: Switch to email or mobile input type */}
      <ListInput
        label="Email or Mobile Number"
        placeholder="Your Email or Mobile Number"
        type="text"
        required
        onChange={(e) => {
          setEmailOrMobile(e.target.value)
        }}
      />
      <br />
      <Button fill type="submit">
        Lookup Account
      </Button>
    </List>
  )
}
