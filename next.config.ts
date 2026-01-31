import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Configuração para Next.js 15+
  serverExternalPackages: ["typeorm", "pg"],
  
  // 2. Configuração de compatibilidade para Next.js 13/14
  experimental: {
    serverComponentsExternalPackages: ["typeorm", "pg"],
  },

  // 3. Solução Nuclear: Define __dirname manualmente no build do Webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [{ module: /node_modules/ }];
      
      // Isso engana bibliotecas que buscam por __dirname
      config.plugins.push(
        new (require("webpack").DefinePlugin)({
          "global.GENTLY": false,
          __dirname: JSON.stringify(process.cwd()),
        })
      );
    }
    return config;
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;