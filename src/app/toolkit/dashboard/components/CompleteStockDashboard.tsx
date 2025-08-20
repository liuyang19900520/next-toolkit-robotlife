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
    Table,
    List,
    Space
} from 'antd';
import {
    StockOutlined,
    BarChartOutlined,
    ProfileOutlined,
    LineChartOutlined,
    SafetyOutlined,
    DollarOutlined,
    ArrowUpOutlined,
    WarningOutlined,
    CheckCircleOutlined
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

interface CompleteStockDashboardProps {
    stockData: any;
    analysisData: any;
}

export default function CompleteStockDashboard({ stockData, analysisData }: CompleteStockDashboardProps) {
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

    // 获取风险等级颜色
    const getRiskColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'low':
                return 'green';
            case 'medium':
                return 'orange';
            case 'high':
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
    const priceChartData = (stockData.price_data || []).map((item: any) => ({
        date: item.date,
        close: item.close,
        open: item.open,
        high: item.high,
        low: item.low
    }));

    // 格式化交易量数据
    const volumeChartData = (stockData.price_data || []).map((item: any) => ({
        date: item.date,
        volume: item.volume / 1000000 // 转换为百万
    }));

    // 评分数据用于饼图
    const scoreChartData = Object.entries(analysisData.scores || {}).map(([key, value]: [string, any]) => ({
        name: key,
        value: value?.score || 0,
        weight: value?.weight || 1
    }));

    // 财务指标表格列
    const financialColumns = [
        {
            title: '指标',
            dataIndex: 'metric',
            key: 'metric',
            width: isMobile ? 120 : 150,
        },
        {
            title: '数值',
            dataIndex: 'value',
            key: 'value',
            width: isMobile ? 80 : 100,
        },
        {
            title: '行业平均',
            dataIndex: 'industry',
            key: 'industry',
            width: isMobile ? 100 : 120,
        }
    ];

    // 财务指标数据 - 全部来自API
    const financialData = [
        {
            metric: '市盈率 (P/E)',
            value: stockData.financial_metrics?.pe_ratio ? stockData.financial_metrics.pe_ratio.toFixed(2) : 'N/A',
            industry: analysisData.details?.thresholds?.pe_max || 'N/A'
        },
        {
            metric: '市净率 (P/B)',
            value: stockData.financial_metrics?.pb_ratio ? stockData.financial_metrics.pb_ratio.toFixed(2) : 'N/A',
            industry: analysisData.details?.thresholds?.pb_bonus || 'N/A'
        },
        {
            metric: '股息率 (%)',
            value: stockData.financial_metrics?.dividend_yield ? (stockData.financial_metrics.dividend_yield * 100).toFixed(2) : 'N/A',
            industry: analysisData.details?.thresholds?.yield_min || 'N/A'
        },
        {
            metric: 'ROE (%)',
            value: stockData.financial_metrics?.roe ? (stockData.financial_metrics.roe * 100).toFixed(2) : 'N/A',
            industry: analysisData.details?.thresholds?.roe_min || 'N/A'
        },
        {
            metric: '债务权益比',
            value: stockData.financial_metrics?.debt_to_equity ? stockData.financial_metrics.debt_to_equity.toFixed(2) : 'N/A',
            industry: 'N/A'
        },
        {
            metric: '流动比率',
            value: stockData.financial_metrics?.current_ratio ? stockData.financial_metrics.current_ratio.toFixed(2) : 'N/A',
            industry: 'N/A'
        },
        {
            metric: '毛利率 (%)',
            value: stockData.financial_metrics?.gross_profit_margin ? (stockData.financial_metrics.gross_profit_margin * 100).toFixed(2) : 'N/A',
            industry: 'N/A'
        },
        {
            metric: '净利率 (%)',
            value: stockData.financial_metrics?.net_profit_margin ? (stockData.financial_metrics.net_profit_margin * 100).toFixed(2) : 'N/A',
            industry: 'N/A'
        }
    ];

    // 技术指标表格列
    const technicalColumns = [
        {
            title: '指标',
            dataIndex: 'indicator',
            key: 'indicator',
            width: isMobile ? 120 : 150,
        },
        {
            title: '数值',
            dataIndex: 'value',
            key: 'value',
            width: isMobile ? 80 : 100,
        },
        {
            title: '信号',
            dataIndex: 'signal',
            key: 'signal',
            width: isMobile ? 80 : 100,
            render: (signal: string) => (
                <Tag color={signal === 'Bullish' ? 'green' : signal === 'Bearish' ? 'red' : 'orange'}>
                    {signal}
                </Tag>
            )
        }
    ];

    // 技术指标数据
    const technicalData = [
        { indicator: 'RSI', value: stockData.technical_indicators?.rsi || 'N/A', signal: 'Neutral' },
        { indicator: 'MACD', value: stockData.technical_indicators?.macd || 'N/A', signal: 'Neutral' },
        { indicator: 'SMA 20', value: stockData.technical_indicators?.sma_20 || 'N/A', signal: 'Neutral' },
        { indicator: 'SMA 50', value: stockData.technical_indicators?.sma_50 || 'N/A', signal: 'Neutral' },
        { indicator: '布林带上轨', value: stockData.technical_indicators?.bollinger_upper || 'N/A', signal: 'Resistance' },
        { indicator: '布林带下轨', value: stockData.technical_indicators?.bollinger_lower || 'N/A', signal: 'Support' }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
                                    {stockData.company_info?.company_name || stockData.company_name || stockData.symbol || 'Unknown'}
                                </Title>
                                <Text strong style={{ fontSize: isMobile ? '16px' : '18px', color: '#1890ff' }}>
                                    {stockData.company_info?.symbol || stockData.symbol || 'Unknown'}
                                </Text>
                                <br />
                                <Text type="secondary">{stockData.company_info?.exchange || stockData.exchange || 'Unknown'}</Text>
                            </Col>
                        </Row>
                    </Col>

                    {/* 中间 - 股价信息 */}
                    <Col xs={24} md={8}>
                        <Row gutter={16} justify="center">
                            <Col>
                                <Statistic
                                    title="当前价格"
                                    value={stockData.financial_metrics?.current_price || stockData.current_price || 0}
                                    precision={2}
                                    prefix="$"
                                    valueStyle={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold' }}
                                />
                            </Col>
                            <Col>
                                <Statistic
                                    title="日涨跌额"
                                    value={stockData.financial_metrics?.change || stockData.change || 0}
                                    precision={2}
                                    prefix={(stockData.financial_metrics?.change || stockData.change || 0) >= 0 ? '+$' : '$'}
                                    valueStyle={{
                                        color: getChangeColor(stockData.financial_metrics?.change || stockData.change || 0),
                                        fontSize: isMobile ? '16px' : '20px'
                                    }}
                                />
                                <Statistic
                                    title="日涨跌幅"
                                    value={stockData.financial_metrics?.change_percent || stockData.change_percent || 0}
                                    precision={2}
                                    prefix={(stockData.financial_metrics?.change_percent || stockData.change_percent || 0) >= 0 ? '+' : ''}
                                    suffix="%"
                                    valueStyle={{
                                        color: getChangeColor(stockData.financial_metrics?.change_percent || stockData.change_percent || 0),
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
                                percent={analysisData.total_score || 0}
                                format={(percent) => `${percent?.toFixed(1) || 0}`}
                                strokeColor={{
                                    '0%': '#ff4d4f',
                                    '50%': '#faad14',
                                    '100%': '#52c41a',
                                }}
                                size={isMobile ? 80 : 100}
                            />
                            <div style={{ marginTop: '16px' }}>
                                <Space direction="vertical" size="small">
                                    <Tag
                                        color={getDecisionColor(analysisData.decision || 'Hold')}
                                        style={{
                                            fontSize: isMobile ? '14px' : '16px',
                                            padding: '4px 12px'
                                        }}
                                    >
                                        {analysisData.decision || 'Hold'}
                                    </Tag>
                                    <Tag
                                        color={getRiskColor(analysisData.risk_level || 'Medium')}
                                    >
                                        风险等级: {analysisData.risk_level || 'Medium'}
                                    </Tag>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>

            {/* 标签页详情区 */}
            <Card variant="borderless">
                <Tabs defaultActiveKey="overview" size={isMobile ? 'small' : 'middle'}>
                    {/* 概览标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <BarChartOutlined />
                                概览
                            </span>
                        }
                        key="overview"
                    >
                        <Row gutter={[24, 16]}>
                            {/* 关键指标 */}
                            <Col xs={24} lg={12}>
                                <Card title="关键财务指标" size="small">
                                    <Table
                                        columns={financialColumns}
                                        dataSource={financialData}
                                        pagination={false}
                                        size="small"
                                        scroll={{ x: isMobile ? 300 : undefined }}
                                    />
                                </Card>
                            </Col>

                            {/* 评分细则 */}
                            <Col xs={24} lg={12}>
                                <Card title="模型评分细则" size="small">
                                    <Row gutter={[16, 16]}>
                                        {Object.entries(analysisData.scores || {}).map(([key, value]: [string, any], index: number) => {
                                            // 处理不同的数据格式
                                            const score = typeof value === 'number' ? value : value?.score || 0;
                                            const weight = analysisData.details?.weights?.[key] || 0.2;

                                            return (
                                                <Col xs={12} sm={8} key={key}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <Progress
                                                            type="circle"
                                                            percent={score}
                                                            size={isMobile ? 60 : 80}
                                                            format={(percent) => `${percent?.toFixed(0) || 0}`}
                                                            strokeColor={COLORS[index % COLORS.length]}
                                                        />
                                                        <div style={{ marginTop: '8px' }}>
                                                            <Text strong>{key}</Text>
                                                            <br />
                                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                权重: {(weight * 100).toFixed(0)}%
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                        {/* SWOT分析 */}
                        <Card title="SWOT分析" size="small" style={{ marginTop: '16px' }}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" title={<><CheckCircleOutlined style={{ color: '#52c41a' }} /> 优势</>} size="small">
                                        <List
                                            size="small"
                                            dataSource={analysisData.details?.template_info?.characteristics || ['暂无数据']}
                                            renderItem={(item: string) => <List.Item>{item}</List.Item>}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" title={<><WarningOutlined style={{ color: '#faad14' }} /> 劣势</>} size="small">
                                        <List
                                            size="small"
                                            dataSource={[
                                                analysisData.details?.template_info?.description || '暂无数据'
                                            ]}
                                            renderItem={(item: string) => <List.Item>{item}</List.Item>}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" title={<><ArrowUpOutlined style={{ color: '#1890ff' }} /> 机会</>} size="small">
                                        <List
                                            size="small"
                                            dataSource={[
                                                `行业: ${analysisData.details?.fmp_industry || 'N/A'}`,
                                                `模板: ${analysisData.details?.template_info?.name || 'N/A'}`
                                            ]}
                                            renderItem={(item: string) => <List.Item>{item}</List.Item>}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" title={<><SafetyOutlined style={{ color: '#ff4d4f' }} /> 威胁</>} size="small">
                                        <List
                                            size="small"
                                            dataSource={[
                                                `买入阈值: ${analysisData.details?.decision_thresholds?.buy || 'N/A'}`,
                                                `观察阈值: ${analysisData.details?.decision_thresholds?.watch || 'N/A'}`
                                            ]}
                                            renderItem={(item: string) => <List.Item>{item}</List.Item>}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </TabPane>

                    {/* 价格图表标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <LineChartOutlined />
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

                    {/* 技术分析标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <ArrowUpOutlined />
                                技术分析
                            </span>
                        }
                        key="technical"
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="技术指标" size="small">
                                    <Table
                                        columns={technicalColumns}
                                        dataSource={technicalData}
                                        pagination={false}
                                        size="small"
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="趋势分析" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="短期趋势">
                                            <Tag color={analysisData.technical_analysis?.trend_analysis?.short_term === 'Bullish' ? 'green' : 'red'}>
                                                {analysisData.technical_analysis?.trend_analysis?.short_term || 'Neutral'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="中期趋势">
                                            <Tag color={analysisData.technical_analysis?.trend_analysis?.medium_term === 'Bullish' ? 'green' : analysisData.technical_analysis?.trend_analysis?.medium_term === 'Bearish' ? 'red' : 'orange'}>
                                                {analysisData.technical_analysis?.trend_analysis?.medium_term || 'Neutral'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="长期趋势">
                                            <Tag color={analysisData.technical_analysis?.trend_analysis?.long_term === 'Bullish' ? 'green' : 'red'}>
                                                {analysisData.technical_analysis?.trend_analysis?.long_term || 'Neutral'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="趋势强度">
                                            {((analysisData.technical_analysis?.trend_analysis?.trend_strength || 0) * 100).toFixed(0)}%
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="支撑阻力位" size="small" style={{ marginTop: '16px' }}>
                            <Row gutter={[24, 16]}>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" title="支撑位" size="small">
                                        <List
                                            size="small"
                                            dataSource={analysisData.technical_analysis?.support_resistance?.support_levels || []}
                                            renderItem={(item: number) => <List.Item>${item.toFixed(2)}</List.Item>}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Card type="inner" title="阻力位" size="small">
                                        <List
                                            size="small"
                                            dataSource={analysisData.technical_analysis?.support_resistance?.resistance_levels || []}
                                            renderItem={(item: number) => <List.Item>${item.toFixed(2)}</List.Item>}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </TabPane>

                    {/* 财务分析标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <DollarOutlined />
                                财务分析
                            </span>
                        }
                        key="financial"
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="盈利能力" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="毛利率">
                                            {analysisData.financial_analysis?.profitability?.gross_margin || 'N/A'}%
                                        </Descriptions.Item>
                                        <Descriptions.Item label="营业利润率">
                                            {analysisData.financial_analysis?.profitability?.operating_margin || 'N/A'}%
                                        </Descriptions.Item>
                                        <Descriptions.Item label="净利率">
                                            {analysisData.financial_analysis?.profitability?.net_margin || 'N/A'}%
                                        </Descriptions.Item>
                                        <Descriptions.Item label="ROE">
                                            {analysisData.financial_analysis?.profitability?.roe || 'N/A'}%
                                        </Descriptions.Item>
                                        <Descriptions.Item label="ROA">
                                            {analysisData.financial_analysis?.profitability?.roa || 'N/A'}%
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="流动性" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="流动比率">
                                            {analysisData.financial_analysis?.liquidity?.current_ratio || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="速动比率">
                                            {analysisData.financial_analysis?.liquidity?.quick_ratio || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="现金比率">
                                            {analysisData.financial_analysis?.liquidity?.cash_ratio || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="营运资金">
                                            {analysisData.financial_analysis?.liquidity?.working_capital || 'N/A'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="估值分析" size="small" style={{ marginTop: '16px' }}>
                            <Row gutter={[24, 16]}>
                                <Col xs={24} sm={8}>
                                    <Card type="inner" title="DCF估值" size="small">
                                        <Statistic
                                            title="公允价值"
                                            value={analysisData.valuation_models?.dcf_analysis?.fair_value || 0}
                                            precision={2}
                                            prefix="$"
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                        <Text type="secondary">
                                            上涨潜力: {analysisData.valuation_models?.dcf_analysis?.upside_potential || 0}%
                                        </Text>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Card type="inner" title="可比估值" size="small">
                                        <Statistic
                                            title="公允价值"
                                            value={analysisData.valuation_models?.comparable_analysis?.fair_value || 0}
                                            precision={2}
                                            prefix="$"
                                            valueStyle={{ color: '#52c41a' }}
                                        />
                                        <Text type="secondary">
                                            上涨潜力: {analysisData.valuation_models?.comparable_analysis?.upside_potential || 0}%
                                        </Text>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Card type="inner" title="股息折现" size="small">
                                        <Statistic
                                            title="公允价值"
                                            value={analysisData.valuation_models?.dividend_discount?.fair_value || 0}
                                            precision={2}
                                            prefix="$"
                                            valueStyle={{ color: '#faad14' }}
                                        />
                                        <Text type="secondary">
                                            上涨潜力: {analysisData.valuation_models?.dividend_discount?.upside_potential || 0}%
                                        </Text>
                                    </Card>
                                </Col>
                            </Row>
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
                                {stockData.company_info?.description || '暂无公司简介'}
                            </Paragraph>
                        </Card>

                        <Row gutter={[24, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="基本信息" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="行业">
                                            {stockData.company_info?.industry || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="板块">
                                            {stockData.company_info?.sector || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="国家">
                                            {stockData.company_info?.country || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="成立年份">
                                            {stockData.company_info?.founded || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="总部">
                                            {stockData.company_info?.headquarters || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="员工人数">
                                            {stockData.company_info?.employees ? stockData.company_info.employees.toLocaleString() : 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="首席执行官">
                                            {stockData.company_info?.ceo || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="公司官网">
                                            {stockData.company_info?.website ? (
                                                <a href={stockData.company_info.website} target="_blank" rel="noopener noreferrer">
                                                    {stockData.company_info.website}
                                                </a>
                                            ) : 'N/A'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="财务概况" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="营收">
                                            {stockData.company_info.revenue}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="净利润">
                                            {stockData.company_info.net_income}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="总资产">
                                            {stockData.company_info.total_assets}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="总负债">
                                            {stockData.company_info.total_liabilities}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="现金及等价物">
                                            {stockData.company_info?.cash_and_equivalents || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="总债务">
                                            {stockData.company_info?.total_debt || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="自由现金流">
                                            {stockData.company_info?.free_cash_flow || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="经营现金流">
                                            {stockData.company_info?.operating_cash_flow || 'N/A'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    {/* 风险分析标签页 */}
                    <TabPane
                        tab={
                            <span>
                                <SafetyOutlined />
                                风险分析
                            </span>
                        }
                        key="risk"
                    >
                        <Row gutter={[24, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="系统性风险" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Beta系数">
                                            {analysisData.risk_assessment?.systematic_risk?.beta || 'N/A'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="市场相关性">
                                            {((analysisData.risk_assessment?.systematic_risk?.market_correlation || 0) * 100).toFixed(1)}%
                                        </Descriptions.Item>
                                        <Descriptions.Item label="板块相关性">
                                            {((analysisData.risk_assessment?.systematic_risk?.sector_correlation || 0) * 100).toFixed(1)}%
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="非系统性风险" size="small">
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="商业风险">
                                            <Tag color={getRiskColor(analysisData.risk_assessment?.unsystematic_risk?.business_risk || 'Medium')}>
                                                {analysisData.risk_assessment?.unsystematic_risk?.business_risk || 'Medium'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="财务风险">
                                            <Tag color={getRiskColor(analysisData.risk_assessment?.unsystematic_risk?.financial_risk || 'Medium')}>
                                                {analysisData.risk_assessment?.unsystematic_risk?.financial_risk || 'Medium'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="运营风险">
                                            <Tag color={getRiskColor(analysisData.risk_assessment?.unsystematic_risk?.operational_risk || 'Medium')}>
                                                {analysisData.risk_assessment?.unsystematic_risk?.operational_risk || 'Medium'}
                                            </Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="监管风险">
                                            <Tag color={getRiskColor(analysisData.risk_assessment?.unsystematic_risk?.regulatory_risk || 'Medium')}>
                                                {analysisData.risk_assessment?.unsystematic_risk?.regulatory_risk || 'Medium'}
                                            </Tag>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="波动性分析" size="small" style={{ marginTop: '16px' }}>
                            <Row gutter={[24, 16]}>
                                <Col xs={24} sm={8}>
                                    <Statistic
                                        title="历史波动率"
                                        value={analysisData.risk_assessment?.volatility_analysis?.historical_volatility || 0}
                                        precision={2}
                                        suffix="%"
                                    />
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Statistic
                                        title="隐含波动率"
                                        value={analysisData.risk_assessment?.volatility_analysis?.implied_volatility || 0}
                                        precision={2}
                                        suffix="%"
                                    />
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Statistic
                                        title="波动率排名"
                                        value={analysisData.risk_assessment?.volatility_analysis?.volatility_rank || 0}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}
