import { IframeHTMLAttributes } from "react"

function loadIframe(src: string, attributes: any = {}) {
  const el = document.createElement('iframe')
  el.src = src
  Object.keys(attributes).forEach(key => {
    (el as any)[key] = attributes[key]
  })
  return el
}

export const castlightTestSiteFinderFrame = loadIframe('https://my.castlighthealth.com/corona-virus-testing-sites/?embed=true&amp;guidelines=northcarolina', {
  frameBorder: '0',
  width: '100%',
  height: '100vh'
})
