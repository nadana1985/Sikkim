import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createBundleAnalyzer from "@next/bundle-analyzer";
import withPWAInit from "next-pwa";

// Derive allowed image domains from the API URL to avoid hardcoding.
// In development NEXT_PUBLIC_API_URL defaults to https://sikkim-production.up.railway.app.
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sikkim-production.up.railway.app';
const parsed = new URL(apiUrl);
const apiProtocol = parsed.protocol.replace(':', '') as 'http' | 'https';
const apiHostname = parsed.hostname;
// apiHost includes port (e.g. "localhost:4000") — needed for CSP origins.
const apiHost = parsed.host;

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-stylesheets",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\/_next\/static.+\.js$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        },
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\.json$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "next-data",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 5,
      },
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 5,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This disables ESLint during builds
    ignoreDuringBuilds: true,
  },
  images: {
    // Only allow images served by our API backend.
    // Controlled via NEXT_PUBLIC_API_URL — no hardcoded domains.
    remotePatterns: [
      {
        protocol: apiProtocol,
        hostname: apiHostname,
        ...(parsed.port ? { port: parsed.port } : {}),
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // unsafe-eval: required by Three.js for WebGL shader compilation
              // unsafe-inline: required by Next.js and Tailwind CSS for dev + inline styles
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              // style-src: unsafe-inline for Tailwind CSS + Google Fonts stylesheet
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // img-src: API media, Leaflet markers (unpkg), demo panorama (threejs.org), data URIs, blobs
              `img-src 'self' ${apiProtocol}://${apiHost} https://unpkg.com https://threejs.org data: blob:`,
              // font-src: Google Fonts (Inter) served from fonts.gstatic.com
              "font-src 'self' https://fonts.gstatic.com",
              // connect-src: API backend, OpenStreetMap tiles, Leaflet assets, and Sentry error reporting
              `connect-src 'self' ${apiProtocol}://${apiHost} https://*.tile.openstreetmap.org https://unpkg.com https://*.sentry.io`,
              // media-src: panoramic textures loaded from the API
              `media-src 'self' ${apiProtocol}://${apiHost}`,
              // frame-src: no iframes allowed
              "frame-src 'none'",
              // worker-src: Three.js may use web workers via blob URLs
              "worker-src 'self' blob:",
              // object-src: block plugins
              "object-src 'none'",
              // base-uri: restrict base tag
              "base-uri 'self'",
              // form-action: restrict form submissions
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // Disable strict mode for Three.js compatibility
  reactStrictMode: false,
};

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(
  withPWA(
    withSentryConfig(nextConfig, {
      // Suppress verbose Sentry build logs
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // Upload source maps only in production builds
      widenClientFileUpload: process.env.NODE_ENV === "production",
      sourcemaps: { disable: true },
      webpack: {
        // Tree-shake Sentry logger to reduce bundle size (replaces deprecated disableLogger)
        treeshake: {
          removeDebugLogging: true,
        },
        // Automatically inject Sentry in all pages for server monitoring
        // (replaces deprecated top-level automaticVercelMonitors)
        automaticVercelMonitors: true,
      },
    })
  )
);
