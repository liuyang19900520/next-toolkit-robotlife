/**
 * API-related TypeScript types and interfaces
 */

// 投资数据接口
export interface Investment {
  id: number;
  year: string;
  type1: string;
  type2: string;
  target: string;
  price: number;
  currency: string;
}

// API 响应接口
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

