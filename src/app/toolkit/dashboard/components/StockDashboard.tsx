'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Statistic,
    Progress,
    Tag,
    Tabs,
    Descriptions,
    Avatar,
    Image,
    Divider
} from 'antd';
import {
    StockOutlined,
    RiseOutlined,
    FallOutlined,
    TrophyOutlined,
    BarChartOutlined,
    ProfileOutlined
} from '@ant-design/icons';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 类型定义
interface StockData {
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

interface AnalysisData {
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

interface StockDashboardProps {
    stockData: StockData;
    analysisData: AnalysisData;
}

export default function StockDashboard({ stockData, analysisData }: StockDashboardProps) {
    const [isMobile, setIsMobile] = useState(false);

    // 检测移动端
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 获取涨跌颜色
    const getChangeColor = (value: number) => {
        return value >= 0 ? '#52c41a' : '#ff4d4f';
    };

    // 获取投资建议颜色
    const getDecisionColor = (decision: string) => {
        switch (decision.toLowerCase()) {
            case 'buy':
                return 'green';
            case 'hold':
                return 'orange';
            case 'avoid':
            case 'sell':
                return 'red';
            default:
                return 'default';
        }
    };

    // 自定义工具提示
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>{`日期: ${label}`}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{
                            margin: 0,
                            color: entry.color
                        }}>
                            {`${entry.name}: ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // 格式化价格数据用于线图
    const priceChartData = stockData.price_data.map(item => ({
        date: item.date,
        close: item.close,
        open: item.open,
        high: item.high,
        low: item.low
    }));

    // 格式化交易量数据
    const volumeChartData = stockData.price_data.map(item => ({
        date: item.date,
        volume: item.volume / 1000000 // 转换为百万
    }));

    return (
        <div style={{ padding: isMobile ? '12px' : '24px' }}>
            {/* 顶部摘要卡片区 */}
            <Card variant="borderless" style={{ marginBottom: '24px' }}>
                <Row gutter={[24, 16]} align="middle">
                    {/* 左侧 - 公司信息 */}
                    <Col xs={24} md={8}>
                        <Row gutter={16} align="middle">
                            <Col>
                                <Avatar
                                    size={isMobile ? 48 : 64}
                                    icon={<StockOutlined />}
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                            </Col>
                            <Col flex="1">
                                <Title level={isMobile ? 4 : 3} style={{ margin: 0, lineHeight: 1.2 }}>
                                    {stockData.company_name}
                                </Title>
                                <Text strong style={{ fontSize: isMobile ? '16px' : '18px', color: '#1890ff' }}>
                                    {stockData.symbol}
                                </Text>
                                <br />
                                <Text type="secondary">{stockData.exchange}</Text>
                            </Col>
                        </Row>
                    </Col>

                    {/* 中间 - 股价信息 */}
                    <Col xs={24} md={8}>
                        <Row gutter={16} justify="center">
                            <Col>
                                <Statistic
                                    title="当前价格"
                                    value={stockData.current_price}
                                    precision={2}
                                    prefix="$"
                                    valueStyle={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold' }}
                                />
                            </Col>
                            <Col>
                                <Statistic
                                    title="日涨跌额"
                                    value={stockData.change}
                                    precision={2}
                                    prefix={stockData.change >= 0 ? '+' : ''}
                                    prefix="$"
                                    valueStyle={{
                                        color: getChangeColor(stockData.change),
                                        fontSize: isMobile ? '16px' : '20px'
                                    }}
                                />
                                <Statistic
                                    title="日涨跌幅"
                                    value={stockData.change_percent}
                                    precision={2}
                                    prefix={stockData.change_percent >= 0 ? '+' : ''}
                                    suffix="%"
                                    valueStyle={{
                                        color: getChangeColor(stockData.change_percent),
                                        fontSize: isMobile ? '14px' : '16px'
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>

                    {/* 右侧 - 投资评级 */}
                    <Col xs={24} md={8}>
                        <Card
                            title="综合评级"
                            size="small"
                            style={{ textAlign: 'center' }}
                        >
                            <Progress
                                type="dashboard"
                                percent={analysisData.total_score}
                                format={(percent) => `${percent?.toFixed(1)}`}
                                strokeColor={{
                                    '0%': '#ff4d4f',
                                    '50%': '#faad14',
                                    '100%': '#52c41a',
                                }}
                                size={isMobile ? 80 : 100}
                            />
                            <div style={{ marginTop: '16px' }}>
                                <Tag
                                    color={getDecisionColor(analysisData.decision)}
                                    size="large"
                                    style={{
                                        fontSize: isMobile ? '14px' : '16px',
                                        padding: '4px 12px'
                                    }}
                                >
                                    {analysisData.decision}
                                </Tag>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* 标签页详情区 */}
            <Card variant="borderless">
                <Tabs defaultActiveKey="summary" size={isMobile ? 'small' : 'middle'}>
                    {/* 摘要标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <BarChartOutlined />
                                摘要
                            </span>
                        }
                        key="summary"
                    >
                        <Row gutter={[24, 16]}>
                            {/* 左栏 - 关键指标 */}
                            <Col xs={24} lg={12}>
                                <Card title="关键财务指标" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="市盈率 (P/E Ratio)">
                                            {stockData.financial_metrics.pe_ratio.toFixed(2)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="市净率 (P/B Ratio)">
                                            {stockData.financial_metrics.pb_ratio.toFixed(2)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="股息率 (Dividend Yield)">
                                            {stockData.financial_metrics.dividend_yield.toFixed(2)}%
                                        </Descriptions.Item>
                                        <Descriptions.Item label="市值 (Market Cap)">
                                            {stockData.financial_metrics.market_cap}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="净资产收益率 (ROE)">
                                            {stockData.financial_metrics.roe.toFixed(2)}%
                                        </Descriptions.Item>
                                        <Descriptions.Item label="债务权益比 (Debt to Equity)">
                                            {stockData.financial_metrics.debt_to_equity.toFixed(2)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="52周最高价">
                                            ${stockData.financial_metrics.year_high.toFixed(2)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="52周最低价">
                                            ${stockData.financial_metrics.year_low.toFixed(2)}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            {/* 右栏 - 分项得分 */}
                            <Col xs={24} lg={12}>
                                <Card title="模型评分细则" size="small">
                                    <Row gutter={[16, 16]}>
                                        {Object.entries(analysisData.scores).map(([key, value]) => (
                                            <Col xs={12} sm={8} key={key}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <Progress
                                                        type="circle"
                                                        percent={value}
                                                        size={isMobile ? 60 : 80}
                                                        format={(percent) => `${percent?.toFixed(0)}`}
                                                        strokeColor={{
                                                            '0%': '#ff4d4f',
                                                            '50%': '#faad14',
                                                            '100%': '#52c41a',
                                                        }}
                                                    />
                                                    <div style={{ marginTop: '8px' }}>
                                                        <Text strong>{key}</Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    {/* 价格图表标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <RiseOutlined />
                                价格图表
                            </span>
                        }
                        key="chart"
                    >
                        <Card title="价格走势图" size="small" style={{ marginBottom: '16px' }}>
                            <div style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={priceChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            fontSize={isMobile ? 10 : 12}
                                        />
                                        <YAxis
                                            fontSize={isMobile ? 10 : 12}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="close"
                                            stroke="#1890ff"
                                            strokeWidth={2}
                                            name="收盘价"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="open"
                                            stroke="#52c41a"
                                            strokeWidth={1}
                                            name="开盘价"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="high"
                                            stroke="#faad14"
                                            strokeWidth={1}
                                            name="最高价"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="low"
                                            stroke="#ff4d4f"
                                            strokeWidth={1}
                                            name="最低价"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                        <Card title="交易量" size="small">
                            <div style={{ height: '200px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={volumeChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            fontSize={isMobile ? 10 : 12}
                                        />
                                        <YAxis
                                            fontSize={isMobile ? 10 : 12}
                                            tickFormatter={(value) => `${value}M`}
                                        />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            formatter={(value: any) => [`${value}M`, '交易量']}
                                        />
                                        <Bar
                                            dataKey="volume"
                                            fill="#1890ff"
                                            name="交易量"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </TabPane>

                    {/* 公司资料标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <ProfileOutlined />
                                公司资料
                            </span>
                        }
                        key="profile"
                    >
                        <Card title="公司简介" size="small" style={{ marginBottom: '16px' }}>
                            <Paragraph style={{ fontSize: isMobile ? '14px' : '16px', lineHeight: 1.6 }}>
                                {stockData.company_info.description}
                            </Paragraph>
                        </Card>

                        <Card title="公司信息" size="small">
                            <Descriptions column={isMobile ? 1 : 2} size="small">
                                <Descriptions.Item label="行业">
                                    {stockData.company_info.industry}
                                </Descriptions.Item>
                                <Descriptions.Item label="板块">
                                    {stockData.company_info.sector}
                                </Descriptions.Item>
                                <Descriptions.Item label="国家">
                                    {stockData.company_info.country}
                                </Descriptions.Item>
                                <Descriptions.Item label="公司官网">
                                    <a href={stockData.company_info.website} target="_blank" rel="noopener noreferrer">
                                        {stockData.company_info.website}
                                    </a>
                                </Descriptions.Item>
                                <Descriptions.Item label="首席执行官">
                                    {stockData.company_info.ceo}
                                </Descriptions.Item>
                                <Descriptions.Item label="员工人数">
                                    {stockData.company_info.employees.toLocaleString()}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}
