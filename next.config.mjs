import nextPwa from "next-pwa";

const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      // Self-hosted transformers.js bundle + onnxruntime wasm.
      urlPattern: /\/transformers\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "transformers-lib",
        expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // MusicGen model weights / configs from the Hugging Face hub.
      urlPattern: /^https:\/\/huggingface\.co\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "hf-models",
        rangeRequests: true,
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Same-origin app assets.
      urlPattern: /\/_next\/.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "next-assets" },
    },
    {
      urlPattern: ({ sameOrigin }) => sameOrigin,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "app-shell" },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required headers so WebGPU + cross-origin isolation features work well and
  // transformers.js can use the browser cache for model files.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
    ];
  },
  webpack: (config) => {
    // transformers.js is loaded from a CDN inside a module worker, so it is not
    // part of this bundle. These stubs are kept for any stray node-only imports.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

export default withPWA(nextConfig);
