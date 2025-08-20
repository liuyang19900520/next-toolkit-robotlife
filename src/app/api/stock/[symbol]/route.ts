import { NextRequest, NextResponse } from "next/server";

// 模拟股票数据 - 在实际应用中，这里会调用真实的股票API
const mockStockData: { [key: string]: any } = {
  NVDA: {
    company_name: "NVIDIA Corporation",
    current_price: 485.09,
    change: 12.45,
    change_percent: 2.64,
    exchange: "NASDAQ",
    market_cap: "$1.2T",
    volume: "45.8M",
    pe_ratio: 75.2,
    sector: "Technology",
    industry: "Semiconductors",
    rating: "Buy",
    score: 85.5,
  },
  AMZN: {
    company_name: "Amazon.com, Inc.",
    current_price: 145.24,
    change: -2.18,
    change_percent: -1.48,
    exchange: "NASDAQ",
    market_cap: "$1.5T",
    volume: "38.2M",
    pe_ratio: 45.8,
    sector: "Consumer Discretionary",
    industry: "Internet Retail",
    rating: "Buy",
    score: 78.3,
  },
  META: {
    company_name: "Meta Platforms, Inc.",
    current_price: 334.92,
    change: 8.45,
    change_percent: 2.59,
    exchange: "NASDAQ",
    market_cap: "$850.2B",
    volume: "22.1M",
    pe_ratio: 28.5,
    sector: "Technology",
    industry: "Internet Content",
    rating: "Buy",
    score: 82.1,
  },
  NFLX: {
    company_name: "Netflix, Inc.",
    current_price: 485.09,
    change: -15.67,
    change_percent: -3.13,
    exchange: "NASDAQ",
    market_cap: "$214.5B",
    volume: "8.9M",
    pe_ratio: 32.8,
    sector: "Communication Services",
    industry: "Entertainment",
    rating: "Hold",
    score: 65.4,
  },
  TSLA: {
    company_name: "Tesla, Inc.",
    current_price: 248.5,
    change: -8.75,
    change_percent: -3.4,
    exchange: "NASDAQ",
    market_cap: "$789.5B",
    volume: "89.3M",
    pe_ratio: 45.2,
    sector: "Consumer Discretionary",
    industry: "Automobiles",
    rating: "Hold",
    score: 45.8,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const symbolUpper = symbol.toUpperCase();

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 检查是否有模拟数据
    if (mockStockData[symbolUpper]) {
      return NextResponse.json(mockStockData[symbolUpper]);
    }

    // 如果没有模拟数据，返回一个通用的响应
    // 在实际应用中，这里会调用真实的股票API
    const genericStockData = {
      company_name: `${symbolUpper} Company`,
      current_price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 20,
      change_percent: (Math.random() - 0.5) * 10,
      exchange: "NASDAQ",
      market_cap: `$${(Math.random() * 100 + 10).toFixed(1)}B`,
      volume: `${(Math.random() * 50 + 5).toFixed(1)}M`,
      pe_ratio: Math.random() * 50 + 10,
      sector: "Technology",
      industry: "Software",
      rating: ["Buy", "Hold", "Avoid"][Math.floor(Math.random() * 3)],
      score: Math.random() * 100,
    };

    return NextResponse.json(genericStockData);
  } catch (error) {
    console.error("获取股票数据失败:", error);
    return NextResponse.json({ error: "获取股票数据失败" }, { status: 500 });
  }
}
