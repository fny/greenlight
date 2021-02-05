import { Router } from 'framework7/modules/router/router'
import React, { useEffect } from 'react'
import { once } from 'src/helpers/util'

/**
 * RouteOptions:
 *
 * reloadCurrent (boolean) - replace the current page with the new one from route, no animation in this case
 * reloadPrevious (boolean) - replace the previous page in history with the new one from route
 * reloadAll (boolean) - load new page and remove all previous pages from history and DOM
 * clearPreviousHistory (boolean) - previous pages history will be cleared after reloading/navigate to the specified route
 * animate (boolean) - whether the page should be animated or not (overwrites default router settings)
 * history (boolean) - whether the page should be saved in router history
 * pushState (boolean) - whether the page should be saved in browser state. In case you are using pushState, then you can pass here false to prevent route getting in browser history
 * ignoreCache (boolean) - If set to true then it will ignore if such URL in cache and reload it using XHR again
 * context (object) - additional Router component or Template7 page context
 * props (object) - props that will be passed as Vue/React page component props
 * transition (string) - route custom page transition name
 */

export interface NavigateProps {
  to: string
  f7router: Router.Router
  options?: Router.RouteOptions
}

export default function Navigate(props: NavigateProps): JSX.Element {
  useEffect(() => {
    once(
      () => props.f7router.allowPageChange,
      () => {
        props.f7router.navigate(props.to, {
          ...props.options,
        })
      }, 10,
    )
  }, [])

  return (
    <></>
  )
}
