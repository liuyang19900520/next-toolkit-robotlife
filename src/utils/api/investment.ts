import axios from "axios";

// 使用本地 API 路由，避免 CORS 问题
// 本地 API 路由会代理请求到 AWS API Gateway
const BASE_URL = "/api/investment";

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

      // 构建完整的 URL（BASE_URL 已经是 /api/investment，不需要再加 /investment）
      const url = `${BASE_URL}${
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
        `${BASE_URL}/${id}`
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
      // 确保 URL 正确，不重复路径
      const url = BASE_URL; // BASE_URL 已经是 "/api/investment"
      console.log("InvestmentApi.create - Request URL:", url);
      const response = await axios.post<ApiResponse<Investment>>(
        url,
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
      // 确保不包含 id 字段（id 是主键，不能更新）
      const { id: _, ...updateData } = investment;
      const url = `${BASE_URL}/${id}`;
      console.log("InvestmentApi.update - Request URL:", url, "Data:", updateData);
      const response = await axios.put<ApiResponse<Investment>>(
        url,
        updateData
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
        `${BASE_URL}/${id}`
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
    // 统一处理错误，提供更详细的错误信息
    if (error.response) {
      // 服务器返回错误状态码
      const errorData = error.response.data;
      const errorMessage = errorData?.message || errorData?.error || "API 请求失败";
      console.error("API Error:", {
        status: error.response.status,
        message: errorMessage,
        data: errorData,
      });
      // 创建更友好的错误对象
      const friendlyError = new Error(errorMessage);
      (friendlyError as any).status = error.response.status;
      (friendlyError as any).response = error.response;
      return Promise.reject(friendlyError);
    } else if (error.request) {
      // 请求发送失败（可能是网络问题或 CORS）
      console.error("Request Error:", {
        message: "网络请求失败，请检查网络连接",
        request: error.request,
      });
      const networkError = new Error("网络请求失败，请检查网络连接或稍后重试");
      return Promise.reject(networkError);
    } else {
      // 其他错误
      console.error("Error:", error.message);
      return Promise.reject(error);
    }
  }
);

export default InvestmentApi;
