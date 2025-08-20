'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Spin, Result, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import CompleteStockDashboard from '../../dashboard/components/CompleteStockDashboard';
import StockApi from '@/utils/api/stock';

const { Title, Text } = Typography;

export default function StockDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [isMobile, setIsMobile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stockData, setStockData] = useState<any>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const stockId = params.id as string;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const loadStockData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 使用真实API获取数据
                const { scoreData, detailData } = await StockApi.getStockAllData(stockId);

                // 将API返回的数据映射到组件期望的格式
                // scoreData 对应 1.json (分析数据)
                // detailData 对应 2.json (股票详细数据)
                setAnalysisData(scoreData);
                setStockData(detailData);

                console.log('API返回的评分数据:', scoreData);
                console.log('API返回的详细数据:', detailData);

            } catch (error) {
                console.error('加载股票数据失败:', error);
                setError(error instanceof Error ? error.message : '加载股票数据失败');
                message.error('加载股票数据失败，请检查网络连接或稍后重试');
            } finally {
                setLoading(false);
            }
        };

        if (stockId) {
            loadStockData();
        }
    }, [stockId]);

    if (loading) {
        return (
            <div style={{ padding: isMobile ? '12px' : '24px', textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>正在从API加载股票数据...</div>
            </div>
        );
    }

    if (error || !stockData || !analysisData) {
        return (
            <div style={{ padding: isMobile ? '12px' : '24px' }}>
                <Result
                    status="error"
                    title="数据加载失败"
                    subTitle={error || `抱歉，股票代码 ${stockId} 的数据获取失败。`}
                    extra={
                        <Button type="primary" onClick={() => router.push('/toolkit')}>
                            返回股票列表
                        </Button>
                    }
                />
            </div>
        );
    }

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
                    {stockData.company_name || stockData.symbol} ({stockId})
                </Title>
                <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>
                    详细股票分析和投资建议 (实时数据)
                </Text>
            </Card>
            <CompleteStockDashboard
                stockData={stockData}
                analysisData={analysisData}
            />
        </div>
    );
}
