import { Page } from 'framework7-react'
import React, { useState, useEffect } from 'react'
import { getLocation } from 'src/api'
import LoadingPageContent from 'src/components/LoadingPageContent'
import { Location } from 'src/models'

export default function PageWithRequest(): JSX.Element {
  const [location, setLocation] = useState<Location | null>(null)
  useEffect(() => {
    getLocation('greenlight').then((l) => setLocation(l))
  }, [])

  return (
    <Page>
      {
      location
        ? <p>{location.name}</p>
        : <LoadingPageContent />
      }
    </Page>
  )
}
