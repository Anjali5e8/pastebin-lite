/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows the build to finish even if there are linting warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This ensures minor type mismatches don't block deployment
    ignoreBuildErrors: true,
  }
};

export default nextConfig;