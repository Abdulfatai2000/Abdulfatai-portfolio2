import type { NextConfig } from "next";
const nextConfig: NextConfig = {async rewrites(){return [{source:"/",destination:"/original.html"}]}};
export default nextConfig;
