const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

export const BaseConfig = {
  isProd,
  isDev,
  baseUrl: '/', // router basename
  title: 'jot-admin', // website title
  http: {
    baseUrl: '/'
  }
}

export default BaseConfig;