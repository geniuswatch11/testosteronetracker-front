/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, //Esta linea desactiva los errores en el build
  },
  typescript: {
    ignoreBuildErrors: true, //Esta linea desactiva los errores en el build
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
