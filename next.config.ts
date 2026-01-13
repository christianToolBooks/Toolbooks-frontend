import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['s3.us-east-1.amazonaws.com', 'bookkeeping-data-dev.s3.us-east-1.amazonaws.com', 'img.icons8.com', 'openclipart.org', 'plaid-merchant-logos.plaid.com', 'plaid-category-icons.plaid.com', 'cdn.example.com', 'res.cloudinary.com'],
    remotePatterns: [
        {
          protocol: 'https',
          hostname: 'plaid-merchant-logos.plaid.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'plaid-category-icons.plaid.com',
          pathname: '/**',
        },
      ],
  },

  transpilePackages: ["@react-pdf/renderer"],

  ///////
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    NEXT_PUBLIC_COGNITO_DOMAIN_URL: process.env.NEXT_PUBLIC_COGNITO_DOMAIN_URL,
    NEXT_PUBLIC_COGNITO_IDENTITY_PROVIDER: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_PROVIDER,
    NEXT_PUBLIC_COGNITO_REDIRECT_URI: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI,
    NEXT_PUBLIC_COGNITO_RESPONSE_TYPE: process.env.NEXT_PUBLIC_COGNITO_RESPONSE_TYPE,
    NEXT_PUBLIC_COGNITO_SCOPES: process.env.NEXT_PUBLIC_COGNITO_SCOPES,
    AUTH_SECRET: process.env.AUTH_SECRET, 
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
