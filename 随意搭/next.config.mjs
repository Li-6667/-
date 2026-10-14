import { legacyRoutes } from './scripts/legacy/routes.mjs';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return legacyRoutes.map(route => ({
      source: `/legacy${route ? `/${route}` : ''}`,
      destination: `/legacy/${route ? `${route}.html` : 'index.html'}`,
    }));
  },
};
export default nextConfig;
