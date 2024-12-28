'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Table, Form, Input, Select, Button, Space, Popconfirm } from 'antd';
import InvestmentApi, { Investment } from '@/utils/api/investment';
import {
    CalculatorOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    UserOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
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
    ResponsiveContainer,
    Line
} from 'recharts';
import InvestmentForm from './InvestmentForm';
import ExchangeRate from './ExchangeRate';

// 饼图颜色
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
const CATEGORIES = ['股票', '债券', '大宗', '现金', '加密货币', 'ideco'];



export default function Dashboard() {
    const [searchForm] = Form.useForm();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [allData, setAllInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [currentInvestment, setCurrentInvestment] = useState<Partial<Investment>>();
    const [rates, setRates] = useState({
        USDJPY: 0,
        USDCNY: 0,
        JPYUSD: 0,
        JPYCNY: 0
    });

    // 获取投资列表
    const fetchInvestments = async (params?: any) => {
        setLoading(true);
        try {
            const response = await InvestmentApi.getList(params);
            setInvestments(response.data);
        } catch (error) {
            console.error('Failed to fetch investments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllInvestments = async (params?: any) => {
        setLoading(true);
        try {
            const response = await InvestmentApi.getList(params);
            setAllInvestments(response.data);
        } catch (error) {
            console.error('Failed to fetch investments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
        fetchAllInvestments();
    }, []);

    // 处理搜索
    const handleSearch = async (values: any) => {
        // 移除空值
        const params = Object.keys(values).reduce((acc: any, key) => {
            if (values[key] !== undefined && values[key] !== '') {
                acc[key] = values[key];
            }
            return acc;
        }, {});

        await fetchInvestments(params);
    };

    // 在 Dashboard 组件中添加数据转换函数
    const getPieChartData = (investments: Investment[]) => {
        const categoryData = CATEGORIES.map(category => {
            const filteredInvestments = investments.filter(item => item.type1 === category);
            const value = filteredInvestments.reduce((sum, item) => {
                let amount = Number(item.price);
                // 根据货币类型转换为日元
                switch (item.currency) {
                    case 'USD':
                        amount = amount * rates.USDJPY;
                        break;
                    case 'CNY':
                        amount = amount * (rates.USDJPY / rates.USDCNY); // 通过美元转换为日元
                        break;
                    case 'JPY':
                        // 已经是日元，不需要转换
                        break;
                    default:
                        console.warn(`Unknown currency: ${item.currency}`);
                }
                return sum + amount;
            }, 0);

            return {
                type: category,
                value: Math.round(value) // 四舍五入到整数日元
            };
        });

        return categoryData;
    };

    // 在 Dashboard 组件中添加数据转换函数
    const getBarChartData = (investments: Investment[]) => {
        const yearData: { [key: string]: { USD: number; JPY: number; CNY: number } } = {};

        investments.forEach(item => {
            const year = item.year;
            let amount = Number(item.price);

            if (!yearData[year]) {
                yearData[year] = { USD: 0, JPY: 0, CNY: 0 };
            }

            // 根据货币类型转换为日元
            switch (item.currency) {
                case 'USD':
                    amount = amount * rates.USDJPY;
                    yearData[year].USD += amount;
                    break;
                case 'JPY':
                    yearData[year].JPY += amount;
                    break;
                case 'CNY':
                    amount = amount * (rates.USDJPY / rates.USDCNY);
                    yearData[year].CNY += amount;
                    break;
                default:
                    console.warn(`Unknown currency: ${item.currency}`);
            }
        });

        return Object.keys(yearData).map(year => ({
            year,
            USD: yearData[year].USD,
            JPY: yearData[year].JPY,
            CNY: yearData[year].CNY
        }));
    };

    // 在组件中共享汇率数据


    const handleExchangeRateUpdate = useCallback((newRates: any) => {
        setRates(newRates);
    }, []);



    // 重置搜索
    const handleReset = () => {
        searchForm.resetFields();
        fetchInvestments();
    };

    // 处理创建
    const handleAdd = () => {
        setModalTitle('创建投资');
        setCurrentInvestment(undefined);
        setModalVisible(true);
    };

    // 处理编辑
    const handleEdit = async (record: Investment) => {
        try {
            setModalLoading(true);
            // 获取详细数据
            const response = await InvestmentApi.getById(record.id);
            setModalTitle('编辑投资');
            setCurrentInvestment(response.data);
            setModalVisible(true);
        } catch (error) {
            console.error('Failed to fetch investment details:', error);
        } finally {
            setModalLoading(false);
        }
    };

    // 处理删除
    const handleDelete = async (id: number) => {
        try {
            await InvestmentApi.delete(id);
            fetchInvestments(); // 刷新列表
        } catch (error) {
            console.error('Failed to delete investment:', error);
        }
    };

    // 处理表单提交
    const handleModalOk = async (values: any) => {
        setModalLoading(true);
        try {
            if (currentInvestment?.id) {
                // 更新
                await InvestmentApi.update(currentInvestment.id, {
                    ...values,
                    id: currentInvestment.id // 确保 ID 不变
                });
            } else {
                // 创建
                await InvestmentApi.create(values);
            }
            setModalVisible(false);
            fetchInvestments(); // 刷新列表
        } catch (error) {
            console.error('Failed to save investment:', error);
        } finally {
            setModalLoading(false);
        }
    };

    // 搜索表单
    const SearchForm = () => (
        <Card bordered={false} style={{ marginBottom: '24px' }}>
            <Form
                form={searchForm}
                layout="inline"
                onFinish={handleSearch}
                style={{ gap: '16px' }}
            >
                <Form.Item name="year" label="年份">
                    <Input
                        allowClear
                    ></Input>
                </Form.Item>

                <Form.Item name="type1" label="大类别">
                    <Select
                        style={{ width: 120 }}
                        options={[
                            { value: '股票', label: '股票' },
                            { value: '债券', label: '债券' },
                            { value: '大宗', label: '大宗' },
                            { value: '现金', label: '现金' },
                            { value: '加密货币', label: '加密货币' },
                        ]}
                        allowClear
                    />
                </Form.Item>

                <Form.Item name="type2" label="小类别">
                    <Select
                        style={{ width: 120 }}
                        options={[
                            { value: 'ETF', label: 'ETF' },
                            { value: '股票', label: '股票' },
                            { value: '国债', label: '国债' },
                        ]}
                        allowClear
                    />
                </Form.Item>

                <Form.Item name="target" label="名称">
                    <Input placeholder="请输入名称" style={{ width: 200 }} />
                </Form.Item>

                <Form.Item name="currency" label="货币">
                    <Select
                        style={{ width: 120 }}
                        options={[
                            { value: 'USD', label: 'USD' },
                            { value: 'CNY', label: 'CNY' },
                            { value: 'HKD', label: 'HKD' },
                        ]}
                        allowClear
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button onClick={handleReset}>重置</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );

    // 表格列定义
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: '名称',
            dataIndex: 'target',
            key: 'target',
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '货币',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: '大类别',
            dataIndex: 'type1',
            key: 'type1',
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '所属',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: Investment) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {/* 添加汇率显示 */}
            <Card title="今日汇率" bordered={false} style={{ marginBottom: '24px' }}>
                <ExchangeRate onRateUpdate={handleExchangeRateUpdate} />
            </Card>

            {/* 统计卡片 */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="日元总资产"
                            value={112893}
                            precision={2}
                            prefix={<DollarOutlined />}
                            suffix="円"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="人民币总资产"
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
                            title="美元总资产"
                            value={112893}
                            precision={2}
                            prefix={<DollarOutlined />}
                            suffix="$"
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
                                        data={getPieChartData(investments)}
                                        dataKey="value"
                                        nameKey="type"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {getPieChartData(investments).map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
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
                    <Card title="年度货币总额" bordered={false}>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={getBarChartData(allData)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip formatter={(value, name) => `${value} 日元`} />
                                    <Legend />
                                    <Bar dataKey="USD" stackId="a" fill="#8884d8" name="美元" />
                                    <Bar dataKey="JPY" stackId="a" fill="#82ca9d" name="日元" />
                                    <Bar dataKey="CNY" stackId="a" fill="#ffc658" name="人民币" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 搜索表单 */}
            <SearchForm />

            {/* 表格区域 */}
            <Card
                title="投资列表"
                bordered={false}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        新建
                    </Button>
                }
            >
                <div style={{ overflowX: 'auto' }}>
                    <Table
                        columns={columns}
                        dataSource={investments}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            total: investments.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </div>
            </Card>

            {/* 表单弹窗 */}
            <InvestmentForm
                open={modalVisible}
                loading={modalLoading}
                title={modalTitle}
                initialValues={currentInvestment}
                onOk={handleModalOk}
                onCancel={() => setModalVisible(false)}
            />
        </div>
    );
} 