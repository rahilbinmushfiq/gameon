/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "static.thenounproject.com", "firebasestorage.googleapis.com", "180dc.org"]
  }
}

module.exports = nextConfig
