
export const environment = {
  production: false,
  cookie: {
    domain: 'localhost',
    sameSite: 'Lax',
    expires: 30
  },
  services: {
    security: 'http://localhost:8443/api/',
    socketUrl: 'ws://localhost:8443/'
  }
};
