import React from 'react';
import { Form, Input, Button } from 'antd';
import { Stock } from '../types/stock';

interface StockFormProps {
  initialValues?: Partial<Stock>;
  onSubmit: (values: Partial<Stock>) => void;
}

const StockForm: React.FC<StockFormProps> = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      layout="vertical"
    >
      <Form.Item
        name="code"
        label="股票代码"
        rules={[{ required: true, message: '请输入股票代码' }]}
      >
        <Input placeholder="请输入股票代码" />
      </Form.Item>
      <Form.Item
        name="name"
        label="股票名称"
        rules={[{ required: true, message: '请输入股票名称' }]}
      >
        <Input placeholder="请输入股票名称" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StockForm;