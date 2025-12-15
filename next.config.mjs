/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2bpblxcbrb9ld.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
