import React from 'react';
import { Card, Space, Button } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#7A99A1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

interface PieChartCardProps {
  title: string;
  totalLabel: string;
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  totalValue: number;
  currencySymbol: string;
  data: Array<{ type: string; value: number }>;
  isMobile: boolean;
  height?: number;
}

export default function PieChartCard({
  title,
  totalLabel,
  activeCategory,
  onCategoryChange,
  totalValue,
  currencySymbol,
  data,
  isMobile,
  height = 300,
}: PieChartCardProps) {
  return (
    <Card
      title={
        <Space>
          <span>{title}</span>
          {activeCategory && (
            <>
              <span style={{ color: '#bfbfbf' }}>/</span>
              <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{activeCategory}</span>
            </>
          )}
        </Space>
      }
      extra={
        <Space>
          {activeCategory && (
            <Button
              size="small"
              onClick={() => onCategoryChange(null)}
              style={{ fontSize: '12px' }}
            >
              返回一级分类
            </Button>
          )}
        </Space>
      }
      variant="borderless"
    >
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <PieChart>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: '#666', fontWeight: 500 }}
            >
              <tspan
                x="50%"
                dy={isMobile ? '-8px' : '-10px'}
                fontSize={isMobile ? '10px' : '12px'}
                fill="#8c8c8c"
              >
                {activeCategory ? `${activeCategory}总额` : totalLabel}
              </tspan>
              <tspan
                x="50%"
                dy={isMobile ? '16px' : '20px'}
                fontWeight="bold"
                fill="#262626"
                fontSize={isMobile ? '12px' : '15px'}
              >
                {`${totalValue.toLocaleString()} ${currencySymbol}`}
              </tspan>
            </text>
            <Pie
              data={data}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 45 : 60}
              outerRadius={isMobile ? 65 : 85}
              paddingAngle={2}
              label={
                isMobile
                  ? false
                  : ({ name, value, percent }) =>
                      `${name}: ${value.toLocaleString()}${currencySymbol} (${(percent * 100).toFixed(2)}%)`
              }
              onClick={(entry) => {
                if (!activeCategory && entry && entry.type) {
                  onCategoryChange(entry.type);
                }
              }}
              style={{ cursor: !activeCategory ? 'pointer' : 'default' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value) => `${Number(value).toLocaleString()} ${currencySymbol}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
