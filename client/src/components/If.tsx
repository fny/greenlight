interface Props {
  test: boolean
  children: any
}

export default function If({ test, children }: Props) {
  return test && children !== undefined
    ? children
    : null
}
