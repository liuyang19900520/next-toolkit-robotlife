'use client';

import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  Card,
  Table,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Modal,
  Form,
  message,
} from 'antd';
import { SearchOutlined, StockOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import StockApi from '@/utils/api/stock';
import type { StockListItem } from '@/types';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 示例股票数据
const sampleStockList: StockListItem[] = [
  {
    id: 'DIS',
    symbol: 'DIS',
    company_name: 'The Walt Disney Company',
    current_price: 85.42,
    change: -2.18,
    change_percent: -2.49,
    exchange: 'NYSE',
    market_cap: '$156.2B',
    volume: '12.5M',
    pe_ratio: 18.5,
    sector: 'Communication Services',
    industry: 'Entertainment',
    rating: 'Avoid',
    score: 21.05,
  },
  {
    id: 'AAPL',
    symbol: 'AAPL',
    company_name: 'Apple Inc.',
    current_price: 175.84,
    change: 3.25,
    change_percent: 1.88,
    exchange: 'NASDAQ',
    market_cap: '$2.7T',
    volume: '45.2M',
    pe_ratio: 28.3,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    rating: 'Buy',
    score: 78.5,
  },
  {
    id: 'MSFT',
    symbol: 'MSFT',
    company_name: 'Microsoft Corporation',
    current_price: 378.85,
    change: 5.67,
    change_percent: 1.52,
    exchange: 'NASDAQ',
    market_cap: '$2.8T',
    volume: '22.1M',
    pe_ratio: 32.1,
    sector: 'Technology',
    industry: 'Software',
    rating: 'Buy',
    score: 82.3,
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    company_name: 'Tesla, Inc.',
    current_price: 248.5,
    change: -8.75,
    change_percent: -3.4,
    exchange: 'NASDAQ',
    market_cap: '$789.5B',
    volume: '89.3M',
    pe_ratio: 45.2,
    sector: 'Consumer Discretionary',
    industry: 'Automobiles',
    rating: 'Hold',
    score: 45.8,
  },
  {
    id: 'GOOGL',
    symbol: 'GOOGL',
    company_name: 'Alphabet Inc.',
    current_price: 142.56,
    change: 1.23,
    change_percent: 0.87,
    exchange: 'NASDAQ',
    market_cap: '$1.8T',
    volume: '18.7M',
    pe_ratio: 25.8,
    sector: 'Technology',
    industry: 'Internet Content',
    rating: 'Buy',
    score: 75.2,
  },
];

export default function StockList() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [searchText, setSearchText] = useState('');
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<StockListItem[]>(sampleStockList);

  // 添加股票相关状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addingStock, setAddingStock] = useState(false);
  const [stockList, setStockList] = useState<StockListItem[]>(sampleStockList);
  const [form] = Form.useForm();

  // 过滤数据
  useEffect(() => {
    let filtered = stockList;

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
          stock.company_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 行业过滤
    if (filterSector !== 'all') {
      filtered = filtered.filter((stock) => stock.sector === filterSector);
    }

    // 评级过滤
    if (filterRating !== 'all') {
      filtered = filtered.filter((stock) => stock.rating === filterRating);
    }

    setFilteredData(filtered);
  }, [searchText, filterSector, filterRating, stockList]);

  // 获取涨跌颜色
  const getChangeColor = (value: number) => {
    return value >= 0 ? '#52c41a' : '#ff4d4f';
  };

  // 获取评级颜色
  const getRatingColor = (rating: string) => {
    switch (rating.toLowerCase()) {
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

  // 获取所有行业
  const sectors = Array.from(new Set(stockList.map((stock) => stock.sector)));

  // 添加股票函数
  const handleAddStock = async (values: { symbol: string }) => {
    const symbol = values.symbol.toUpperCase().trim();

    // 检查股票是否已存在
    if (stockList.some((stock) => stock.symbol === symbol)) {
      message.error(`股票 ${symbol} 已存在于列表中`);
      return;
    }

    setAddingStock(true);
    try {
      // 使用真实API获取股票数据
      const { scoreData, detailData } = await StockApi.getStockAllData(symbol);

      // 类型安全的属性访问
      const getStringValue = (obj: unknown, key: string, fallback: string): string => {
        if (obj && typeof obj === 'object' && key in obj) {
          const value = (obj as Record<string, unknown>)[key];
          return typeof value === 'string' ? value : fallback;
        }
        return fallback;
      };

      const getNumberValue = (obj: unknown, key: string, fallback: number): number => {
        if (obj && typeof obj === 'object' && key in obj) {
          const value = (obj as Record<string, unknown>)[key];
          return typeof value === 'number' ? value : fallback;
        }
        return fallback;
      };

      const getNestedValue = (obj: unknown, path: string[], fallback: string): string => {
        let current: unknown = obj;
        for (const key of path) {
          if (current && typeof current === 'object' && key in current) {
            current = (current as Record<string, unknown>)[key];
          } else {
            return fallback;
          }
        }
        return typeof current === 'string' ? current : fallback;
      };

      // 创建新的股票列表项
      const newStock: StockListItem = {
        id: symbol,
        symbol: symbol,
        company_name: getStringValue(
          detailData,
          'company_name',
          getStringValue(detailData, 'symbol', symbol)
        ),
        current_price: getNumberValue(detailData, 'current_price', 0),
        change: getNumberValue(detailData, 'change', 0),
        change_percent: getNumberValue(detailData, 'change_percent', 0),
        exchange: getStringValue(detailData, 'exchange', 'Unknown'),
        market_cap: getStringValue(
          detailData,
          'market_cap',
          getNestedValue(detailData, ['financial_metrics', 'market_cap'], 'N/A')
        ),
        volume: getStringValue(detailData, 'volume', 'N/A'),
        pe_ratio: getNumberValue(
          detailData,
          'pe_ratio',
          getNumberValue(
            detailData && typeof detailData === 'object' && 'financial_metrics' in detailData
              ? (detailData as { financial_metrics?: unknown }).financial_metrics
              : null,
            'pe_ratio',
            0
          )
        ),
        sector: getStringValue(
          detailData,
          'sector',
          getNestedValue(detailData, ['company_info', 'sector'], 'Unknown')
        ),
        industry: getStringValue(
          detailData,
          'industry',
          getNestedValue(detailData, ['company_info', 'industry'], 'Unknown')
        ),
        rating: getStringValue(scoreData, 'decision', 'Hold'),
        score: getNumberValue(scoreData, 'total_score', 0),
      };

      // 添加到股票列表
      const updatedList = [...stockList, newStock];
      setStockList(updatedList);

      message.success(`股票 ${symbol} 添加成功`);
      setAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('添加股票失败:', error);
      message.error(`添加股票失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setAddingStock(false);
    }
  };

  // 处理添加股票模态框
  const handleAddModalOk = () => {
    form.validateFields().then(handleAddStock);
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
    form.resetFields();
  };

  // 表格列定义
  const columns = [
    {
      title: '股票',
      key: 'stock',
      width: isMobile ? 120 : 200,
      render: (record: StockListItem) => (
        <Space>
          <Avatar
            size={isMobile ? 32 : 40}
            icon={<StockOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
              {record.symbol}
            </div>
            <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#666' }}>
              {record.company_name}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '价格',
      key: 'price',
      width: isMobile ? 100 : 120,
      render: (record: StockListItem) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: isMobile ? '12px' : '14px' }}>
            ${record.current_price}
          </div>
          <div
            style={{
              color: getChangeColor(record.change),
              fontSize: isMobile ? '10px' : '12px',
            }}
          >
            {record.change >= 0 ? '+' : ''}
            {record.change} ({record.change_percent}%)
          </div>
        </div>
      ),
    },
    {
      title: '市值',
      key: 'market_cap',
      width: isMobile ? 80 : 100,
      render: (record: StockListItem) => (
        <Text style={{ fontSize: isMobile ? '11px' : '12px' }}>{record.market_cap}</Text>
      ),
    },
    {
      title: 'P/E',
      key: 'pe_ratio',
      width: isMobile ? 60 : 80,
      render: (record: StockListItem) => (
        <Text style={{ fontSize: isMobile ? '11px' : '12px' }}>{record.pe_ratio}</Text>
      ),
    },
    {
      title: '评级',
      key: 'rating',
      width: isMobile ? 80 : 100,
      render: (record: StockListItem) => (
        <Tag color={getRatingColor(record.rating)} style={{ fontSize: isMobile ? '10px' : '12px' }}>
          {record.rating}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: isMobile ? 80 : 100,
      render: (record: StockListItem) => (
        <Button
          type="primary"
          size={isMobile ? 'small' : 'middle'}
          onClick={() => router.push(`/toolkit/stock/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? '12px' : '24px' }}>
      {/* 页面标题 */}
      <Card variant="borderless" style={{ marginBottom: '24px' }}>
        <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
          股票列表
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>
          查看和分析多只股票的基本信息
        </Text>
      </Card>

      {/* 搜索和过滤区域 */}
      <Card variant="borderless" style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索股票代码或公司名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              size={isMobile ? 'middle' : 'large'}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="行业"
              value={filterSector}
              onChange={setFilterSector}
              style={{ width: '100%' }}
              size={isMobile ? 'middle' : 'large'}
            >
              <Option value="all">所有行业</Option>
              {sectors.map((sector) => (
                <Option key={sector} value={sector}>
                  {sector}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="评级"
              value={filterRating}
              onChange={setFilterRating}
              style={{ width: '100%' }}
              size={isMobile ? 'middle' : 'large'}
            >
              <Option value="all">所有评级</Option>
              <Option value="Buy">买入</Option>
              <Option value="Hold">持有</Option>
              <Option value="Avoid">避免</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Text type="secondary">共 {filteredData.length} 只股票</Text>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAddModalVisible(true)}
                  size={isMobile ? 'middle' : 'large'}
                >
                  添加股票
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 股票列表表格 */}
      <Card variant="borderless">
        <div style={{ overflowX: 'auto' }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{
              pageSize: isMobile ? 10 : 15,
              showSizeChanger: !isMobile,
              showQuickJumper: !isMobile,
              showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
            }}
            size={isMobile ? 'small' : 'middle'}
            scroll={{ x: isMobile ? 600 : undefined }}
          />
        </div>
      </Card>

      {/* 添加股票模态框 */}
      <Modal
        title="添加股票"
        open={addModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        confirmLoading={addingStock}
        okText="添加"
        cancelText="取消"
        width={isMobile ? '90%' : 500}
      >
        <Form form={form} layout="vertical" onFinish={handleAddStock}>
          <Form.Item
            name="symbol"
            label="股票代码"
            rules={[
              { required: true, message: '请输入股票代码' },
              { min: 1, max: 10, message: '股票代码长度应在1-10个字符之间' },
              {
                pattern: /^[A-Za-z]+$/,
                message: '股票代码只能包含字母',
              },
            ]}
          >
            <Input
              placeholder="例如: AAPL, MSFT, GOOGL"
              size="large"
              autoFocus
              onPressEnter={() => form.validateFields().then(handleAddStock)}
            />
          </Form.Item>

          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
            }}
          >
            <Text type="secondary" style={{ fontSize: '12px' }}>
              💡 提示：输入股票代码后，系统会自动从服务器获取股票数据并添加到列表中。
            </Text>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
