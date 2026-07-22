export type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number | "auto";
  crop?: "limit" | "fill" | "fit";
};

/**
 * Normalize media URLs and inject Cloudinary delivery transforms
 * (f_auto,q_auto,w_*) so originals aren't downloaded at full size.
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

function applyCloudinaryTransform(
  url: string,
  options: ImageTransformOptions,
): string {
  const marker = "/upload/";
  if (!url.includes("res.cloudinary.com") || !url.includes(marker)) {
    return url;
  }

  const [prefix, rest] = url.split(marker);
  if (!rest) return url;

  // Already transformed (e.g. upload/f_auto,q_auto,w_800/...)
  if (/^(c_|w_|h_|f_|q_|fl_|dpr_)/.test(rest) || rest.startsWith("t_")) {
    return url;
  }

  const width = options.width ?? 800;
  const quality = options.quality ?? "auto";
  const crop = options.crop ?? "limit";
  const parts = [`f_auto`, `q_${quality}`, `c_${crop}`, `w_${width}`];
  if (options.height) parts.push(`h_${options.height}`);

  return `${prefix}${marker}${parts.join(",")}/${rest}`;
}
