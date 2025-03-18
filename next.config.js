/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'via.placeholder.com'],
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_FETCH_URL: process.env.NEXT_PUBLIC_FETCH_URL,
   
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin',
        permanent: true,
        basePath: false,
      },
    ];
  },
  basePath: '/admin', // Set the base path to /admin
  assetPrefix: '/admin',
 
}

module.exports = nextConfig
