import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import systemReducer from './system.reducer';

export default combineReducers({
  userReducer,
  systemReducer
})