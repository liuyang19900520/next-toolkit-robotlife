import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import StockApi from '@/utils/api/stock';
import StockDetailClient from './StockDetailClient';

function StockDetailSkeleton() {
  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <div style={{ marginTop: '16px' }}>正在加载股票数据...</div>
    </div>
  );
}

async function StockDetailContent({ stockId }: { stockId: string }) {
  try {
    const { scoreData, detailData } = await StockApi.getStockAllData(stockId);

    // Validate that we received valid data
    if (!scoreData || !detailData) {
      notFound();
    }

    return (
      <StockDetailClient
        stockId={stockId}
        stockData={detailData}
        analysisData={scoreData}
      />
    );
  } catch (error) {
    console.error(`Failed to load stock data for ${stockId}:`, error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: stockId } = await params;

  return {
    title: `${stockId} 股票分析 | RobotLife`,
    description: `查看 ${stockId} 的详细股票分析和投资建议`,
  };
}

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: stockId } = await params;

  if (!stockId) {
    notFound();
  }

  return (
    <Suspense fallback={<StockDetailSkeleton />}>
      <StockDetailContent stockId={stockId} />
    </Suspense>
  );
}
