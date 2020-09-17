import { ReactNode } from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'

// From the 'history' package
type UnknownFacade = {} | null | undefined;

export type ReactRouterRender = ((props: RouteComponentProps<any, StaticContext, UnknownFacade>) => ReactNode) | undefined
