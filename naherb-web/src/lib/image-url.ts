export type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number | "auto";
  crop?: "limit" | "fill" | "fit";
};

export function isCloudinaryUrl(url?: string | null): boolean {
  return Boolean(url && url.includes("res.cloudinary.com"));
}

/**
 * Normalize media URLs. For Cloudinary, inject delivery transforms
 * (f_auto,q_auto,w_*) so the CDN serves a resized asset.
 *
 * IMPORTANT: Cloudinary transform URLs contain commas and MUST NOT be
 * passed through Next.js `/_next/image` (returns 400). Use MediaImage
 * (unoptimized for Cloudinary) or raw <img>.
 */
export function resolveImageUrl(
  url?: string | null,
  options: ImageTransformOptions = {},
): string {
  if (!url) return "";

  let trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("//")) {
    trimmed = `https:${trimmed}`;
  }

  if (trimmed.startsWith("http://res.cloudinary.com/")) {
    trimmed = trimmed.replace("http://", "https://");
  }

  if (trimmed.startsWith("/api/")) {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
    const origin = apiBase.replace(/\/api\/?$/, "");
    trimmed = `${origin}${trimmed}`;
  }

  return applyCloudinaryTransform(trimmed, options);
}

/** Raw Cloudinary URL without transforms — safe for Next.js image optimizer. */
export function stripCloudinaryTransforms(url: string): string {
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx < 0 || !isCloudinaryUrl(url)) return url;

  const prefix = url.slice(0, idx + marker.length);
  let rest = url.slice(idx + marker.length);
  const slash = rest.indexOf("/");
  if (slash < 0) return url;

  const firstSeg = rest.slice(0, slash);
  // Transform segment: has commas (f_auto,q_auto) or looks like t_xxx / w_600 / c_limit
  const looksLikeTransform =
    firstSeg.includes(",") ||
    /^(?:[a-z]{1,3}_[a-z0-9]+|t_[\w-]+)(?:,|$)/i.test(firstSeg);

  if (looksLikeTransform) {
    rest = rest.slice(slash + 1);
  }

  return prefix + rest;
}

function applyCloudinaryTransform(
  url: string,
  options: ImageTransformOptions,
): string {
  const marker = "/upload/";
  if (!isCloudinaryUrl(url) || !url.includes(marker)) {
    return url;
  }

  // Start from a clean upload path so we don't stack transforms
  const base = stripCloudinaryTransforms(url);
  const [prefix, rest] = base.split(marker);
  if (!rest) return base;

  const width = options.width ?? 800;
  const quality = options.quality ?? "auto";
  const crop = options.crop ?? "limit";
  const parts = [`f_auto`, `q_${quality}`, `c_${crop}`, `w_${width}`];
  if (options.height) parts.push(`h_${options.height}`);

  return `${prefix}${marker}${parts.join(",")}/${rest}`;
}
