/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ant-design/icons', 'antd', 'rc-util', 'rc-pagination', 'rc-picker'],
  env: {
    DB_ACCESS_KEY_ID: process.env.DB_ACCESS_KEY_ID || '',
    DB_SECRET_ACCESS_KEY: process.env.DB_SECRET_ACCESS_KEY || '',
  },
};

export default nextConfig;
