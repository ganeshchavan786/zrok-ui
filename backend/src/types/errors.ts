// backend/src/types/errors.ts

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error codes for consistent error handling
 */
export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  
  // User errors
  USER_EXISTS = 'USER_EXISTS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  
  // Token errors
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  TOKEN_CREATION_FAILED = 'TOKEN_CREATION_FAILED',
  
  // zrok errors
  ZROK_CONTROLLER_UNREACHABLE = 'ZROK_CONTROLLER_UNREACHABLE',
  ZROK_API_ERROR = 'ZROK_API_ERROR',
  ZROK_INVALID_RESPONSE = 'ZROK_INVALID_RESPONSE',
  
  // Share/Tunnel errors
  SHARE_NOT_FOUND = 'SHARE_NOT_FOUND',
  SHARE_CREATION_FAILED = 'SHARE_CREATION_FAILED',
  SHARE_DELETION_FAILED = 'SHARE_DELETION_FAILED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

/**
 * Helper functions to create common errors
 */
export const createError = {
  unauthorized: (message = 'Unauthorized') => 
    new AppError(401, message, ErrorCode.UNAUTHORIZED),
  
  notFound: (resource: string) => 
    new AppError(404, `${resource} not found`, ErrorCode.USER_NOT_FOUND),
  
  badRequest: (message: string, details?: any) => 
    new AppError(400, message, ErrorCode.INVALID_INPUT, details),
  
  conflict: (message: string) => 
    new AppError(409, message, ErrorCode.USER_EXISTS),
  
  internal: (message = 'Internal server error') => 
    new AppError(500, message, ErrorCode.INTERNAL_ERROR),
  
  serviceUnavailable: (service: string) => 
    new AppError(503, `${service} is unavailable`, ErrorCode.SERVICE_UNAVAILABLE),
  
  timeout: (operation: string) => 
    new AppError(504, `${operation} timed out`, ErrorCode.TIMEOUT),
  
  zrokError: (message: string, details?: any) => 
    new AppError(502, message, ErrorCode.ZROK_API_ERROR, details),
};
