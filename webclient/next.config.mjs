import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: 'theme.config.tsx',
  staticImage: true,
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images:{
    domains: ['raw.githubusercontent.com','avatars.githubusercontent.com','aceternity.com'],
  },
};

// eslint-disable-next-line import/no-default-export
export default withNextra(nextConfig);
