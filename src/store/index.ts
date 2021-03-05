import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { UserState } from './reducers/user.reducer';
import { createStore, applyMiddleware } from 'redux';

export interface StoreState {
  user: UserState
}

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;