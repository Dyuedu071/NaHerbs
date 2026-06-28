import { loadEnvConfig } from '@next/env';
import path from 'path';

// Load .env from the monorepo root
loadEnvConfig(path.join(process.cwd(), '..'));

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
