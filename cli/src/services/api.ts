// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import chalk from 'chalk';
import { cfg } from '../utils/config';

function build(): AxiosInstance {
  const inst = axios.create({ baseURL: cfg.serverUrl, timeout: 15_000 });
  inst.interceptors.request.use(c => {
    if (cfg.token) c.headers['X-ZROKUI-TOKEN'] = cfg.token;
    return c;
  });
  inst.interceptors.response.use(r => r, (e: AxiosError<{ error?: string }>) => {
    if (e.response?.status === 401) {
      console.error(chalk.red('\n✗ Not authenticated. Run: zrokui login --token <token>\n'));
      process.exit(1);
    }
    return Promise.reject(new Error(e.response?.data?.error ?? e.message));
  });
  return inst;
}

export const api = build();

export interface ShareResult {
  id: string;
  shareToken: string;
  publicUrl: string | null;
  protocol: 'http' | 'tcp' | 'private';
  localPort: number;
}

export const tunnelApi = {
  createShare: (body: {
    shareMode: 'public' | 'private';
    backendMode: 'proxy' | 'web' | 'drive' | 'tcpTunnel';
    localPort?: number;
    backendProxyEndpoint?: string;
  }) => api.post<{ success: boolean; data: ShareResult }>('/api/tunnels/share', body),

  createReserved: (body: { uniqueName?: string; localPort?: number }) =>
    api.post<{ success: boolean; data: { token: string; frontendEndpoint: string } }>('/api/tunnels/reserved', body),

  deleteShare: (shareToken: string) => api.delete(`/api/tunnels/share/${shareToken}`),

  sessions: () => api.get<{ success: boolean; data: ShareResult[] }>('/api/tunnels/sessions'),
};
