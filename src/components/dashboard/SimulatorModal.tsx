import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Table, InputNumber, Select } from 'antd';
import { Investment } from '@/types';
import { INVESTMENT_CATEGORIES } from '@/config/categories';
import PieChartCard from './PieChartCard';
import {
  getRmbPieChartData,
  getNonRmbPieChartData,
  getTotalPieChartData,
} from '@/utils/chartDataUtils';
import { useIsMobile } from '@/hooks/useIsMobile';

interface SimulatorModalProps {
  visible: boolean;
  onClose: () => void;
  initialInvestments: Investment[];
  rates: { USDJPY: number; USDCNY: number; JPYUSD: number; JPYCNY: number };
}

interface SimulatorRow {
  id: string;
  type1: string;
  type2: string;
  amount: number | null;
  currency: 'CNY' | 'JPY' | 'USD';
}

export default function SimulatorModal({
  visible,
  onClose,
  initialInvestments,
  rates,
}: SimulatorModalProps) {
  const isMobile = useIsMobile();
  const [rows, setRows] = useState<SimulatorRow[]>([]);

  // Drill-down states
  const [activeRmbCategory, setActiveRmbCategory] = useState<string | null>(null);
  const [activeNonRmbCategory, setActiveNonRmbCategory] = useState<string | null>(null);
  const [activeTotalCategory, setActiveTotalCategory] = useState<string | null>(null);

  // Initialize rows from initialInvestments (latest year)
  useEffect(() => {
    if (!visible) return;

    let latestYearData = initialInvestments;
    if (latestYearData.length > 0) {
      const years = latestYearData.map((item) => Number(item.year)).filter(Boolean);
      if (years.length > 0) {
        const latestYear = String(Math.max(...years));
        latestYearData = latestYearData.filter((item) => item.year === latestYear);
      }
    }

    const initialRows: SimulatorRow[] = [];
    Object.entries(INVESTMENT_CATEGORIES).forEach(([type1, type2s]) => {
      type2s.forEach((type2) => {
        const matches = latestYearData.filter((i) => i.type1 === type1 && i.type2 === type2);
        let amount = 0;
        let currency: 'CNY' | 'JPY' | 'USD' = 'JPY'; // Default to JPY unless CNY dominant

        if (matches.length > 0) {
          currency = matches[0].currency as 'CNY' | 'JPY' | 'USD'; // take first currency as default
          amount = matches.reduce((sum, item) => {
            if (item.currency === currency) return sum + Number(item.price);

            // convert to chosen currency
            let jpyPrice = Number(item.price);
            if (item.currency === 'USD') jpyPrice *= rates.USDJPY;
            if (item.currency === 'CNY') jpyPrice *= rates.USDJPY / rates.USDCNY;

            if (currency === 'JPY') return sum + jpyPrice;
            if (currency === 'CNY') return sum + jpyPrice / (rates.USDJPY / rates.USDCNY);
            if (currency === 'USD') return sum + jpyPrice / rates.USDJPY;
            return sum;
          }, 0);
        }

        initialRows.push({
          id: `${type1}-${type2}`,
          type1,
          type2,
          amount: amount === 0 ? null : Math.round(amount),
          currency,
        });
      });
    });

    setRows(initialRows);
  }, [visible, initialInvestments, rates]);

  const handleRowChange = (
    id: string,
    field: keyof SimulatorRow,
    value: string | number | null
  ) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const simulatedInvestments = useMemo(() => {
    return rows.map((r, idx) => ({
      id: idx + 9999000,
      year: '999999', // dummy latest year
      type1: r.type1,
      type2: r.type2,
      target: r.type2,
      price: r.amount || 0,
      currency: r.currency,
    })) as Investment[];
  }, [rows]);

  const rmbPieData = useMemo(
    () => getRmbPieChartData(simulatedInvestments, activeRmbCategory),
    [simulatedInvestments, activeRmbCategory]
  );
  const nonRmbPieData = useMemo(
    () => getNonRmbPieChartData(simulatedInvestments, activeNonRmbCategory, rates),
    [simulatedInvestments, activeNonRmbCategory, rates]
  );
  const totalPieData = useMemo(
    () => getTotalPieChartData(simulatedInvestments, activeTotalCategory, rates),
    [simulatedInvestments, activeTotalCategory, rates]
  );

  const rmbTotal = rmbPieData.reduce((sum, item) => sum + item.value, 0);
  const nonRmbTotal = nonRmbPieData.reduce((sum, item) => sum + item.value, 0);
  const totalTotal = totalPieData.reduce((sum, item) => sum + item.value, 0);

  const columns = [
    {
      title: '大类 (Type 1)',
      dataIndex: 'type1',
      key: 'type1',
      width: 120,
      onCell: (record: SimulatorRow, index?: number) => {
        // Row span logic for grouping Type1 visually
        if (index === undefined) return {};
        const firstIndex = rows.findIndex((r) => r.type1 === record.type1);
        if (index === firstIndex) {
          return { rowSpan: rows.filter((r) => r.type1 === record.type1).length };
        }
        return { rowSpan: 0 };
      },
    },
    {
      title: '小类 (Type 2)',
      dataIndex: 'type2',
      key: 'type2',
      width: 150,
    },
    {
      title: '币种 (Currency)',
      dataIndex: 'currency',
      key: 'currency',
      width: 120,
      render: (text: string, record: SimulatorRow) => (
        <Select
          value={text}
          onChange={(val) => handleRowChange(record.id, 'currency', val)}
          options={[
            { label: 'JPY (日元)', value: 'JPY' },
            { label: 'CNY (人民币)', value: 'CNY' },
            { label: 'USD (美元)', value: 'USD' },
          ]}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: '模拟金额 (Amount)',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number | null, record: SimulatorRow) => (
        <InputNumber
          value={text}
          onChange={(val) => handleRowChange(record.id, 'amount', val)}
          style={{ width: '100%' }}
          placeholder="0"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number}
        />
      ),
    },
  ];

  return (
    <Modal
      title="饼图模拟器 (Pie Chart Simulator)"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      style={{ top: 20 }}
      destroyOnClose
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <PieChartCard
            title="人民币资产分布"
            totalLabel="人民币总额"
            activeCategory={activeRmbCategory}
            onCategoryChange={setActiveRmbCategory}
            totalValue={rmbTotal}
            currencySymbol="¥"
            data={rmbPieData}
            isMobile={isMobile}
          />
        </Col>
        <Col xs={24} lg={8}>
          <PieChartCard
            title="非人民币资产分布 (折算日元)"
            totalLabel="非人民币总额"
            activeCategory={activeNonRmbCategory}
            onCategoryChange={setActiveNonRmbCategory}
            totalValue={nonRmbTotal}
            currencySymbol="円"
            data={nonRmbPieData}
            isMobile={isMobile}
          />
        </Col>
        <Col xs={24} lg={8}>
          <PieChartCard
            title="整体资产分布 (折算日元)"
            totalLabel="整体资产总额"
            activeCategory={activeTotalCategory}
            onCategoryChange={setActiveTotalCategory}
            totalValue={totalTotal}
            currencySymbol="円"
            data={totalPieData}
            isMobile={isMobile}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Table
          dataSource={rows}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ y: 400 }}
          size="small"
          bordered
        />
      </div>
    </Modal>
  );
}
