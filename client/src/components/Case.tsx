import * as React from "react"
import logger from "src/logger"

interface WhenProps {
    value?: any
    children: any
}
export function When({ children }: WhenProps) {
  return <>{children === undefined ? null : children}</>
}

interface Props {
  test?: any
  children: React.ReactNode[] | React.ReactNode
}


export function Case({ test, children }: Props) {
  const matches = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child)) {
      return child.props.value === undefined || child.props.value === test
    }
    return false
  })

  if (matches.length === 0) {
      return <></>
  }
  if (matches.length > 1) {
    logger.dev(`<Case /> statement matched multiple children: ${test}`)
  }
  return <>{matches[0]}</>
}
