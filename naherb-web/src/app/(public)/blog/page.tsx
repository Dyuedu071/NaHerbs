import { permanentRedirect } from "next/navigation";

/** Listing sống tại /tin-tuc; /blog giữ cho bài viết /blog/[slug]. */
export default function BlogIndexRedirect() {
  permanentRedirect("/tin-tuc");
}
