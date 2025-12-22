'use client';

import type { StockDetailData, StockScoreData } from "@/types";

interface CompleteStockDashboardProps {
    stockData: StockDetailData;
    analysisData: StockScoreData;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-anonymous-default-export
export default (_props: CompleteStockDashboardProps) => {
    // 暂时为空页面，功能待开发
    return null;
}
