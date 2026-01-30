
export const environment = {
  production: true,
  cookie: {
    domain: 'localhost',
    sameSite: 'Lax',
    expires: 30
  },
  services: {
    // security: 'http://localhost:8443/api/'
    security: 'https://api.aurumsuite.com.co/',
    socketUrl: 'wss://api.aurumsuite.com.co/'
  }
};
