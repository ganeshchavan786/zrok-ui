// backend/src/services/zrokApi.ts
import axios, { AxiosError } from 'axios';
import { logger } from '../utils/index';
import { env } from '../config/env';
import { createError } from '../types/errors';

const ZROK_API_URL = env.ZROK_API_URL || 'http://localhost:18080';
const TIMEOUT = 10000; // 10 seconds

// Create axios instance with default config
const zrokClient = axios.create({
  baseURL: ZROK_API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle zrok API errors consistently
 */
function handleZrokError(error: any, operation: string): never {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNREFUSED') {
      logger.error(`zrok controller unreachable during ${operation}`);
      throw createError.serviceUnavailable('zrok controller');
    }
    
    if (error.code === 'ETIMEDOUT') {
      logger.error(`Timeout during ${operation}`);
      throw createError.timeout(operation);
    }
    
    if (error.response) {
      const message = error.response.data?.error || error.message;
      logger.error(`zrok API error during ${operation}:`, { status: error.response.status, message });
      throw createError.zrokError(message, {
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
  
  logger.error(`Unknown error during ${operation}:`, error);
  throw createError.zrokError(`Failed to ${operation}: ${error.message}`);
}

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
    const response = await zrokClient.get('/api/v1/metrics/account', {
      headers: { 'X-TOKEN': token },
    });
    return response.data;
  } catch (error: any) {
    // Return empty metrics on error (graceful degradation)
    logger.warn('Failed to fetch account metrics, returning empty', { error: error.message });
    return { periods: [] };
  }
}

// Get share metrics from zrok controller
export async function zrokShareMetrics(token: string, shareToken: string): Promise<ZrokMetricsResponse> {
  try {
    const response = await zrokClient.get(`/api/v1/metrics/share/${shareToken}`, {
      headers: { 'X-TOKEN': token },
    });
    return response.data;
  } catch (error: any) {
    logger.warn('Failed to fetch share metrics, returning empty', { error: error.message });
    return { periods: [] };
  }
}

// List shares from zrok controller
export async function zrokListShares(token: string) {
  try {
    const response = await zrokClient.get('/api/v1/share', {
      headers: { 'X-TOKEN': token },
    });
    return response.data;
  } catch (error: any) {
    handleZrokError(error, 'list shares');
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
    const response = await zrokClient.post('/api/v1/share', data, {
      headers: { 'X-TOKEN': token },
    });
    return response.data;
  } catch (error: any) {
    handleZrokError(error, 'create share');
  }
}

// Delete share from zrok controller
export async function zrokDeleteShare(token: string, shareToken: string) {
  try {
    const response = await zrokClient.delete(`/api/v1/share/${shareToken}`, {
      headers: { 'X-TOKEN': token },
    });
    return response.data;
  } catch (error: any) {
    handleZrokError(error, 'delete share');
  }
}

// Enable zrok account
export async function zrokEnable(token: string, description?: string) {
  try {
    const response = await zrokClient.post(
      '/api/v1/enable',
      { description: description || 'zrokui account' },
      { headers: { 'X-TOKEN': token } }
    );
    return response.data;
  } catch (error: any) {
    handleZrokError(error, 'enable account');
  }
}

// Disable zrok account
export async function zrokDisable(token: string) {
  try {
    const response = await zrokClient.delete('/api/v1/disable', {
      headers: { 'X-TOKEN': token },
    });
    return response.data;
  } catch (error: any) {
    handleZrokError(error, 'disable account');
  }
}
