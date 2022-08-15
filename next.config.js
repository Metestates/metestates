/** @type {import('next').NextConfig} */
const nextConfig = {

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  productionBrowserSourceMaps: true,

  sassOptions: {
    includePaths: [],
  },

//   basePath: process.env.NEXT_PUBLIC_BASE_PATH,

  reactStrictMode: true,

  async rewrites() {
    return [
      // Rewrite everything to `pages/index`
      {
        source: "/:any*",
        destination: "/",
      },
    ];
  },

  webpack: (config) => {

    config.experiments = {
      ...config.experiments,
      ...{ topLevelAwait: true },
    }

    return config

  },

  basePath: process.env.NEXTJS_BASE_PATH,

}

module.exports = nextConfig
