// backend/src/services/zrokApi.ts
import axios from 'axios';
import { logger } from '../utils/index';

const ZROK_API_URL = process.env.ZROK_API_URL || 'http://localhost:18080';

interface ZrokMetricsResponse {
  periods?: Array<{
    rx: { bytes: number; opCnt: number };
    tx: { bytes: number; opCnt: number };
    timestamp: string;
  }>;
}

// Get account metrics from zrok controller
export async function zrokAccountMetrics(token: string): Promise<ZrokMetricsResponse> {
  try {
    const response = await axios.get(`${ZROK_API_URL}/api/v1/metrics/account`, {
      headers: {
        'X-TOKEN': token,
      },
    });
    return response.data;
  } catch (error: any) {
    logger.error('Failed to fetch account metrics from zrok', { error: error.message });
    // Return empty metrics on error
    return { periods: [] };
  }
}

// Get share metrics from zrok controller
export async function zrokShareMetrics(token: string, shareToken: string): Promise<ZrokMetricsResponse> {
  try {
    const response = await axios.get(`${ZROK_API_URL}/api/v1/metrics/share/${shareToken}`, {
      headers: {
        'X-TOKEN': token,
      },
    });
    return response.data;
  } catch (error: any) {
    logger.error('Failed to fetch share metrics from zrok', { error: error.message });
    return { periods: [] };
  }
}

// List shares from zrok controller
export async function zrokListShares(token: string) {
  try {
    const response = await axios.get(`${ZROK_API_URL}/api/v1/share`, {
      headers: {
        'X-TOKEN': token,
      },
    });
    return response.data;
  } catch (error: any) {
    logger.error('Failed to list shares from zrok', { error: error.message });
    throw error;
  }
}

// Create share in zrok controller
export async function zrokCreateShare(token: string, data: {
  shareMode: 'public' | 'private';
  backendMode: 'proxy' | 'web' | 'tcpTunnel' | 'udpTunnel' | 'caddy' | 'drive';
  backendProxyEndpoint?: string;
  frontendSelection?: string[];
  authScheme?: string;
  authUsers?: Array<{ username: string; password: string }>;
  oauthProvider?: string;
  oauthEmailDomains?: string[];
  reserved?: boolean;
  uniqueName?: string;
  permissionMode?: string;
}) {
  try {
    const response = await axios.post(`${ZROK_API_URL}/api/v1/share`, data, {
      headers: {
        'X-TOKEN': token,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    logger.error('Failed to create share in zrok', { error: error.message });
    throw error;
  }
}

// Delete share from zrok controller
export async function zrokDeleteShare(token: string, shareToken: string) {
  try {
    const response = await axios.delete(`${ZROK_API_URL}/api/v1/share/${shareToken}`, {
      headers: {
        'X-TOKEN': token,
      },
    });
    return response.data;
  } catch (error: any) {
    logger.error('Failed to delete share from zrok', { error: error.message });
    throw error;
  }
}

// Enable zrok account
export async function zrokEnable(token: string, description?: string) {
  try {
    const response = await axios.post(
      `${ZROK_API_URL}/api/v1/enable`,
      { description: description || 'zrokui account' },
      {
        headers: {
          'X-TOKEN': token,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    logger.error('Failed to enable zrok account', { error: error.message });
    throw error;
  }
}

// Disable zrok account
export async function zrokDisable(token: string) {
  try {
    const response = await axios.delete(`${ZROK_API_URL}/api/v1/disable`, {
      headers: {
        'X-TOKEN': token,
      },
    });
    return response.data;
  } catch (error: any) {
    logger.error('Failed to disable zrok account', { error: error.message });
    throw error;
  }
}
