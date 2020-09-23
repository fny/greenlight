import React, {createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialQueryParams, QueryParams } from "./UsersUIHelpers";


// interface UsersUIContext {
//   ids: string[]
//   setIds?: React.Dispatch<React.SetStateAction<string[]>>,
//   queryParams: QueryParams,
//   setQueryParams?: React.Dispatch<React.SetStateAction<QueryParams>>,
//   setQueryParamsBase?: React.Dispatch<React.SetStateAction<QueryParams>>,
// }


const UsersUIContext = createContext(undefined as any);

export function useUsersUIContext() {
  return useContext(UsersUIContext);
}

export const UsersUIConsumer = UsersUIContext.Consumer;

export function UsersUIProvider({ children }: { children: React.ReactNode }) {
  const [queryParams, setQueryParamsBase] = useState(initialQueryParams);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams
  };

  return (
    <UsersUIContext.Provider value={value}>
      {children}
    </UsersUIContext.Provider>
  );
}
