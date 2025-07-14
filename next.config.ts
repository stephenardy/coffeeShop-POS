import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      new URL(
        "https://hxjpymtjxigrxgtvchdv.supabase.co/storage/v1/object/public/menu-images/**"
      ),
    ],
  },
};

export default nextConfig;
