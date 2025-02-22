/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Form, Input, Select, InputNumber, Modal } from 'antd';
import { Investment } from '@/utils/api/investment';

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
    onCancel
}: InvestmentFormProps) {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title={title}
            okText="确定"
            cancelText="取消"
            confirmLoading={loading}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        onOk(values);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
            >
                <Form.Item
                    name="year"
                    label="年份"
                    rules={[{ required: true, message: '请输入年份' }]}
                >
                    <Input />

                </Form.Item>

                <Form.Item
                    name="type1"
                    label="大类别"
                    rules={[{ required: true, message: '请选择大类别' }]}
                >
                    <Select
                        options={[
                            { value: '股票', label: '股票' },
                            { value: '债券', label: '债券' },
                            { value: '大宗', label: '大宗' },
                            { value: '现金', label: '现金' },
                            { value: '加密货币', label: '加密货币' },
                            { value: 'ideco', label: 'ideco' },

                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="type2"
                    label="小类别"
                    rules={[{ required: true, message: '请选择小类别' }]}
                >
                    <Select
                        options={[
                            { value: '美股', label: '美股' },
                            { value: 'A股', label: 'A股' },
                            { value: '日股', label: '日股' },
                            { value: '基金', label: '基金' },
                            { value: '加密货币', label: '加密货币' },
                            { value: 'ideco', label: 'ideco' },
                            { value: '现金', label: '现金' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="target"
                    label="名称"
                    rules={[{ required: true, message: '请输入名称' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="价格"
                    rules={[{ required: true, message: '请输入价格' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="currency"
                    label="货币"
                    rules={[{ required: true, message: '请选择货币' }]}
                >
                    <Select
                        options={[
                            { value: 'USD', label: 'USD' },
                            { value: 'CNY', label: 'CNY' },
                            { value: 'JPY', label: 'JPY' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="account"
                    label="账号"
                    rules={[{ required: true, message: '请输入账号' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="owner"
                    label="所属"
                    rules={[{ required: true, message: '请输入所属' }]}
                >
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