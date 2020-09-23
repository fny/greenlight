import { Location, GreenlightStatus, User } from "./common/models";

declare module 'reactn/default' {
    export interface Reducers {
      append: (
        global: State,
        dispatch: Dispatch,
        ...strings: any[]
      ) => Pick<State, 'value'>;

      increment: (
        global: State,
        dispatch: Dispatch,
        i: number,
      ) => Pick<State, 'count'>;

      doNothing: (
        global: State,
        dispatch: Dispatch,
      ) => null;
    }

    export interface State {
      isOnline: boolean,
      currentUser: User | null,
      location: Location | null
      users: User[],
      recentStatuses: GreenlightStatus[]
    }
  }
