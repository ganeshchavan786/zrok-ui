// src/utils/config.ts
import Conf from 'conf';

interface ZrokUIConfig {
  token: string;
  email: string;
  serverUrl: string;
}

const store = new Conf<ZrokUIConfig>({
  projectName: 'zrokui',
  defaults: {
    token: '',
    email: '',
    serverUrl: 'https://api.yourdomain.com',
  },
});

export const cfg = {
  get token()     { return store.get('token'); },
  get email()     { return store.get('email'); },
  get serverUrl() { return store.get('serverUrl'); },
  get isLoggedIn(){ return !!store.get('token'); },
  get path()      { return store.path; },
  set(key: keyof ZrokUIConfig, val: string) { store.set(key, val); },
  clear() { store.clear(); },
};
