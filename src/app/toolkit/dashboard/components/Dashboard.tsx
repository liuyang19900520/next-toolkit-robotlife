'use client';

import { Card, Row, Col, Statistic, Table } from 'antd';
import {
    CalculatorOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// 模拟数据
const mockData = [
    { year: 2024, name: 'TLT', price: 200, unit: '美元', category: '债券' },
    { year: 2024, name: 'QQQ', price: 400, unit: '美元', category: '股票' },
    { year: 2024, name: 'GLD', price: 180, unit: '美元', category: '黄金' },
    { year: 2024, name: 'SLV', price: 150, unit: '美元', category: '白银' },
];

// 饼图颜色
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
    // 表格列定义
    const columns = [
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (text: number) => `${text} ${mockData[0].unit}`,
        },
        {
            title: '类别',
            dataIndex: 'category',
            key: 'category',
        },
    ];

    return (
        <div>
            {/* 统计卡片 */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="总资产"
                            value={112893}
                            precision={2}
                            prefix={<DollarOutlined />}
                            suffix="¥"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="投资数量"
                            value={93}
                            prefix={<CalculatorOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="收益率"
                            value={11.28}
                            prefix={<UserOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="持有时长"
                            value={93}
                            suffix="天"
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 图表区域 */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title="资产分布" bordered={false}>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={mockData}
                                        dataKey="price"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {mockData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="价格对比" bordered={false}>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={mockData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="price" fill="#8884d8" name="价格" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 表格区域 */}
            <Card title="投资列表" bordered={false} style={{ marginTop: '24px' }}>
                <Table
                    columns={columns}
                    dataSource={mockData}
                    rowKey="name"
                    pagination={false}
                />
            </Card>
        </div>
    );
} 