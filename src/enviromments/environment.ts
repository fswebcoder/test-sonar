import { isDevMode } from '@angular/core';

export const environment = {
  production: false,
  cookie: {
    domain: 'localhost',
    sameSite: 'Lax',
    expires: 30
  },
  services: {
    // security: 'http://172.17.18.52:8443/',
    // security: 'http://localhost:4001/',
    security: isDevMode() ? 'https://api-dev.aurumsuite.com.co/' : 'http://localhost:8443/',
    socketUrl: isDevMode() ? 'wss://api-dev.aurumsuite.com.co/' : 'ws://localhost:8443/'
    // security: 'http://172.17.18.55:8443/'
    // security: 'http://172.19.17.152:8443/api/'
  }
};
