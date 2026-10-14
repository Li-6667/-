import { legacyRoutes } from './scripts/legacy/routes.mjs';
import { fileURLToPath } from 'node:url';

const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  async rewrites() {
    return legacyRoutes.map(route => ({
      source: `/legacy${route ? `/${route}` : ''}`,
      destination: `/legacy/${route ? `${route}.html` : 'index.html'}`,
    }));
  },
};
export default nextConfig;
