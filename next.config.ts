import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADICIONE ESTA LINHA:
  // Isso impede que o Next.js tente empacotar o TypeORM e o Postgres, 
  // permitindo que eles acessem recursos nativos do Node (como __dirname)
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