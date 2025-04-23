/** @type {import('next').NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      { hostname: "cdn.sanity.io" },
      { hostname: "munchies.medusajs.app" },
      { hostname: "tinloof-munchies.s3.eu-north-1.amazonaws.com" },
      { hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
      { hostname: "s3.eu-central-1.amazonaws.com" },
      { hostname: "amousax-test-bucket.s3.eu-west-2.amazonaws.com" }
    ],
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === "production",
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    taint: true,
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },

  rewrites() {
    return [
      {
        source:
          "/:path((?!sa|dk|fr|de|es|jp|gb|ca/|ar|za|mx|my|au/|nz|dz|br|cms|api|images|icons|favicon.ico|sections|favicon-inactive.ico).*)",
        destination: "/sa/:path*",
      },
    ];
  },
};

export default config;
