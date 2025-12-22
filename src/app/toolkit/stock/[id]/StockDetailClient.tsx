'use client';

import React from 'react';
import { Card, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import CompleteStockDashboard from '@/components/dashboard/CompleteStockDashboard';
import type { StockScoreData, StockDetailData } from '@/types';

const { Title, Text } = Typography;

interface StockDetailClientProps {
  stockId: string;
  stockData: StockDetailData;
  analysisData: StockScoreData;
}

export default function StockDetailClient({
  stockId,
  stockData,
  analysisData,
}: StockDetailClientProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div style={{ padding: isMobile ? '12px' : '24px' }}>
      <Card variant="borderless" style={{ marginBottom: '16px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/toolkit')}
          style={{ marginBottom: '16px' }}
        >
          返回股票列表
        </Button>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
          {(stockData && typeof stockData === 'object' && 'company_name' in stockData
            ? (stockData as { company_name?: string; symbol?: string }).company_name
            : null) ||
            (stockData && typeof stockData === 'object' && 'symbol' in stockData
              ? (stockData as { symbol?: string }).symbol
              : null) ||
            stockId}{' '}
          ({stockId})
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>
          详细股票分析和投资建议 (实时数据)
        </Text>
      </Card>
      <CompleteStockDashboard stockData={stockData} analysisData={analysisData} />
    </div>
  );
}

