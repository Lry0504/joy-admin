import { USER } from '../constants';
import { LOCAL_STORAGE } from '@/src/constants/storage';

const { LOGIN } = USER;

export interface UserInfoProps {
  prodiver: string;
  uid: number | undefined;
  username: string;
  passward: string;
  loginName: string;
  avatarUrl: string;
  email: string;
  role: string;
  token: string | undefined;
  bio: string;
  location: string;
  createdAt: string;
}

export interface UserState {
  isLogin: boolean;
  isLockScreen: boolean;
  userInfo: UserInfoProps
}

const initialState: UserState = {
  isLogin: false,
  isLockScreen: false,
  userInfo: {
    prodiver: '',
    uid: undefined,
    username: '',
    passward: '',
    loginName: '',
    avatarUrl: '',
    email: '',
    role: '',
    token: undefined,
    bio: '',
    location: '',
    createdAt: ''
  }
}

function userReducer(state = initialState, action: any): UserState {
  switch (action.type) {
    case LOGIN:
      const userInfo = action.userInfo;
      if (userInfo?.token) {
        state.isLogin = true;
        window.localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(userInfo));
        window.localStorage.setItem(LOCAL_STORAGE.LOGIN_NAME, userInfo.loginName);
      }
      return {
        ...state,
        userInfo: action.userInfo
      }
    default:
      return state;
  }
}

export default userReducer;