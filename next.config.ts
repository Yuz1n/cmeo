import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Garante que o TypeORM rode no Node nativo, não no bundle
  serverExternalPackages: ["typeorm", "pg", "reflect-metadata"],

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignora avisos chatos do TypeORM
      config.ignoreWarnings = [{ module: /node_modules/ }];
      
      // Define __dirname globalmente como string vazia ou cwd para evitar o ReferenceError
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