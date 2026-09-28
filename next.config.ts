import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinned explicitly: Turbopack otherwise walks up and mis-detects the repo
  // root, which makes it ignore package-lock.json.
  turbopack: {
    root: path.resolve("."),
  },
};

export default nextConfig;
