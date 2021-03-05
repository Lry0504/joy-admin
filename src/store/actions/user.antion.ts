import { LOCAL_STORAGE } from '@/src/constants';
import { logoutService } from '@/src/services';

// logout
export function logout() {
  logoutService().finally( () => {
    const localStorageWhiteList = [LOCAL_STORAGE.LOGIN_NAME];
    const localStorageLength = window.localStorage.length;
    const allLocalStorageKey: string[] = [];

    for (let index = 0; index < localStorageLength; index++) {
      const key = window.localStorage.key(index) as string;
      allLocalStorageKey.push(key);
    }

    allLocalStorageKey.forEach(keyname => {
      if (localStorageWhiteList.indexOf(keyname) === -1) {
        window.localStorage.removeItem(keyname);
      }
    });
    window.sessionStorage.clear();
    window.location.reload(true);
  })
}