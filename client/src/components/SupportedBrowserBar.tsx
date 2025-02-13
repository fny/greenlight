import React from 'react'
import { useState } from 'reactn'
import './SupportedBrowserBar.css'

// Generate this list with: npx browserslist-useragent-regexp --allowHigherVersions
// eslint-disable-next-line
export const supportedBrowsers = /((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(10[_.]3|10[_.]([4-9]|\d{2,})|(1[1-9]|[2-9]\d|\d{3,})[_.]\d+|11[_.]4|11[_.]([5-9]|\d{2,})|(1[2-9]|[2-9]\d|\d{3,})[_.]\d+|12[_.]0|12[_.]([1-9]|\d{2,})|12[_.]4|12[_.]([5-9]|\d{2,})|(1[3-9]|[2-9]\d|\d{3,})[_.]\d+|13[_.]0|13[_.]([1-9]|\d{2,})|13[_.]3|13[_.]([4-9]|\d{2,})|13[_.]7|13[_.]([8-9]|\d{2,})|(1[4-9]|[2-9]\d|\d{3,})[_.]\d+|14[_.]0|14[_.]([1-9]|\d{2,})|(1[5-9]|[2-9]\d|\d{3,})[_.]\d+)(?:[_.]\d+)?)|(CFNetwork\/8.* Darwin\/16\.5\.\d+)|(CFNetwork\/8.* Darwin\/16\.6\.\d+)|(CFNetwork\/8.* Darwin\/16\.7\.\d+)|(SamsungBrowser\/(11\.1|11\.([2-9]|\d{2,})|(1[2-9]|[2-9]\d|\d{3,})\.\d+|12\.0|12\.([1-9]|\d{2,})|(1[3-9]|[2-9]\d|\d{3,})\.\d+))|(Edge\/(18(?:\.0)?|18(?:\.([1-9]|\d{2,}))?|(19|[2-9]\d|\d{3,})(?:\.\d+)?|85(?:\.0)?|85(?:\.([1-9]|\d{2,}))?|(8[6-9]|9\d|\d{3,})(?:\.\d+)?))|((Chromium|Chrome)\/(49\.0|49\.([1-9]|\d{2,})|([5-9]\d|\d{3,})\.\d+|80\.0|80\.([1-9]|\d{2,})|(8[1-9]|9\d|\d{3,})\.\d+|83\.0|83\.([1-9]|\d{2,})|(8[4-9]|9\d|\d{3,})\.\d+)(?:\.\d+)?([\d.]+$|.*Safari\/(?![\d.]+ Edge\/[\d.]+$)))|(Version\/(13\.0|13\.([1-9]|\d{2,})|(1[4-9]|[2-9]\d|\d{3,})\.\d+|14\.0|14\.([1-9]|\d{2,})|(1[5-9]|[2-9]\d|\d{3,})\.\d+)(?:\.\d+)? Safari\/)|(Trident\/7\.0)|(Firefox\/(79\.0|79\.([1-9]|\d{2,})|([8-9]\d|\d{3,})\.\d+)\.\d+)|(Firefox\/(79\.0|79\.([1-9]|\d{2,})|([8-9]\d|\d{3,})\.\d+)(pre|[ab]\d+[a-z]*)?)|(([MS]?IE) (11\.0|11\.([1-9]|\d{2,})|(1[2-9]|[2-9]\d|\d{3,})\.\d+))/

export default function SupportedBrowserBar(): JSX.Element {
  const [hidden, setHidden] = useState(false)
  if (supportedBrowsers.test(navigator.userAgent) || hidden) {
    return <></>
  }

  return (
    <div className="SupportedBrowserBar">
      Your browser isn't supported. Some things might not work!
      <button type="button" className="close" onClick={() => setHidden(true)}>
        Hide
      </button>
    </div>
  )
}
