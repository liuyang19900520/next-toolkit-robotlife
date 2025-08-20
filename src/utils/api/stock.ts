import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export interface StockScoreData {
  // 对应1.json的数据结构
  [key: string]: any;
}

export interface StockDetailData {
  // 对应2.json的数据结构
  [key: string]: any;
}

export class StockApi {
  // 获取股票评分数据 (1.json)
  static async getStockScore(ticker: string): Promise<StockScoreData> {
    try {
      const response = await axios.get(`${BASE_URL}/score`, {
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
      const response = await axios.get(`${BASE_URL}/data`, {
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
