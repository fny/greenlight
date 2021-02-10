import {
  Link, PageContent, Sheet, Toolbar,
} from 'framework7-react'
import React from 'react'
import Tr, { tr } from 'src/components/Tr'

interface Props {
  opened: boolean
  onClose: () => void
}

export default function TermsAndConditionsSheet(props: Props): JSX.Element {
  return (
    <Sheet
      opened={props.opened}
      onSheetClosed={props.onClose}
    >
      <Toolbar>
        <div className="left" />
        <div className="right">
          <Link sheetClose>
            <Tr en="Close" es="Cerrar" />
          </Link>
        </div>
      </Toolbar>
      {/*  Scrollable sheet content */}
      <PageContent>
        <iframe
          title={tr({ en: 'Terms and Conditions', es: 'Términos y Condiciones' })}
          src="https://docs.greenlightready.com/terms"
          style={{ width: '100%', border: 0, height: '90%' }}
        />
      </PageContent>
    </Sheet>
  )
}
