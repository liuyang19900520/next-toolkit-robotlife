declare module "next-plugin-antd-less" {
  import { NextConfig } from "next";
  function withAntdLess(config: NextConfig): NextConfig;
  export default withAntdLess;
}
