import { State, Dispatch } from "reactn/default";
import { addReducer, setGlobal, useDispatch, useGlobal } from 'reactn';
import { Location, User } from "../models";

import { store } from './sources'


const reducers = {
  createUser: (global: State, dispatch: Dispatch, user: User) => {
    return store.update(t => t.addRecord(user.serialize()))
  },
  updateUser: (global: State, dispatch: Dispatch, user: User) => {
    return store.update(t => t.updateRecord(user.serialize()))
  },
  deleteUser: (global: State, dispatch: Dispatch, user: User) => {
    return store.update(t => t.removeRecord(user.serialize()))
  },
  getUser: (global: State, dispatch: Dispatch, id: string) => {
    return store.query(q => q.findRecord({ type: 'user', id }))
  },
  getUsersForLocation: (global: State, dispatch: Dispatch, location: Location) => {
    store.query(q =>
      q.findRelatedRecords({ type: "location", id: location.id }, "users")
    );
  }
}

// https://www.bignerdranch.com/blog/react-data-layer-part-8-where-to-go-from-here/
