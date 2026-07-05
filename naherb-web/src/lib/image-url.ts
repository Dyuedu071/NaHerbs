export function resolveImageUrl(url?: string | null): string {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("http://res.cloudinary.com/")) {
    return trimmed.replace("http://", "https://");
  }

  if (trimmed.startsWith("/api/")) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
    const origin = apiBase.replace(/\/api\/?$/, "");
    return `${origin}${trimmed}`;
  }

  return trimmed;
}
