import { getApiBase } from "@/lib/seo";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogProductSummary = {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string;
  status?: string;
};

export type BlogPostDetail = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  primaryKeyword?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  thumbnailUrl?: string | null;
  category?: BlogCategory | null;
  products?: BlogProductSummary[];
  featured?: boolean;
  isFeatured?: boolean;
};

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  thumbnailUrl?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  category?: BlogCategory | null;
  featured?: boolean;
  isFeatured?: boolean;
};

export type BlogPageData = {
  content: BlogPostSummary[];
  totalPages: number;
  totalElements: number;
  number?: number;
  pageable?: { pageNumber: number };
};

function unwrap<T>(json: unknown): T {
  if (json && typeof json === "object" && "data" in json) {
    return ((json as { data: T }).data ?? json) as T;
  }
  return json as T;
}

export async function fetchBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(`${getApiBase()}/v1/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const json = await res.json();
    return unwrap<BlogPostDetail>(json);
  } catch {
    return null;
  }
}

export async function fetchBlogPosts(params: {
  page?: number;
  size?: number;
  categorySlug?: string;
}): Promise<BlogPageData> {
  const page = params.page ?? 0;
  const size = params.size ?? 9;
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  if (params.categorySlug) qs.set("categorySlug", params.categorySlug);

  try {
    const res = await fetch(`${getApiBase()}/v1/blogs?${qs}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      return { content: [], totalPages: 0, totalElements: 0 };
    }
    const json = await res.json();
    const data = unwrap<BlogPageData>(json);
    return {
      content: data?.content ?? [],
      totalPages: data?.totalPages ?? 0,
      totalElements: data?.totalElements ?? 0,
      number: data?.number,
      pageable: data?.pageable,
    };
  } catch {
    return { content: [], totalPages: 0, totalElements: 0 };
  }
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(`${getApiBase()}/v1/blogs/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = unwrap<BlogCategory[]>(json);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
