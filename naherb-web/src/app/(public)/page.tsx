import type { Metadata } from "next";
import HomeClient from "./_components/HomeClient";
import { buildPageMetadata, fetchSiteInfo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const info = await fetchSiteInfo();
  const title =
    info.store_seo_title?.trim() ||
    `${info.store_name?.trim() || "NaHerbs"} - Tinh hoa thảo dược`;
  const description =
    info.store_seo_description?.trim() ||
    info.store_tagline?.trim() ||
    "Trải nghiệm chăm sóc sức khỏe từ thảo dược thiên nhiên cùng NaHerbs.";

  return buildPageMetadata({
    title,
    description,
    path: "/",
    absoluteTitle: true,
  });
}

export default function HomePage() {
  return <HomeClient />;
}
