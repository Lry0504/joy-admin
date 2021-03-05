import http from '@/src/utils/http';
import API from '@/src/api/index.api';

// lougout
export function logoutService() {
  return http.get(API.logout);
}