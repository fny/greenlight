import {
  Block, Navbar,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import notFoundImage from 'src/assets/images/404.png'
import Tr, { tr } from './Tr'

export default function NotFoundContent({ title }: { title?: string }): JSX.Element {
  return (
    <>
      <Navbar title={title
        || tr({ en: 'Not Found', es: 'No Encontrado' })}
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block style={{ textAlign: 'center' }}>
        <img alt="404" src={notFoundImage} style={{ width: '40vh' }} />
        <p>
          <Tr
            en="We're sorry. The page you're looking for can't be found."
            es="Lo sentimos. No se encuentra la página que está buscando."
          />
        </p>
      </Block>
    </>
  )
}
