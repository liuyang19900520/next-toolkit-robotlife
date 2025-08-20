'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Typography, Alert, Spin, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function TestApiPage() {
    const [ticker, setTicker] = useState('DIS');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const testApi = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`/api/test-stock?ticker=${ticker.toUpperCase()}`);
            const data = await response.json();

            if (data.success) {
                setResult(data);
            } else {
                setError(data.error || 'API测试失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '网络错误');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card>
                <Title level={2}>股票API测试</Title>
                <Text type="secondary">测试与本地API服务器的连接</Text>

                <div style={{ marginTop: '24px' }}>
                    <Space>
                        <Input
                            placeholder="输入股票代码 (如: DIS)"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            style={{ width: '200px' }}
                            onPressEnter={testApi}
                        />
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={testApi}
                            loading={loading}
                        >
                            测试API
                        </Button>
                    </Space>
                </div>

                {loading && (
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: '16px' }}>正在测试API连接...</div>
                    </div>
                )}

                {error && (
                    <Alert
                        message="API测试失败"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginTop: '24px' }}
                    />
                )}

                {result && (
                    <div style={{ marginTop: '24px' }}>
                        <Alert
                            message="API测试成功"
                            description={`成功获取股票 ${result.ticker} 的数据`}
                            type="success"
                            showIcon
                            style={{ marginBottom: '16px' }}
                        />

                        <Card title="API返回数据" size="small">
                            <pre style={{
                                backgroundColor: '#f5f5f5',
                                padding: '16px',
                                borderRadius: '4px',
                                overflow: 'auto',
                                maxHeight: '400px'
                            }}>
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </Card>
                    </div>
                )}

                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
                    <Text strong>API端点信息:</Text>
                    <br />
                    <Text code>http://localhost:8000/score?ticker=DIS</Text> (评分数据)
                    <br />
                    <Text code>http://localhost:8000/data?ticker=DIS</Text> (详细数据)
                </div>
            </Card>
        </div>
    );
}
