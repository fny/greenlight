import { Page } from 'framework7-react'
import { ComponentType } from 'react'
import React, { useReducer, useContext, createContext, useCallback, useEffect } from 'reactn'
import logger from 'src/helpers/logger'
import LoadingPage from 'src/pages/util/LoadingPage'
import { F7Props } from 'src/types'

export interface APIProviderProps extends F7Props {
  fetchData: (...params: any[]) => Promise<any>
  initialCall?: boolean
  showLoadingOnUpdate?: boolean
}

interface APIState<T> {
  data: T
  isLoading: boolean
}

const initialState: APIState<any> = {
  data: undefined,
  isLoading: false,
}

interface APIContextValue<T> extends APIState<T> {
  update: (...params: any[]) => Promise<T | void>
  setData: (data: any) => any
}

type SetLoadingAction = {
  type: 'SetLoading'
}

type SetDataAction<T> = {
  type: 'SetData'
  payload: {
    data: Partial<T> | null
  }
}

type Action<T> = SetLoadingAction | SetDataAction<T>

const reducer = <T extends Object>(state: APIState<T>, action: Action<T>) => {
  switch (action.type) {
    case 'SetLoading':
      return {
        ...state,
        isLoading: true,
      }

    case 'SetData':
      return {
        ...state,
        data: {
          ...(state.data || {}),
          ...(action.payload.data || {}),
        },
        isLoading: false,
      }
  }
}

const APIContext = createContext<APIContextValue<any>>({
  ...initialState,
  update: () => Promise.resolve(),
  setData: () => {},
})

export const withAPI = <P extends APIProviderProps>(Component: ComponentType<P>): ComponentType<P> => {
  return ({ fetchData, showLoadingOnUpdate = false, ...props }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const handleUpdate = useCallback(async (...params) => {
      try {
        dispatch({
          type: 'SetLoading',
        })
        const data = await fetchData(params)
        dispatch({
          type: 'SetData',
          payload: {
            data,
          },
        })
      } catch (e) {
        logger.error(e)
        dispatch({
          type: 'SetData',
          payload: {
            data: null,
          },
        })
      }
    }, [])

    const handleSetData = useCallback(async (data: any) => {
      dispatch({
        type: 'SetData',
        payload: {
          data,
        },
      })
    }, [])

    useEffect(() => {
      handleUpdate()
    }, [])

    return (
      <Page>
        <APIContext.Provider
          value={{
            ...state,
            update: handleUpdate,
            setData: handleSetData,
          }}
        >
          {(showLoadingOnUpdate && state.isLoading) || state.data === undefined ? (
            <LoadingPage />
          ) : (
            <Component {...(props as P)} />
          )}
        </APIContext.Provider>
      </Page>
    )
  }
}

export const useAPI = () => useContext(APIContext)
