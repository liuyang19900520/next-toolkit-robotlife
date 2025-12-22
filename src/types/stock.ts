/**
 * Stock-related TypeScript types and interfaces
 */

// 股票详细数据
export interface StockData {
  symbol: string;
  company_name: string;
  current_price: number;
  change: number;
  change_percent: number;
  exchange: string;
  financial_metrics: {
    pe_ratio: number;
    pb_ratio: number;
    dividend_yield: number;
    market_cap: string;
    roe: number;
    debt_to_equity: number;
    year_high: number;
    year_low: number;
  };
  price_data: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  company_info: {
    industry: string;
    sector: string;
    country: string;
    website: string;
    ceo: string;
    employees: number;
    description: string;
  };
}

// 股票分析数据
export interface AnalysisData {
  total_score: number;
  decision: string;
  scores: {
    Quality: number;
    Value: number;
    Dividend: number;
    Trend: number;
    Risk: number;
  };
}

// 股票列表项
export interface StockListItem {
  id: string;
  symbol: string;
  company_name: string;
  current_price: number;
  change: number;
  change_percent: number;
  exchange: string;
  market_cap: string;
  volume: string;
  pe_ratio: number;
  sector: string;
  industry: string;
  rating: string;
  score: number;
}

// 股票评分数据（来自 API，结构灵活）
export interface StockScoreData {
  [key: string]: unknown;
}

// 股票详细数据（来自 API，结构灵活）
export interface StockDetailData {
  [key: string]: unknown;
}

