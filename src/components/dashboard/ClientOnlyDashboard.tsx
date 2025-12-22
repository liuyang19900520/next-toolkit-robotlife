'use client';

import dynamic from 'next/dynamic';

// 动态导入 Dashboard 组件
const Dashboard = dynamic(() => import('./Dashboard'), {
    loading: () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
        }}>
            <div>加载中...</div>
        </div>
    )
});

interface ClientOnlyDashboardProps {
    selectedKey: string;
}

export default function ClientOnlyDashboard({ selectedKey }: ClientOnlyDashboardProps) {
    return <Dashboard selectedKey={selectedKey} />;
}
