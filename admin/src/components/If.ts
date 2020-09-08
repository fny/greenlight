import * as React from 'react';

interface Props {
  test: boolean
  children: any
}

const If : React.FunctionComponent<Props> = ({ test, children }) => (
  test && children !== undefined && children !== null
    ? children
    : null
)


export default If
