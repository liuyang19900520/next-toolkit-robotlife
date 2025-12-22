import axios from "axios";
import { getStockApiBaseUrl } from "@/config/api";
import type { StockScoreData, StockDetailData } from "@/types";

// Re-export types for backward compatibility
export type { StockScoreData, StockDetailData };

export class StockApi {
  // 获取股票评分数据 (1.json)
  static async getStockScore(ticker: string): Promise<StockScoreData> {
    try {
      const baseUrl = getStockApiBaseUrl();
      const response = await axios.get(`${baseUrl}/score`, {
        params: { ticker: ticker.toUpperCase() },
      });
      return response.data;
    } catch (error) {
      console.error(`获取股票评分数据失败 (${ticker}):`, error);
      throw new Error(`获取股票评分数据失败: ${ticker}`);
    }
  }

  // 获取股票详细数据 (2.json)
  static async getStockData(ticker: string): Promise<StockDetailData> {
    try {
      const baseUrl = getStockApiBaseUrl();
      const response = await axios.get(`${baseUrl}/data`, {
        params: { ticker: ticker.toUpperCase() },
      });
      return response.data;
    } catch (error) {
      console.error(`获取股票详细数据失败 (${ticker}):`, error);
      throw new Error(`获取股票详细数据失败: ${ticker}`);
    }
  }

  // 同时获取两种数据
  static async getStockAllData(ticker: string): Promise<{
    scoreData: StockScoreData;
    detailData: StockDetailData;
  }> {
    try {
      const [scoreResponse, detailResponse] = await Promise.all([
        this.getStockScore(ticker),
        this.getStockData(ticker),
      ]);

      return {
        scoreData: scoreResponse,
        detailData: detailResponse,
      };
    } catch (error) {
      console.error(`获取股票完整数据失败 (${ticker}):`, error);
      throw new Error(`获取股票完整数据失败: ${ticker}`);
    }
  }
}

export default StockApi;
