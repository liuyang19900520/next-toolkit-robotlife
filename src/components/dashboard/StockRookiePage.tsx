'use client';

import { Card, Typography } from 'antd';
import { useIsMobile } from '@/hooks/useIsMobile';
import StockList from './StockList';

const { Title, Paragraph } = Typography;

export default function StockRookiePage() {
    const isMobile = useIsMobile();

    return (
        <div>
            {/* 页面标题 */}
            <Card variant="borderless" style={{ marginBottom: '24px' }}>
                <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
                    Stock Rookie
                </Title>
                <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                    股票新手学习平台 - 多只股票分析
                </Paragraph>
            </Card>

            {/* 股票列表 */}
            <StockList />
        </div>
    );
}
