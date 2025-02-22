/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, Statistic, Row, Col } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ExchangeRateProps {
    onRateUpdate?: (rates: any) => void;
}

export default function ExchangeRate({ onRateUpdate }: ExchangeRateProps) {
    const [rates, setRates] = useState({
        USDJPY: 0,
        USDCNY: 0,
        JPYUSD: 0,
        JPYCNY: 0
    });

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const usdResponse = await axios.get(
                    'https://open.er-api.com/v6/latest/USD'
                );
                const jpyResponse = await axios.get(
                    'https://open.er-api.com/v6/latest/JPY'
                );

                const newRates = {
                    USDJPY: usdResponse.data.rates.JPY,
                    USDCNY: usdResponse.data.rates.CNY,
                    JPYUSD: jpyResponse.data.rates.USD,
                    JPYCNY: jpyResponse.data.rates.CNY
                };

                setRates(newRates);
                // 调用回调函数更新父组件的汇率
                if (onRateUpdate) {
                    onRateUpdate(newRates);
                }
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
            }
        };

        fetchRates();
        const interval = setInterval(fetchRates, 3600000);
        return () => clearInterval(interval);
    }, [onRateUpdate]);

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="USD/JPY"
                        value={rates.USDJPY}
                        precision={2}
                        prefix={<GlobalOutlined />}
                        suffix="JPY"
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="USD/CNY"
                        value={rates.USDCNY}
                        precision={2}
                        prefix={<GlobalOutlined />}
                        suffix="CNY"
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="JPY/USD"
                        value={rates.JPYUSD}
                        precision={4}
                        prefix={<GlobalOutlined />}
                        suffix="USD"
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card variant="borderless">
                    <Statistic
                        title="JPY/CNY"
                        value={rates.JPYCNY}
                        precision={4}
                        prefix={<GlobalOutlined />}
                        suffix="CNY"
                    />
                </Card>
            </Col>
        </Row>
    );
} 