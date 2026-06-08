'use client';

import React, { useState } from 'react';
import { Button, Modal, Table, Select, Input, InputNumber, message, Upload } from 'antd';
import { FileImageOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { TYPE1_OPTIONS, getType2Options } from '@/config/categories';
import mappingRules from '@/config/categoryMappingRules.json';

interface AlipayOcrImporterProps {
  onSuccess: () => void;
}

interface ParsedOcrItem {
  key: string;
  name: string;
  amount: number;
  type1: string;
  type2: string;
}

export default function AlipayOcrImporter({ onSuccess }: AlipayOcrImporterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeUploadsCount, setActiveUploadsCount] = useState(0);
  const uploading = activeUploadsCount > 0;
  const [parsedData, setParsedData] = useState<ParsedOcrItem[]>([]);
  const [targetYearMonth, setTargetYearMonth] = useState<string>('');
  const [targetAccount, setTargetAccount] = useState<string>('支付宝');
  const [targetOwner, setTargetOwner] = useState<string>('李娇');

  const getDefaultYearMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
  };

  // 支付宝资产自动分类规则
  const autoCategorize = (name: string): { type1: string; type2: string } => {
    // 1. 针对余额宝/余利宝等特定资产进行快速映射
    if (name.includes('余额宝') || name.includes('余利宝') || name.includes('活期')) {
      return { type1: '现金', type2: '活期' };
    }

    // 2. 针对国内常用基金名称的特定分类默认规则 (截图中所展示的默认分类)
    if (name.includes('创业板') || name.includes('科创') || name.includes('双创')) {
      return { type1: '股票', type2: '双创' };
    }

    if (
      name.includes('中证500') ||
      name.includes('沪深300') ||
      name.includes('沪港深') ||
      name.includes('蓝筹') ||
      name.includes('混合') ||
      name.includes('配置')
    ) {
      return { type1: '股票', type2: '沪深300/中证500' };
    }

    if (name.includes('债券') || name.includes('债') || name.includes('国开行')) {
      return { type1: '债券', type2: '中国' };
    }

    // 3. 匹配已有的基金关键字映射规则 (如 "债券", "黄金", "全世界", "创业板")
    for (const rule of mappingRules.fundNameKeywords) {
      if (name.includes(rule.keyword)) {
        return { type1: rule.type1, type2: rule.type2 };
      }
    }

    // 4. 默认兜底
    return mappingRules.default;
  };

  const handleFileUpload = (file: File) => {
    setActiveUploadsCount((prev) => prev + 1);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;

      try {
        const response = await fetch('/api/investment/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data }),
        });

        const result = await response.json();

        if (result.success) {
          if (!result.data || result.data.length === 0) {
            message.warning(`"${file.name}" 中未能识别到有效的持仓和金额信息`);
            return;
          }

          // 将 OCR 数据结合自动分类转为表格所需格式
          const items: ParsedOcrItem[] = result.data.map(
            (item: { name: string; amount: number }, index: number) => {
              const cat = autoCategorize(item.name);
              return {
                key: `ocr-${item.name}-${Date.now()}-${index}`,
                name: item.name,
                amount: item.amount,
                type1: cat.type1,
                type2: cat.type2,
              };
            }
          );

          // 累加并去重 (以资产名称做唯一 Key)
          setParsedData((prev) => {
            const combined = [...prev, ...items];
            const uniqueMap = new Map<string, ParsedOcrItem>();
            combined.forEach((it) => {
              uniqueMap.set(it.name, it);
            });
            const uniqueList = Array.from(uniqueMap.values());
            // 重新编号 key 保证稳定渲染
            return uniqueList.map((it, idx) => ({ ...it, key: `ocr-${idx}` }));
          });

          setTargetYearMonth(getDefaultYearMonth());
          setTargetAccount('支付宝');
          setTargetOwner('李娇');
          setIsModalOpen(true);
        } else {
          message.error(`"${file.name}" 识别失败: ${result.error}`);
        }
      } catch (error) {
        console.error('OCR Upload Error:', error);
        message.error(`"${file.name}" 网络请求失败，无法使用 OCR 服务`);
      } finally {
        setActiveUploadsCount((prev) => Math.max(0, prev - 1));
      }
    };

    return false; // 阻止默认的上传操作
  };

  const handleSave = async () => {
    if (!/^\d{6}$/.test(targetYearMonth)) {
      message.error('年月必须是6位数字，如 202606');
      return;
    }

    setLoading(true);

    // 将确认表格中的数据格式化为后端的 batch create 结构
    const payload = parsedData.map((item) => ({
      year: targetYearMonth,
      type1: item.type1,
      type2: item.type2,
      target: item.name,
      originalUSD: 0,
      originalJPY: 0,
      originalCNY: item.amount,
      price: item.amount,
      currency: 'CNY',
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
        message.success(`成功导入 ${data.count} 条支付宝持仓数据`);
        setParsedData([]);
        setIsModalOpen(false);
        onSuccess();
      } else {
        message.error(data.error || '数据导入失败');
      }
    } catch (error) {
      console.error('Batch save error:', error);
      message.error('保存失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  };

  // 单元格数据修改 handlers
  const handleItemFieldChange = (
    value: string | number | null,
    key: string,
    field: keyof ParsedOcrItem
  ) => {
    setParsedData((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          const updated = { ...item, [field]: value };
          // 切换大分类时，重置小分类为第一个可选的选项
          if (field === 'type1' && typeof value === 'string') {
            const newOptions = getType2Options(value);
            updated.type2 = newOptions.length > 0 ? newOptions[0].value : '';
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (key: string) => {
    setParsedData((prev) => prev.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: '资产名称 (可编辑)',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (text: string, record: ParsedOcrItem) => (
        <Input
          value={text}
          onChange={(e) => handleItemFieldChange(e.target.value, record.key, 'name')}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '持有金额 (CNY - 可编辑)',
      dataIndex: 'amount',
      key: 'amount',
      width: '20%',
      render: (val: number, record: ParsedOcrItem) => (
        <InputNumber
          value={val}
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0')}
          onChange={(val) => handleItemFieldChange(val, record.key, 'amount')}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '大分类',
      dataIndex: 'type1',
      key: 'type1',
      width: '15%',
      render: (val: string, record: ParsedOcrItem) => (
        <Select
          value={val}
          options={TYPE1_OPTIONS}
          onChange={(e) => handleItemFieldChange(e, record.key, 'type1')}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '小分类',
      dataIndex: 'type2',
      key: 'type2',
      width: '20%',
      render: (val: string, record: ParsedOcrItem) => (
        <Select
          value={val}
          options={getType2Options(record.type1)}
          onChange={(e) => handleItemFieldChange(e, record.key, 'type2')}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: '10%',
      align: 'center' as const,
      render: (_value: unknown, record: ParsedOcrItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.key)}
        />
      ),
    },
  ];

  return (
    <>
      <Upload
        beforeUpload={(file) => handleFileUpload(file as File)}
        showUploadList={false}
        accept="image/*"
        multiple={true}
      >
        <Button
          icon={uploading ? <LoadingOutlined /> : <FileImageOutlined />}
          type="primary"
          style={{ backgroundColor: '#1677ff', borderColor: '#1677ff' }}
          disabled={uploading}
        >
          {uploading ? '正在读取中...' : '支付宝截图导入'}
        </Button>
      </Upload>

      <Modal
        title="预览确认支付宝资产 (OCR 识别)"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setParsedData([]);
        }}
        onOk={handleSave}
        confirmLoading={loading}
        width={900}
        okText="确认保存并录入"
        cancelText="取消"
      >
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>导入年月：</strong>
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
                { value: '李娇', label: '李娇' },
                { value: '刘洋', label: '刘洋' },
              ]}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={parsedData}
          pagination={false}
          scroll={{ y: 450 }}
          size="small"
        />
      </Modal>
    </>
  );
}
