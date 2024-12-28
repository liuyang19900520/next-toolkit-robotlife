import axios from "axios";

// 定义基础 URL
const BASE_URL =
  "https://jimfuyhapj.execute-api.ap-northeast-1.amazonaws.com/Prod";

// 定义投资数据接口
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
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 投资 API 类
export class InvestmentApi {
  // 获取投资列表
  static async getList(
    params?: Partial<Investment>
  ): Promise<ApiResponse<Investment[]>> {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, value.toString());
          }
        });
      }

      // 构建完整的 URL
      const url = `${BASE_URL}/investment${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await axios.get<ApiResponse<Investment[]>>(url);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch investment list:", error);
      throw error;
    }
  }

  // 获取单个投资详情
  static async getById(id: number): Promise<ApiResponse<Investment>> {
    try {
      const response = await axios.get<ApiResponse<Investment>>(
        `${BASE_URL}/investment/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch investment with id ${id}:`, error);
      throw error;
    }
  }

  // 创建新投资
  static async create(
    investment: Omit<Investment, "id">
  ): Promise<ApiResponse<Investment>> {
    try {
      const response = await axios.post<ApiResponse<Investment>>(
        `${BASE_URL}/investment`,
        investment
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create investment:", error);
      throw error;
    }
  }

  // 更新投资
  static async update(
    id: number,
    investment: Partial<Investment>
  ): Promise<ApiResponse<Investment>> {
    try {
      const response = await axios.put<ApiResponse<Investment>>(
        `${BASE_URL}/investment/${id}`,
        investment
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update investment with id ${id}:`, error);
      throw error;
    }
  }

  // 删除投资
  static async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axios.delete<ApiResponse<void>>(
        `${BASE_URL}/investment/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to delete investment with id ${id}:`, error);
      throw error;
    }
  }
}

// 创建请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 这里可以添加认证 token 等
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 创建响应拦截器
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一处理错误
    if (error.response) {
      // 服务器返回错误状态码
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // 请求发送失败
      console.error("Request Error:", error.request);
    } else {
      // 其他错误
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default InvestmentApi;
