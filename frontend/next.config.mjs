/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "safraskin.online" }],
  },
  async redirects() {
    return [
      { source: "/products/freshguard", destination: "/products/oralflora", permanent: true },
      { source: "/products/heatshield", destination: "/products/cyclecalm", permanent: true },
      { source: "/products/underguard", destination: "/products/clearbalance", permanent: true },
      { source: "/products/confidence", destination: "/products/oralflora", permanent: true },
    ];
  },
};

export default nextConfig;
