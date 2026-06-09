/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Form,
  Input,
  Select,
  Button,
  Space,
  Popconfirm,
  message,
  Tooltip,
} from 'antd';
import InvestmentApi from '@/utils/api/investment';
import type { Investment } from '@/types';
import { useIsMobile } from '@/hooks/useIsMobile';
import { DollarOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import InvestmentForm from './InvestmentForm';
import CsvUploader from './CsvUploader';
import AlipayOcrImporter from './AlipayOcrImporter';
import ExchangeRate from './ExchangeRate';
import { TYPE1_OPTIONS, getType2Options } from '@/config/categories';
import PieChartCard from './PieChartCard';
import SimulatorModal from './SimulatorModal';
import {
  getRmbPieChartData,
  getNonRmbPieChartData,
  getTotalPieChartData,
} from '@/utils/chartDataUtils';
import { PieChartOutlined } from '@ant-design/icons';

// Dashboard 组件顶部添加 props 类型和参数
interface DashboardProps {
  selectedKey: string; // 接收 selectedKey
}

export default function Dashboard({ selectedKey }: DashboardProps) {
  // 新增状态：是否通过密码验证
  const [authenticated, setAuthenticated] = useState(false);
  // 人民币下钻二级分类状态，null 表示展示一级大类
  const [activeRmbCategory, setActiveRmbCategory] = useState<string | null>(null);
  // 非人民币下钻二级分类状态
  const [activeNonRmbCategory, setActiveNonRmbCategory] = useState<string | null>(null);
  // 整体资产下钻二级分类状态
  const [activeTotalCategory, setActiveTotalCategory] = useState<string | null>(null);

  // 手动勾选的数据行的 keys (即投资项目的 ID)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // 密码弹窗 Form
  const [passwordForm] = Form.useForm();
  // 移动端检测
  const isMobile = useIsMobile();

  const [searchForm] = Form.useForm();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [allData, setAllInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [simulatorVisible, setSimulatorVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentInvestment, setCurrentInvestment] = useState<Partial<Investment>>();
  const [rates, setRates] = useState({
    USDJPY: 0,
    USDCNY: 0,
    JPYUSD: 0,
    JPYCNY: 0,
  });
  const [totals, setTotals] = useState({ totalRMB: 0, totalNonRMB: 0 });

  // Calculate the default yearMonth (YYYYMM)
  const getDefaultYearMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
  };

  const defaultYear = getDefaultYearMonth();

  // 使用useCallback缓存获取数据的函数
  const fetchInvestments = useCallback(async (params?: any) => {
    console.log('fetchInvestments====');
    setLoading(true);
    try {
      const response = await InvestmentApi.getList(params);
      setInvestments(response.data || []); // 仅保存原始数据，确保是数组
      setSelectedRowKeys([]); // 重置勾选状态
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
  const calculateConvertedTotals = useCallback(
    (data: Investment[]) => {
      let totalUSD = 0;
      let totalJPY = 0;
      let totalCNY = 0;

      if (data.length === 0) {
        return { totalRMB: 0, totalNonRMB: 0 };
      }

      // 找出当前数据集中的最新年份月份
      const years = data.map((item) => Number(item.year)).filter(Boolean);
      if (years.length === 0) {
        return { totalRMB: 0, totalNonRMB: 0 };
      }
      const latestYear = String(Math.max(...years));

      // 仅累加最新月份的数据，避免历史月度累计误差
      const latestData = data.filter((item) => item.year === latestYear);

      latestData.forEach((item) => {
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
        totalRMB: totalCNY, // 人民币原值
        totalNonRMB: totalJPY + totalUSD * rates.USDJPY, // 非人民币折合日元值
      };
    },
    [rates]
  );

  // 当investments或rates变化时更新总数
  useEffect(() => {
    const calculated = calculateConvertedTotals(investments);
    setTotals({
      totalRMB: calculated.totalRMB,
      totalNonRMB: calculated.totalNonRMB,
    });
  }, [investments, calculateConvertedTotals]);

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

  const getBarChartData = (investments: Investment[]) => {
    const yearData: {
      [key: string]: {
        USD: number;
        JPY: number;
        CNY: number;
        originalUSD: number;
        originalJPY: number;
        originalCNY: number;
      };
    } = {};

    investments.forEach((item) => {
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

    return Object.keys(yearData).map((year) => ({
      year,
      CNY: yearData[year].CNY,
      NonCNY: yearData[year].USD + yearData[year].JPY, // 合并 USD 和 JPY 折合日元总额为非人民币
      originalUSD: yearData[year].originalUSD,
      originalJPY: yearData[year].originalJPY,
      originalCNY: yearData[year].originalCNY,
    }));
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="custom-tooltip"
          style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}
        >
          <p>{`年月: ${label}`}</p>
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

  const handleBatchDelete = async () => {
    try {
      setLoading(true);
      const ids = investments.map((item) => item.id);
      const response = await InvestmentApi.deleteBatch(ids);
      if (response.data?.deletedCount) {
        message.success(`成功一键删除 ${response.data.deletedCount} 笔数据`);
      } else {
        message.success('一键删除成功');
      }
      resetSearch();
    } catch (error) {
      console.error('Failed to batch delete investments:', error);
      message.error('一键删除失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      setLoading(true);
      const ids = selectedRowKeys.map((key) => Number(key));
      const response = await InvestmentApi.deleteBatch(ids);
      if (response.data?.deletedCount) {
        message.success(`成功删除选中的 ${response.data.deletedCount} 笔数据`);
      } else {
        message.success('删除成功');
      }
      setSelectedRowKeys([]);
      resetSearch();
    } catch (error) {
      console.error('Failed to delete selected investments:', error);
      message.error('删除失败，请稍后重试');
    } finally {
      setLoading(false);
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

  const shouldBlur = selectedKey === 'dashboard' && !authenticated;

  const rmbPieData = getRmbPieChartData(investments, activeRmbCategory);
  const rmbPieTotal = rmbPieData.reduce((sum, item) => sum + item.value, 0);

  const nonRmbPieData = getNonRmbPieChartData(investments, activeNonRmbCategory, rates);
  const nonRmbPieTotal = nonRmbPieData.reduce((sum, item) => sum + item.value, 0);

  const totalPieData = getTotalPieChartData(investments, activeTotalCategory, rates);
  const totalPieTotal = totalPieData.reduce((sum, item) => sum + item.value, 0);

  const distinctYears = Array.from(new Set(investments.map((item) => item.year)));
  const canBatchDelete = investments.length > 0 && distinctYears.length === 1;
  const targetDeleteYear = canBatchDelete ? distinctYears[0] : null;

  // 搜索表单组件
  const SearchForm = () => {
    const selectedType1 = Form.useWatch('type1', searchForm);
    const type2Options = selectedType1 ? getType2Options(selectedType1) : [];

    return (
      <Card variant="borderless" style={{ marginBottom: '24px' }}>
        <Form
          form={searchForm}
          layout="vertical" // 移动端改为垂直布局
          onFinish={handleSearch}
          style={{ gap: '16px' }}
        >
          <Form.Item name="year" label="年月">
            <Input allowClear placeholder="例如：202512" />
          </Form.Item>
          <Form.Item name="type1" label="大类别">
            <Select
              style={{ width: 120 }}
              options={TYPE1_OPTIONS}
              allowClear
              onChange={() => searchForm.setFieldValue('type2', undefined)}
            />
          </Form.Item>
          <Form.Item name="type2" label="小类别">
            <Select
              style={{ width: 120 }}
              options={type2Options}
              allowClear
              disabled={!selectedType1 && type2Options.length === 0}
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
  };

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
      title: '年月',
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
          <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
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
      <div
        style={{
          filter: shouldBlur ? 'blur(5px)' : 'none',
          pointerEvents: shouldBlur ? 'none' : 'auto',
        }}
      >
        {' '}
        {/* 顶部操作区 */}
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PieChartOutlined />}
            onClick={() => setSimulatorVisible(true)}
          >
            饼图模拟器
          </Button>
        </Space>
        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card variant="borderless">
              <Statistic
                title="非人民币总资产 (Non-RMB)"
                value={totals.totalNonRMB}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="円"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card variant="borderless">
              <Statistic
                title="人民币总资产 (RMB)"
                value={totals.totalRMB}
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
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <PieChartCard
                title="人民币资产分布"
                totalLabel="人民币总额"
                activeCategory={activeRmbCategory}
                onCategoryChange={setActiveRmbCategory}
                totalValue={rmbPieTotal}
                currencySymbol="¥"
                data={rmbPieData}
                isMobile={isMobile}
              />
              <PieChartCard
                title="整体资产分布 (折算日元)"
                totalLabel="整体资产总额"
                activeCategory={activeTotalCategory}
                onCategoryChange={setActiveTotalCategory}
                totalValue={totalPieTotal}
                currencySymbol="円"
                data={totalPieData}
                isMobile={isMobile}
              />
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <PieChartCard
                title="非人民币资产分布"
                totalLabel="非人民币总额"
                activeCategory={activeNonRmbCategory}
                onCategoryChange={setActiveNonRmbCategory}
                totalValue={nonRmbPieTotal}
                currencySymbol="円"
                data={nonRmbPieData}
                isMobile={isMobile}
              />
            </Space>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} lg={24}>
            <Card title="年月货币总额" variant="borderless">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={getBarChartData(allData)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <YAxis
                      tickFormatter={(value) => `${value / 10000} 万`}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                    <Bar dataKey="NonCNY" stackId="a" fill="#8884d8" name="非人民币" />
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
            <Space wrap>
              {selectedRowKeys.length > 0 ? (
                <Popconfirm
                  title={`确定要删除选中的 ${selectedRowKeys.length} 笔数据吗？`}
                  description="此操作不可逆，将永久删除这些记录！"
                  onConfirm={handleDeleteSelected}
                  okText="确定"
                  cancelText="取消"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />}>
                    删除选中 ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              ) : investments.length > 0 ? (
                distinctYears.length > 1 ? (
                  <Tooltip title="查询结果包含多个不同月份，无法一键删除">
                    <span>
                      <Button type="primary" danger icon={<DeleteOutlined />} disabled>
                        不同月份无法删除
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Popconfirm
                    title={`确定要删除 ${targetDeleteYear} 的所有 ${investments.length} 笔数据吗？`}
                    description="此操作不可逆，将永久删除这些记录！"
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                      一键删除 {targetDeleteYear}
                    </Button>
                  </Popconfirm>
                )
              ) : (
                <Button type="primary" danger icon={<DeleteOutlined />} disabled>
                  一键删除
                </Button>
              )}
              <AlipayOcrImporter onSuccess={() => fetchInvestments()} />
              <CsvUploader onSuccess={() => fetchInvestments()} />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新建
              </Button>
            </Space>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <Table
              rowSelection={{
                selectedRowKeys,
                onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
              }}
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
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
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
      <SimulatorModal
        visible={simulatorVisible}
        onClose={() => setSimulatorVisible(false)}
        initialInvestments={investments}
        rates={rates}
      />
    </div>
  );
}
