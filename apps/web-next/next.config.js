const { withNx } = require('@nx/next/plugins/with-nx');

const nextConfig = {
  nx: {
    svgr: false,
  },
  experimental: {
    externalDir: true,
  },
};

module.exports = withNx(nextConfig);
