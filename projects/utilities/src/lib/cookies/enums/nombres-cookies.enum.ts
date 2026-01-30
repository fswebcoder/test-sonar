export enum COOKIES_NAMES {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refreshToken',
  UUID = 'uuid',
  EXPIRED_TOKEN = 'expiredToken',
  USER_NAME = 'userName',
  FINGER_PRINT = 'fingerprint',
  XCODE_REQUESTER = 'X-Code-Requester',
  CURRENT_APP = 'X-current-app',
}

export const COOKIE_NAMES_PARAMETERS = {
  NAME: (param: string) => `${param}`,
};
