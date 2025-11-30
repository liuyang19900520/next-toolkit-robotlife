/**
 * API 配置
 * 根据环境变量选择不同的 API 基础 URL
 */

// 获取环境变量，默认为 'local'
const env = process.env.NEXT_PUBLIC_ENV || 'local';

// 投资 API 配置
export const getInvestmentApiBaseUrl = (): string => {
  if (env === 'local') {
    // 本地环境：使用本地 API 服务
    return process.env.INVESTMENT_API_BASE_URL || 'http://localhost:3000';
  } else {
    // 生产环境：使用 AWS API Gateway
    return process.env.AWS_API_GATEWAY_URL || 
           process.env.INVESTMENT_API_BASE_URL || 
           'https://w918daarz0.execute-api.ap-northeast-1.amazonaws.com/Prod';
  }
};

// 获取当前环境
export const getEnv = (): string => {
  return env;
};

// 检查是否为本地环境
export const isLocalEnv = (): boolean => {
  return env === 'local';
};

// 检查是否为生产环境
export const isProdEnv = (): boolean => {
  return env === 'prod';
};

