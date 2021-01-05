import { IframeHTMLAttributes } from 'react'

function loadIframe(src: string, attributes: any = {}) {
  return
  const el = document.createElement('iframe')
  el.src = src
  Object.keys(attributes).forEach((key) => {
    (el as any)[key] = attributes[key]
  })
  document.getElementById('preload')?.appendChild(el)
  return el
}

export const castlightTestSiteFinderFrame = loadIframe('https://my.castlighthealth.com/corona-virus-testing-sites/?embed=true&from=greenlight', {
  title: 'Lookup Test Location',
  frameBorder: '0',
  width: '0',
  height: '0',
})

export const chwRequestEnFrame = loadIframe('https://airtable.com/embed/shrIt4hurTNBrZD0g', {
  class: 'airtable-embed',
  frameBorder: '0',
  width: '0',
  height: '0',
})

export const chwRequestEsFrame = loadIframe('https://airtable.com/embed/shrn4S5XoOVO8S4dC', {
  class: 'airtable-embed',
  frameBorder: '0',
  width: '0',
  height: '0',
})

export const supportFrame = loadIframe('https://greenlighted.org/app-support/', {
  width: '0',
  height: '0',
})
