/**
 * Values inlined at `next build` (NEXT_PUBLIC_*). Used for checkout console diagnostics.
 */
export function getClientBuildInfoForLog(): Record<string, unknown> {
  return {
    NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME ?? "(missing)",
    NEXT_PUBLIC_GIT_COMMIT: process.env.NEXT_PUBLIC_GIT_COMMIT ?? "(missing)",
    NEXT_PUBLIC_DOCKER_CACHE_BUST: process.env.NEXT_PUBLIC_DOCKER_CACHE_BUST ?? "(missing)",
    NEXT_PUBLIC_APP_BUILD_MARKER: process.env.NEXT_PUBLIC_APP_BUILD_MARKER ?? "(missing)",
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "(missing)",
    NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY: process.env.NEXT_PUBLIC_ORDER_USE_SAME_ORIGIN_PROXY ?? "(missing)",
    NODE_ENV: process.env.NODE_ENV,
  };
}
