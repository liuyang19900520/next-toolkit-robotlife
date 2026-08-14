import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fully static site: the build emits out/ with no Node runtime.
  // To restore API routes / SSR, delete both `output` and `images`.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
