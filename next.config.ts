import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isso diz ao Next.js: "Não tente empacotar o TypeORM, deixe ele rodar nativo no servidor"
  serverExternalPackages: ["typeorm", "pg"],

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