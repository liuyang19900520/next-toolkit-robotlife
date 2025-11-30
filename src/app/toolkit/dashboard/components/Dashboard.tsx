/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Table, Form, Input, Select, Button, Space, Popconfirm, message } from 'antd';
import InvestmentApi, { Investment } from '@/utils/api/investment';
import {
    DollarOutlined,
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
    TooltipProps
} from 'recharts';
import InvestmentForm from './InvestmentForm';
import ExchangeRate from './ExchangeRate';

// 饼图颜色
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
const CATEGORIES = ['股票', '债券', '大宗', '现金', '加密货币', 'ideco'];

// Dashboard 组件顶部添加 props 类型和参数
interface DashboardProps {
    selectedKey: string; // 接收 selectedKey
}

export default function Dashboard({ selectedKey }: DashboardProps) {
    // 新增状态：是否通过密码验证
    const [authenticated, setAuthenticated] = useState(false);
    // 密码弹窗 Form
    const [passwordForm] = Form.useForm();
    // 移动端检测
    const [isMobile, setIsMobile] = useState(false);

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
    const [totals, setTotals] = useState({ totalUSD: 0, totalJPY: 0, totalCNY: 0 });

    // Calculate the default year
    const getDefaultYear = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        return currentMonth < 12 ? currentYear - 1 : currentYear;
    };

    const defaultYear = getDefaultYear();

    // 使用useCallback缓存获取数据的函数
    const fetchInvestments = useCallback(async (params?: any) => {
        console.log('fetchInvestments====');
        setLoading(true);
        try {
            const response = await InvestmentApi.getList(params);
            setInvestments(response.data || []); // 仅保存原始数据，确保是数组
        } catch (error: any) {
            console.error('Failed to fetch investments:', error);
            const errorMessage = error?.message || '获取投资数据失败，请稍后重试';
            message.error(errorMessage);
            // 设置空数组以避免后续错误
            setInvestments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllInvestments = useCallback(async (params?: any) => {
        console.log('fetchAllInvestments====');
        setLoading(true);
        try {
            const response = await InvestmentApi.getList(params);
            setAllInvestments(response.data || []); // 仅保存原始数据，确保是数组
        } catch (error: any) {
            console.error('Failed to fetch all investments:', error);
            // 静默失败，因为这个函数可能不是关键功能
            setAllInvestments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // 计算总数的逻辑单独提取，依赖rates
    const calculateConvertedTotals = useCallback((data: Investment[]) => {
        let totalUSD = 0;
        let totalJPY = 0;
        let totalCNY = 0;

        data.forEach(item => {
            const amount = Number(item.price);
            switch (item.currency) {
                case 'USD':
                    totalUSD += amount;
                    break;
                case 'JPY':
                    totalJPY += amount;
                    break;
                case 'CNY':
                    totalCNY += amount;
                    break;
            }
        });

        return {
            totalUSD: totalUSD * rates.USDJPY,    // 转换为日元
            totalJPY: totalJPY,
            totalCNY: totalCNY * (rates.USDJPY / rates.USDCNY) // 转换为日元
        };
    }, [rates]);

    // 当investments或rates变化时更新总数
    useEffect(() => {
        const calculated = calculateConvertedTotals(investments);
        setTotals({
            totalUSD: calculated.totalUSD,
            totalJPY: calculated.totalJPY,
            totalCNY: calculated.totalCNY
        });
    }, [investments, calculateConvertedTotals]);

    // 检测移动端
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 初始数据加载
    useEffect(() => {
        const timer = setTimeout(() => {
            searchForm.setFieldsValue({ year: defaultYear.toString() });
            fetchInvestments({ year: defaultYear.toString() });
            fetchAllInvestments();
        }, 0);

        return () => clearTimeout(timer);
    }, [defaultYear, fetchInvestments, fetchAllInvestments, searchForm]);

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

    const getBarChartData = (investments: Investment[]) => {
        const yearData: { [key: string]: { USD: number; JPY: number; CNY: number; originalUSD: number; originalJPY: number; originalCNY: number } } = {};

        investments.forEach(item => {
            const year = item.year;
            const amount = Number(item.price);

            if (!yearData[year]) {
                yearData[year] = { USD: 0, JPY: 0, CNY: 0, originalUSD: 0, originalJPY: 0, originalCNY: 0 };
            }

            switch (item.currency) {
                case 'USD':
                    yearData[year].USD += amount * rates.USDJPY;
                    yearData[year].originalUSD += amount;
                    break;
                case 'JPY':
                    yearData[year].JPY += amount;
                    yearData[year].originalJPY += amount;
                    break;
                case 'CNY':
                    yearData[year].CNY += amount * (rates.USDJPY / rates.USDCNY);
                    yearData[year].originalCNY += amount;
                    break;
                default:
                    console.warn(`Unknown currency: ${item.currency}`);
            }
        });

        return Object.keys(yearData).map(year => ({
            year,
            USD: yearData[year].USD,
            JPY: yearData[year].JPY,
            CNY: yearData[year].CNY,
            originalUSD: yearData[year].originalUSD,
            originalJPY: yearData[year].originalJPY,
            originalCNY: yearData[year].originalCNY
        }));
    };

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                    <p>{`年份: ${label}`}</p>
                    <p>{`美元: ${data.originalUSD.toLocaleString()} USD`}</p>
                    <p>{`日元: ${data.originalJPY.toLocaleString()} JPY`}</p>
                    <p>{`人民币: ${data.originalCNY.toLocaleString()} CNY`}</p>
                </div>
            );
        }
        return null;
    };

    const handleExchangeRateUpdate = useCallback((newRates: any) => {
        setRates(newRates);
    }, []);

    const resetSearch = () => {
        searchForm.setFieldsValue({ year: defaultYear.toString() });
        fetchInvestments({ year: defaultYear.toString() });
        fetchAllInvestments();
    };

    const handleReset = () => {
        searchForm.resetFields();
        resetSearch();
    };

    const handleAdd = () => {
        setModalTitle('创建投资');
        setCurrentInvestment(undefined);
        setModalVisible(true);
    };

    const handleEdit = async (record: Investment) => {
        try {
            setModalLoading(true);
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

    const handleDelete = async (id: number) => {
        try {
            await InvestmentApi.delete(id);
            resetSearch();
        } catch (error) {
            console.error('Failed to delete investment:', error);
        }
    };

    const handleModalOk = async (values: any) => {
        setModalLoading(true);
        try {
            if (currentInvestment?.id) {
                // 更新时，不要包含 id 字段（id 是主键，不能更新）
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _unused, ...updateData } = values;
                await InvestmentApi.update(currentInvestment.id, updateData);
            } else {
                await InvestmentApi.create(values);
            }
            setModalVisible(false);
            resetSearch();
        } catch (error) {
            console.error('Failed to save investment:', error);
        } finally {
            setModalLoading(false);
        }
    };

    // 处理密码验证表单提交
    const handlePasswordSubmit = (values: any) => {
        // 当前固定密码为 "mysecret"
        if (values.password === 'mysecret') {
            setAuthenticated(true);
            message.success('验证成功');
        } else {
            message.error('密码错误，请重试');
        }
    };

    const shouldBlur = (selectedKey === 'dashboard') && !authenticated;


    // 搜索表单组件
    const SearchForm = () => (
        <Card variant="borderless" style={{ marginBottom: '24px' }}>
            <Form
                form={searchForm}
                layout="vertical" // 移动端改为垂直布局
                onFinish={handleSearch}
                style={{ gap: '16px' }}
            >
                <Form.Item name="year" label="年份">
                    <Input allowClear />
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
                            { value: 'JPY', label: 'JPY' },
                        ]}
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'center' }}>
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
            width: 60,
            responsive: ['md'] as any, // 在小屏幕上隐藏
        },
        {
            title: '年份',
            dataIndex: 'year',
            key: 'year',
            width: 80,
        },
        {
            title: '名称',
            dataIndex: 'target',
            key: 'target',
            width: 120,
        },
        {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            render: (value: number) => value.toLocaleString(),
        },
        {
            title: '货币',
            dataIndex: 'currency',
            key: 'currency',
            width: 80,
        },
        {
            title: '大类别',
            dataIndex: 'type1',
            key: 'type1',
            width: 100,
            responsive: ['sm'] as any, // 在超小屏幕上隐藏
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
            width: 120,
            responsive: ['md'] as any, // 在小屏幕上隐藏
        },
        {
            title: '所属',
            dataIndex: 'owner',
            key: 'owner',
            width: 80,
            responsive: ['lg'] as any, // 在中等屏幕上隐藏
        },
        {
            title: '操作',
            key: 'action',
            width: 120,
            fixed: 'right' as any,
            render: (_: any, record: Investment) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
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
                            size="small"
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
            {/* 汇率组件保持清晰，不受模糊影响 */}
            <Card title="今日汇率" variant="borderless" style={{ marginBottom: '24px' }}>
                <ExchangeRate onRateUpdate={handleExchangeRateUpdate} />
            </Card>

            {/* 其他内容在未验证时模糊 */}
            <div style={{ filter: shouldBlur ? 'blur(5px)' : 'none', pointerEvents: shouldBlur ? 'none' : 'auto' }}>                {/* 统计卡片 */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card variant="borderless">
                            <Statistic
                                title="美元总资产"
                                value={totals.totalUSD}
                                precision={2}
                                prefix={<DollarOutlined />}
                                suffix="$"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card variant="borderless">
                            <Statistic
                                title="日元总资产"
                                value={totals.totalJPY}
                                precision={2}
                                prefix={<DollarOutlined />}
                                suffix="円"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card variant="borderless">
                            <Statistic
                                title="人民币总资产"
                                value={totals.totalCNY}
                                precision={2}
                                prefix={<DollarOutlined />}
                                suffix="¥"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* 图表区域 */}
                <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                    <Col xs={24} lg={12}>
                        <Card title="资产分布" variant="borderless">
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={getPieChartData(investments)}
                                            dataKey="value"
                                            nameKey="type"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={isMobile ? 60 : 80}
                                            label={isMobile ? false : ({ name, value, percent }) =>
                                                `${name}: ${value} (${(percent * 100).toFixed(2)}%)`
                                            }
                                        >
                                            {getPieChartData(investments).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${value} 日元`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="年度货币总额" variant="borderless">
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={getBarChartData(allData)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="year"
                                            tick={{ fontSize: isMobile ? 10 : 12 }}
                                        />
                                        <YAxis
                                            tickFormatter={(value) => `${value / 10000} 万`}
                                            tick={{ fontSize: isMobile ? 10 : 12 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
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
                    variant="borderless"
                    extra={
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
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

            {/* 密码输入框，仅在 shouldBlur 为 true 时显示 */}
            {shouldBlur && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10, // 确保在模糊层之上
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        width: '300px',
                    }}
                >
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>请输入访问密码</h3>
                    <Form form={passwordForm} onFinish={handlePasswordSubmit}>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password placeholder="密码" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                验证
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    );

}
