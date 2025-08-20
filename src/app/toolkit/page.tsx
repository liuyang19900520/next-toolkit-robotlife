'use client';

import { Layout, Menu, theme, Button, Drawer } from 'antd';
import { AppstoreOutlined, FormOutlined, SettingOutlined, ToolOutlined, MenuOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import ClientOnlyDashboard from '@/app/toolkit/dashboard/components/ClientOnlyDashboard';
import StockRookiePage from '@/app/toolkit/dashboard/components/StockRookiePage';
import TestApiPage from '../test-api/page';

const { Header, Sider, Content } = Layout;

export default function ToolkitsPage() {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 检测屏幕大小
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <AppstoreOutlined />,
      label: '年末计算器',
    },
    {
      key: 'stock-rookie',
      icon: <AppstoreOutlined />,
      label: 'Stock Rookie',
    },
    {
      key: 'test-api',
      icon: <ToolOutlined />,
      label: 'API测试',
    },
    {
      key: 'cases',
      icon: <FormOutlined />,
      label: '問診票',
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
        return <ClientOnlyDashboard selectedKey={selectedKey} />;
      case 'stock-rookie':
        return <StockRookiePage />;
      case 'test-api':
        return <TestApiPage />;
      case 'cases':
        return <iframe
          src="https://master.d2bg3wzre4yxa0.amplifyapp.com"
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
          }}
        />;
      case 'tools':
        return <h3>AWS配置内容</h3>;
      case 'settings':
        return <h3>设置内容</h3>;
      default:
        return <ClientOnlyDashboard selectedKey={selectedKey} />;
    }
  };

  // 侧边栏内容
  const sidebarContent = (
    <>
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
        onClick={({ key }) => {
          setSelectedKey(key);
          if (isMobile) {
            setDrawerVisible(false);
          }
        }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 桌面端侧边栏 */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
        >
          {sidebarContent}
        </Sider>
      )}

      {/* 移动端抽屉菜单 */}
      {isMobile && (
        <Drawer
          title="菜单"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
          width={280}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Layout>
        <Header style={{
          padding: 0,
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            padding: isMobile ? '0 12px' : '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                style={{ fontSize: '16px' }}
              />
            )}
            <h2 style={{
              margin: 0,
              fontSize: isMobile ? '16px' : '20px'
            }}>
              工具管理系统
            </h2>
          </div>
        </Header>
        <Content style={{
          margin: isMobile ? '8px' : '16px'
        }}>
          <div style={{
            padding: isMobile ? 12 : 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
