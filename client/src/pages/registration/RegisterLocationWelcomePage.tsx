import { t, Trans } from '@lingui/macro'
import {
  Block, Link, Page, Sheet,
} from 'framework7-react'
import React, { useState } from 'react'
import { isPresent } from 'src/helpers/util'
import { toggleLocale } from 'src/initializers/providers'
import { LOCATION_CATEGORIES } from 'src/models/Location'

function ResizingInput(props: React.HTMLProps<HTMLInputElement>): JSX.Element {
  const [value, setValue] = useState('')
  return (
    <input
      {...props}
      onChange={(e) => {
        setValue(e.target.value || '')
      }}
      size={value ? value.length : props.placeholder?.length}
    />
  )
}

function CategorySelect(): JSX.Element {
  return (
    <select name="category">
      {
        LOCATION_CATEGORIES.map((c) => (
          <option value={c}>
            <Trans id={`LocationCategories.${c}`} />
          </option>
        ))
      }
    </select>
  )
}

export default function RegisterLocationWelcomePage(): JSX.Element {
  return (
    <Page className="RegisterLocationWelcomePage">
      <style>
        {
          `
          .RegisterLocationWelcomePage input {
            display: inline;
            border-bottom: 1px dashed black;
          }
          .RegisterLocationWelcomePage .introduction {
            font-size: 1.5rem;
          }
          `
        }
      </style>
      <Block>
        <h1>
          Introduce yourself.
          {' '}
          <Link style={{ fontSize: '12px', paddingLeft: '1rem' }} onClick={() => toggleLocale()}>
            <Trans id="Common.toggle_locale">En Español</Trans>
          </Link>
        </h1>
        <p className="introduction">
          Hello, Greenlight!<br />
          My name is
          {' '}
          <ResizingInput type="text" placeholder="First Name" />
          {' '}
          <ResizingInput type="text" placeholder="Last Name" />,
          {' '}
          and I want to register my
          for Greenlight.
        </p>
        <p />
        By continuing you agree to Greenlight's Terms and Conditions.
      </Block>
      <Sheet className="categorySheet">
        <CategorySelect />
      </Sheet>
    </Page>
  )
}
