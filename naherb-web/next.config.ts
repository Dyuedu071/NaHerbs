import fs from 'fs';
import path from 'path';
import type { NextConfig } from "next";

const envCandidates = [
  path.resolve(process.cwd(), ".env.frontend"),
  path.resolve(process.cwd(), "..", ".env.frontend"),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));
if (envPath) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  });
}

const nextConfig: NextConfig = {
  // devIndicators: false,
};

export default nextConfig;
