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

interface APIState {
  data: any
  isLoading: boolean
}

const initialState: APIState = {
  data: undefined,
  isLoading: false,
}

interface APIContextValue extends APIState {
  update: (...params: any[]) => Promise<any>
  setData: (data: any) => any
}

type SetLoadingAction = {
  type: 'SetLoading'
}

type SetDataAction = {
  type: 'SetData'
  payload: {
    data: any
  }
}

type Action = SetLoadingAction | SetDataAction

const reducer = (state: APIState, action: Action) => {
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

const APIContext = createContext<APIContextValue>({
  ...initialState,
  update: () => Promise.resolve(),
  setData: () => {},
})

export const withAPI = <P extends APIProviderProps>(Component: ComponentType<P>): ComponentType<P> => {
  return ({ fetchData, showLoadingOnUpdate = false, initialCall = false, ...props }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    console.log('rendering', state)
    const handleUpdate = useCallback(async (...params) => {
      console.log('handle update')
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
      if (initialCall) {
        handleUpdate()
      }
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
