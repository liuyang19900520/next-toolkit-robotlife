'use client';

import { Layout, Menu, theme } from 'antd';
import {
    AppstoreOutlined,
    ToolOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Dashboard from '@/app/toolkit/dashboard/components/Dashboard';

const { Header, Sider, Content } = Layout;

export default function ToolkitsPage() {
    const [selectedKey, setSelectedKey] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: 'dashboard',
            icon: <AppstoreOutlined />,
            label: '年末计算器',
        },
        {
            key: 'tools',
            icon: <ToolOutlined />,
            label: 'AWS配置',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '设置',
        },
    ];

    const renderContent = () => {
        switch (selectedKey) {
            case 'dashboard':
                return <Dashboard selectedKey={selectedKey} />;
            case 'tools':
                return <h3>AWS配置内容</h3>;
            case 'settings':
                return <h3>设置内容</h3>;
            default:
                return <Dashboard selectedKey={selectedKey} />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="light"
            >
                <div style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1890ff',
                    fontWeight: 'bold'
                }}>
                    RobotLife
                </div>
                <Menu
                    theme="light"
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    items={menuItems}
                    onClick={({ key }) => setSelectedKey(key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <div style={{ padding: '0 24px' }}>
                        <h2>工具管理系统</h2>
                    </div>
                </Header>
                <Content style={{ margin: '16px' }}>
                    <div style={{ padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                        {renderContent()}  {/* 当 selectedKey 为 'dashboard' 时，渲染 Dashboard 组件 */}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
