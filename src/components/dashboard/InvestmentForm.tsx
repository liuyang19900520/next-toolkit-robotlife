/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Form, Input, Select, InputNumber, Modal } from 'antd';
import type { Investment } from '@/types';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

import { TYPE1_OPTIONS, getType2Options } from '@/config/categories';

interface InvestmentFormProps {
  open: boolean;
  loading: boolean;
  title: string;
  initialValues?: Partial<Investment>;
  onOk: (values: any) => void;
  onCancel: () => void;
}

export default function InvestmentForm({
  open,
  loading,
  title,
  initialValues,
  onOk,
  onCancel,
}: InvestmentFormProps) {
  const [form] = Form.useForm();
  const isMobile = useIsMobile();

  // Watch type1 for cascading dropdown
  const selectedType1 = Form.useWatch('type1', form);
  const type2Options = selectedType1 ? getType2Options(selectedType1) : [];

  // 当 initialValues 改变时重置表单
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [form, initialValues, open]);
  return (
    <Modal
      open={open}
      title={title}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      width={isMobile ? '90%' : 600}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="year"
          label="年月"
          rules={[
            { required: true, message: '请输入年月' },
            { pattern: /^\d{6}$/, message: '格式必须为6位数字，如 202512' },
          ]}
        >
          <Input placeholder="例如：202512" />
        </Form.Item>

        <Form.Item
          name="type1"
          label="大类别"
          rules={[{ required: true, message: '请选择大类别' }]}
        >
          <Select options={TYPE1_OPTIONS} onChange={() => form.setFieldValue('type2', undefined)} />
        </Form.Item>

        <Form.Item
          name="type2"
          label="小类别"
          rules={[{ required: true, message: '请选择小类别' }]}
        >
          <Select options={type2Options} disabled={!selectedType1 && type2Options.length === 0} />
        </Form.Item>

        <Form.Item name="target" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="currency" label="货币" rules={[{ required: true, message: '请选择货币' }]}>
          <Select
            options={[
              { value: 'USD', label: 'USD' },
              { value: 'CNY', label: 'CNY' },
              { value: 'JPY', label: 'JPY' },
            ]}
          />
        </Form.Item>

        <Form.Item name="account" label="账号" rules={[{ required: true, message: '请输入账号' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="owner" label="所属" rules={[{ required: true, message: '请输入所属' }]}>
          <Select
            options={[
              { value: '李娇', label: '李娇' },
              { value: '刘洋', label: '刘洋' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
