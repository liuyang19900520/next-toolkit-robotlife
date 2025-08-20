// 示例股票数据
export const sampleStockData = {
  symbol: "DIS",
  company_name: "The Walt Disney Company",
  current_price: 85.42,
  change: -2.18,
  change_percent: -2.49,
  exchange: "NYSE",
  financial_metrics: {
    pe_ratio: 18.5,
    pb_ratio: 1.8,
    dividend_yield: 0.5,
    market_cap: "$156.2B",
    roe: 8.2,
    debt_to_equity: 0.45,
    year_high: 118.18,
    year_low: 78.73,
  },
  price_data: [
    {
      date: "2024-01-01",
      open: 87.5,
      high: 88.2,
      low: 86.8,
      close: 87.6,
      volume: 12500000,
    },
    {
      date: "2024-01-02",
      open: 87.6,
      high: 89.1,
      low: 87.2,
      close: 88.9,
      volume: 13800000,
    },
    {
      date: "2024-01-03",
      open: 88.9,
      high: 89.5,
      low: 87.8,
      close: 88.2,
      volume: 14200000,
    },
    {
      date: "2024-01-04",
      open: 88.2,
      high: 88.8,
      low: 86.5,
      close: 87.1,
      volume: 15600000,
    },
    {
      date: "2024-01-05",
      open: 87.1,
      high: 87.8,
      low: 85.2,
      close: 85.42,
      volume: 16800000,
    },
  ],
  company_info: {
    industry: "Entertainment",
    sector: "Communication Services",
    country: "United States",
    website: "https://www.disney.com",
    ceo: "Robert A. Iger",
    employees: 223000,
    description:
      "The Walt Disney Company is a diversified international family entertainment and media enterprise. It operates through five segments: Media Networks, Parks, Experiences and Products, Studio Entertainment, Direct-to-Consumer & International, and Disney+.",
  },
};

// 示例分析数据
export const sampleAnalysisData = {
  total_score: 21.05,
  decision: "Avoid",
  scores: {
    Quality: 65,
    Value: 45,
    Dividend: 25,
    Trend: 35,
    Risk: 55,
  },
};
