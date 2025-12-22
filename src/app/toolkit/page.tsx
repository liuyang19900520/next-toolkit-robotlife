import type { Metadata } from 'next';
import ToolkitContent from './ToolkitContent';

export const metadata: Metadata = {
  title: '工具管理 | RobotLife',
  description: '工具管理系统 - 投资计算器、股票分析等实用工具',
};

export default function ToolkitsPage() {
  return <ToolkitContent />;
}
