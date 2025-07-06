import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  // MDX 파일을 Client Component로 처리
  options: {
    providerImportSource: '@mdx-js/react',
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
      {
        hostname: 'images.unsplash.com',
      },
    ],
    domains: ['prod-files-secure.s3.us-west-2.amazonaws.com'],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

export default withMDX(nextConfig);
