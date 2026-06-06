'use client';

import React, { useState } from 'react';
import { Button, Modal, Table, Select, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Papa from 'papaparse';
import { TYPE1_OPTIONS, getType2Options } from '@/config/categories';
import mappingRules from '@/config/categoryMappingRules.json';

interface CsvUploaderProps {
  onSuccess: () => void;
}

interface ParsedItem {
  key: string;
  name: string;
  originalType: string;
  originalJPY: number;
  originalUSD: number;
  type1: string;
  type2: string;
}

export default function CsvUploader({ onSuccess }: CsvUploaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedItem[]>([]);
  const [targetYearMonth, setTargetYearMonth] = useState<string>('');
  const [targetAccount, setTargetAccount] = useState<string>('乐天证券');
  const [targetOwner, setTargetOwner] = useState<string>('刘洋');

  const getDefaultYearMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
  };

  const autoCategorize = (
    type: string,
    name: string,
    ticker: string
  ): { type1: string; type2: string } => {
    // 1. Check exact type mapping
    if (mappingRules.typeMapping[type as keyof typeof mappingRules.typeMapping]) {
      return mappingRules.typeMapping[type as keyof typeof mappingRules.typeMapping];
    }

    // 2. Check US Stocks by Ticker
    if (type === '米国株式') {
      const specificMappings = mappingRules.usStockTickers.SPECIFIC_MAPPINGS as Record<
        string,
        { type1: string; type2: string }
      >;
      if (specificMappings && specificMappings[ticker]) {
        return specificMappings[ticker];
      }
      if (mappingRules.usStockTickers.NASDAQ.includes(ticker)) {
        return { type1: '股票', type2: '纳斯达克' };
      }
      return mappingRules.usStockTickers.SP500_DEFAULT;
    }

    // 3. Check Mutual Funds by Name Keywords
    if (type === '投資信託') {
      for (const rule of mappingRules.fundNameKeywords) {
        if (name.includes(rule.keyword)) {
          return { type1: rule.type1, type2: rule.type2 };
        }
      }
    }

    // 4. Default fallback
    return mappingRules.default;
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    // Rakuten CSV uses Shift_JIS encoding
    reader.readAsText(file, 'Shift_JIS');
    reader.onload = (e) => {
      const csvText = e.target?.result as string;

      // Extract the detailed assets section
      const lines = csvText.split('\n');
      const detailStartIndex = lines.findIndex((line) => line.includes('■ 保有商品詳細 (すべて）'));

      if (detailStartIndex === -1) {
        message.error('CSV format not recognized. Cannot find detail section.');
        return;
      }

      // Find the header row after the detail section title
      let headerIndex = -1;
      for (let i = detailStartIndex + 1; i < lines.length; i++) {
        if (lines[i].includes('種別')) {
          headerIndex = i;
          break;
        }
      }

      if (headerIndex === -1) {
        message.error('CSV format not recognized. Cannot find detail headers.');
        return;
      }

      // Join the relevant lines to parse
      const relevantCsv = lines.slice(headerIndex).join('\n');

      Papa.parse(relevantCsv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const items: ParsedItem[] = [];
          (results.data as Record<string, string>[]).forEach((row, index) => {
            const type = row['種別'];
            const ticker = row['銘柄コード・ティッカー'] || '';
            const name = row['銘柄'] || type; // Fallback to type if name is empty
            const jpyStr = row['時価評価額[円]'];
            const foreignStr = row['時価評価額[外貨]'];

            if (!jpyStr || jpyStr === '-' || !type) return;

            // Parse numeric value (remove commas)
            const jpyValue = parseFloat(jpyStr.replace(/,/g, ''));
            if (isNaN(jpyValue) || jpyValue <= 0) return;

            let usdValue = 0;
            if (foreignStr && foreignStr.includes('USD')) {
              usdValue = parseFloat(foreignStr.replace(/,/g, '').replace(' USD', '').trim());
            }

            const cat = autoCategorize(type, name, ticker);

            items.push({
              key: `item-${index}`,
              name: ticker ? `[${ticker}] ${name}` : name,
              originalType: type,
              originalJPY: jpyValue,
              originalUSD: isNaN(usdValue) ? 0 : usdValue,
              type1: cat.type1,
              type2: cat.type2,
            });
          });

          if (items.length === 0) {
            message.warning('No valid items found in the CSV.');
            return;
          }

          setParsedData(items);
          setTargetYearMonth(getDefaultYearMonth());
          setIsModalOpen(true);
        },
        error: (error: Error) => {
          message.error(`Error parsing CSV: ${error.message}`);
        },
      });
    };
    return false; // Prevent default upload behavior
  };

  const handleSave = async () => {
    if (!/^\d{6}$/.test(targetYearMonth)) {
      message.error('年月必须是6位数字，如 202512');
      return;
    }

    setLoading(true);

    // Prepare payload for API
    const payload = parsedData.map((item) => ({
      year: targetYearMonth,
      type1: item.type1,
      type2: item.type2,
      target: item.name,
      originalUSD: item.originalUSD,
      originalJPY: item.originalJPY,
      originalCNY: 0,
      price: item.originalUSD > 0 ? item.originalUSD : item.originalJPY,
      currency: item.originalUSD > 0 ? 'USD' : 'JPY',
      account: targetAccount,
      owner: targetOwner,
    }));

    try {
      const res = await fetch('/api/investment/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        message.success(`成功导入 ${data.count} 条记录`);
        setIsModalOpen(false);
        onSuccess();
      } else {
        message.error(data.error || '导入失败');
      }
    } catch {
      message.error('网络错误，导入失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (value: string, key: string, field: 'type1' | 'type2') => {
    setParsedData((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          const updated = { ...item, [field]: value };
          // If changing large category, reset small category to the first available
          if (field === 'type1') {
            const newOptions = getType2Options(value);
            updated.type2 = newOptions.length > 0 ? newOptions[0].value : '';
          }
          return updated;
        }
        return item;
      })
    );
  };

  const columns = [
    {
      title: '资产名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ParsedItem) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.originalType}</div>
        </div>
      ),
    },
    {
      title: '日元估值 / 美元估值',
      dataIndex: 'originalJPY',
      key: 'originalJPY',
      render: (val: number, record: ParsedItem) => (
        <div>
          <div>¥ {val.toLocaleString()}</div>
          {record.originalUSD > 0 && (
            <div style={{ fontSize: '12px', color: '#52c41a' }}>
              $ {record.originalUSD.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '大分类',
      dataIndex: 'type1',
      key: 'type1',
      render: (val: string, record: ParsedItem) => (
        <Select
          value={val}
          options={TYPE1_OPTIONS}
          onChange={(e) => handleTypeChange(e, record.key, 'type1')}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: '小分类',
      dataIndex: 'type2',
      key: 'type2',
      render: (val: string, record: ParsedItem) => (
        <Select
          value={val}
          options={getType2Options(record.type1)}
          onChange={(e) => handleTypeChange(e, record.key, 'type2')}
          style={{ width: 150 }}
        />
      ),
    },
  ];

  return (
    <>
      <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".csv">
        <Button icon={<UploadOutlined />} type="default">
          上传乐天 CSV
        </Button>
      </Upload>

      <Modal
        title="预览导入资产"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={loading}
        width={800}
        okText="确认保存"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <strong>导入目标年月：</strong>
            <Input
              value={targetYearMonth}
              onChange={(e) => setTargetYearMonth(e.target.value)}
              style={{ width: 100, marginLeft: 8 }}
              placeholder="如: 202606"
            />
          </div>
          <div>
            <strong>账户：</strong>
            <Input
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              style={{ width: 100, marginLeft: 8 }}
            />
          </div>
          <div>
            <strong>所属：</strong>
            <Select
              value={targetOwner}
              onChange={(val) => setTargetOwner(val)}
              style={{ width: 100, marginLeft: 8 }}
              options={[
                { value: '刘洋', label: '刘洋' },
                { value: '李娇', label: '李娇' },
              ]}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={parsedData}
          pagination={false}
          scroll={{ y: 400 }}
          size="small"
        />
      </Modal>
    </>
  );
}
