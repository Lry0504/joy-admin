interface Window {
  readonly window: Window;
  axiosCancelTokenStore: { cancel: () => void; pathname: string; [propName: string]: any }[];
}

declare let window: Window;

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BASE_URL: String;
    readonly REACT_APP_GITHUB_CLIENT_ID: string;
  }
}