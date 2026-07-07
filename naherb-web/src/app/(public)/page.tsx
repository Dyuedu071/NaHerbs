"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useChatbot } from '@/components/chatbot/ChatbotContext';

import { formatMoney } from '@/lib/order-format';
import {
  useGetProducts,
} from '@/services/generated/public-products/public-products';
import { useGetBlogPosts } from '@/services/generated/public-blog/public-blog';
import type { BlogPostSummary } from '@/services/generated/model/blogPostSummary';
import type { ProductSummary } from '@/services/generated/model/productSummary';

const fallbackProductImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCHIGHpyiH_H6cd9_8Zslswa-mB_l-tp5H_0vn7u3WIMjMMnJY7Gl2AHTm2ZHsVUifzbG8EqLQm_Ixt9t8Vx6pOFbt6Dnyqw-ws8jjMUOL7dT-eoB0UiNVffG1mx5yV0Yt6PFc0k4DxdRLRW6XiG26G9nE62FJONsIsnH_ZG0o9R4e_TLJnVtJuj_Dbfde9XuaRyy8WboVSQRO9eDqyiGWc5DhIFUN4pvK2VY2a0BssBOHGBU4TU07jylZpmTjT4fMQUZiW3y9O4g",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBQvwT_9-iT2SOajLu-FldGTE-JS02fCYW4Vn3r6HDGFmBcZAE6J1z4YGOPZz5TFuYXNl6TxtI7FYYw8e-p0kSgd8TCry0ZfSEEWdlJTKExoQpQJEC_IskQDCVFWnzJfUEarDOkZcPk2qhcENY_ci_MusEhUOPLOsg7LMNYnCSAKGGfYs0A86_rAalkCY3Jwg7C1Xmt2xtKOj16IyETjLs3IvU1Ef23zXjwmR4eRtyupcA3jLaZEMx4bZeghMprhbXBI0wdkUio9nY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuClRWBEUV4yi6_EIQr2oLX9IdPyqCpOZoTrmR7LsFQrQQgeS9fZB-qUANmy34zDMA4-7OJt7DTem0YGYmdsdKu5K077DJya5XIQ-Bjq70AzAp9cHyvOkwYA_7SdNDtaY-AjVSwUwVVT1ELVY7sS9iQJFijRu3yI8tzU9pGRDTqoIqVcJGu0eroB2H34q-jjESBDoWzt_xM8gxHU8W-SixGuonhHoyxGkVwkkelHBWgxAcmIHaLHGza_zoGne-MK5dbfaNN85jBqtXg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzCQwZw62I0hglOAs3IAoSmW3kupqhrDkCy-POmeYr7l2nw0YzDDf61GMar_cc4ynai-1Yt59GbzL6LwL-pOdqFzxmJQToKbBOJZP1a2DVmNF5xiz6bThlmXbFPblg_2TSUbMQn4NAXuP-XrJjllZ4y95M2KdVlBSciBebh7bjTn_qi8Ox5vqUjgYhviRF_Xw7V3fdUpR06DozgCYWFf6PbpuUElMUH3pX_cPNMP4z2lNegeXQ_3CTB472QRnEdaHhb0MGdJt3sAw",
];

const benefitMarqueeItems = [
  "Tự nhiên & An toàn",
  "100% thảo mộc hữu cơ chọn lọc",
  "Tiện lợi sử dụng",
  "Dễ dàng làm nóng, dùng mọi lúc",
  "Chăm sóc tại nhà",
  "Spa thư giãn ngay trong phòng bạn",
];

const featuredProductMatchers = [
  ["goi-cong-thai-hoc", "goi cong thai hoc"],
  ["tui-chuom-da-nang", "chuom da nang"],
  ["ao-choang-chu-u", "ao chu u"],
  ["bit-mat", "bit mat"],
  ["dam-lung", "dam lung"],
];

const heroSlides = [
  {
    id: "daily-relax",
    imageUrl: "/images/brand/DSCF6298.JPG",
    imageAlt: "Thảo dược NaHerbs được bày trên khay gỗ, gợi cảm giác chăm sóc sức khỏe tự nhiên.",
    panelClassName: "bg-[#fff176] text-primary",
    kicker: "100% Thảo Dược Tự Nhiên",
    title: "Thư giãn mỗi ngày cùng thảo dược NaHerbs",
    description:
      "Trải nghiệm sự chăm sóc dịu nhẹ từ thiên nhiên, giúp giảm căng thẳng và phục hồi năng lượng ngay tại nhà với các liệu pháp chườm nóng truyền thống kết hợp hiện đại.",
    primaryHref: "/san-pham",
    primaryLabel: "Khám Phá Sản Phẩm",
    secondaryHref: "/#about",
    secondaryLabel: "Tìm Hiểu Thêm",
    primaryButtonClassName: "bg-surface text-text-main hover:bg-primary hover:text-on-primary",
    secondaryButtonClassName: "border-primary text-primary hover:bg-primary hover:text-on-primary",
    dotClassName: "bg-surface",
  },
  {
    id: "herbal-pillow",
    videoUrl: "/videos/1.mp4",
    imageAlt: "Video giới thiệu Gối Đa Năng Thảo Dược NaHerbs.",
    panelClassName: "bg-[#f7efe2] text-primary",
    kicker: "Gối Đa Năng Thảo Dược",
    title: "Gối đa năng êm ái cho nhiều vùng đau mỏi",
    description:
      "Gối Đa Năng Thảo Dược NaHerbs được thiết kế với kích thước 23 x 36 cm, phù hợp sử dụng cho cổ, vai, gáy, lưng, bụng, đầu gối và các nhóm cơ thường xuyên bị đau mỏi.\n\nKhác với túi chườm thông thường, sản phẩm sử dụng cấu trúc 40% lõi thảo dược thiên nhiên kết hợp cùng 60% bông mềm cao cấp, giúp gối êm ái khi sử dụng và giữ được hương thơm dịu nhẹ của thảo dược.\n\nLõi thảo dược có thể tháo rời, giúp dễ dàng vệ sinh vỏ gối và thay lõi mới sau thời gian sử dụng.",
    primaryHref: "/san-pham",
    primaryLabel: "Xem Sản Phẩm",
    secondaryHref: "/lien-he",
    secondaryLabel: "Tư Vấn",
    primaryButtonClassName: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
    secondaryButtonClassName: "border-primary text-primary hover:bg-primary hover:text-on-primary",
    dotClassName: "bg-primary",
  },
  {
    id: "improved-care",
    imageUrl: "/images/brand/DSCF5790.JPG",
    imageAlt: "Các loại thảo dược và tinh dầu thiên nhiên được sắp đặt trên nền gỗ.",
    panelClassName: "bg-[#fbf7ef] text-[#1f1b15]",
    kicker: "Phiên Bản Cải Tiến",
    title: "Liệu pháp chườm ấm giúp cơ thể nhẹ nhõm hơn",
    description:
      "Hỗ trợ làm dịu vùng đau mỏi, thư giãn cơ bắp và giữ lại cảm giác ấm áp tự nhiên để bạn phục hồi sau một ngày dài.",
    primaryHref: "/san-pham",
    primaryLabel: "Xem Ngay",
    secondaryHref: "/lien-he",
    secondaryLabel: "Liên Hệ",
    primaryButtonClassName: "bg-[#1f1b15] text-on-primary hover:bg-primary",
    secondaryButtonClassName: "border-[#1f1b15] text-[#1f1b15] hover:bg-[#1f1b15] hover:text-on-primary",
    dotClassName: "bg-[#1f1b15]",
  },
  {
    id: "mugwort-steam-cup",
    videoUrl: "/videos/2.mp4",
    imageAlt: "Video giới thiệu Cốc Xông Hơi Ngải Cứu NaHerbs.",
    panelClassName: "bg-[#eef4e8] text-primary",
    kicker: "Cốc Xông Hơi Ngải Cứu",
    title: "Xông ngải tại nhà gọn nhẹ và an toàn",
    description:
      "Cốc Xông Hơi Ngải Cứu NaHerbs là bộ dụng cụ hỗ trợ xông ngải theo phương pháp Đông y, được thiết kế nhỏ gọn, an toàn và tiện lợi để sử dụng ngay tại nhà.\n\nSản phẩm dùng kết hợp với điếu ngải cứu thảo dược, tạo nguồn nhiệt cùng hương thơm tự nhiên của ngải cứu, mang lại cảm giác thư giãn và làm ấm vùng cơ thể cần chăm sóc.\n\nThiết kế gốm sứ chịu nhiệt kết hợp vỏ bọc chống nóng giúp dễ cầm nắm. Chặn tàn inox đi kèm giúp cố định điếu ngải và hạn chế tro rơi ra ngoài.",
    primaryHref: "/san-pham",
    primaryLabel: "Xem Sản Phẩm",
    secondaryHref: "/lien-he",
    secondaryLabel: "Liên Hệ",
    primaryButtonClassName: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
    secondaryButtonClassName: "border-primary text-primary hover:bg-primary hover:text-on-primary",
    dotClassName: "bg-primary",
  },
  {
    id: "essential-oil",
    videoUrl: "/videos/3.mp4",
    imageAlt: "Video giới thiệu tinh dầu và hương thơm NaHerbs.",
    panelClassName: "bg-[#fff6df] text-[#2f3f18]",
    kicker: "Hương Thơm Thảo Dược",
    title: "Tinh dầu cho không gian sống thư giãn",
    description:
      "Hương thơm nhẹ nhàng và dễ chịu góp phần tạo nên không gian sống thư giãn và cân bằng.\n\nSản phẩm được thiết kế dạng chai nhỏ gọn, tiện lợi mang theo hoặc sử dụng hằng ngày. Có thể dùng với máy khuếch tán tinh dầu, đèn xông, cốc xông hơi hoặc nhỏ trực tiếp lên gối, khăn, túi thơm theo nhu cầu.\n\nNaHerbs hiện có 02 mùi hương gồm Quế Hồi và Chanh Sả, phù hợp với nhiều sở thích và không gian sử dụng khác nhau.",
    primaryHref: "/san-pham",
    primaryLabel: "Xem Sản Phẩm",
    secondaryHref: "/lien-he",
    secondaryLabel: "Tư Vấn",
    primaryButtonClassName: "bg-[#2f3f18] text-on-primary hover:bg-primary",
    secondaryButtonClassName: "border-[#2f3f18] text-[#2f3f18] hover:bg-[#2f3f18] hover:text-on-primary",
    dotClassName: "bg-[#2f3f18]",
  },
];

function formatProductPrice(product: ProductSummary): string {
  if (product.minSalePrice == null) {
    return "Liên hệ";
  }
  return `${formatMoney(product.minSalePrice)}`;
}

function formatBlogDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
}

function normalizeSearchText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function unwrapApiData<T>(response: unknown, fallback: T): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as { data?: T }).data ?? fallback;
  }
  return (response as T) ?? fallback;
}

export default function Home() {
  const { open: openChatbot } = useChatbot();
  const scrollVideoSectionRef = useRef<HTMLElement | null>(null);
  const scrollCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const productRailRef = useRef<HTMLDivElement | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState<1 | -1>(1);
  const [productRailProgress, setProductRailProgress] = useState(0);

  const { data: productsResponse, isLoading: productsLoading } = useGetProducts(
    { size: 20, sort: "best_selling" },
    { query: { retry: false } },
  );
  const { data: blogPostsResponse, isLoading: blogPostsLoading } = useGetBlogPosts(
    { page: 0, size: 3 },
    { query: { retry: false } },
  );

  const products = unwrapApiData<{ items?: ProductSummary[] }>(productsResponse, {})?.items ?? [];
  const selectedProducts = featuredProductMatchers
    .map((matchers) => {
      return products.find((product) => {
        const normalizedSlug = normalizeSearchText(product.slug);
        const normalizedName = normalizeSearchText(product.name);
        return matchers.some((matcher) => normalizedSlug.includes(matcher) || normalizedName.includes(matcher));
      });
    })
    .filter((product): product is ProductSummary => Boolean(product));
  const productRailIndicatorWidth = selectedProducts.length > 0
    ? Math.min(100, (3 / selectedProducts.length) * 100)
    : 100;
  const latestPosts = unwrapApiData<{ items?: BlogPostSummary[] }>(blogPostsResponse, {})?.items ?? [];
  const currentHeroSlide = heroSlides[heroIndex];
  const goToHeroSlide = (direction: 1 | -1) => {
    setHeroDirection(direction);
    setHeroIndex((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };
  const goToHeroIndex = (nextIndex: number) => {
    if (nextIndex === heroIndex) return;
    setHeroDirection(nextIndex > heroIndex ? 1 : -1);
    setHeroIndex(nextIndex);
  };
  const scrollProductRail = (direction: 1 | -1) => {
    productRailRef.current?.scrollBy({
      left: direction * Math.min(productRailRef.current.clientWidth / 3 + 24, 520),
      behavior: "smooth",
    });
  };
  const updateProductRailProgress = () => {
    const rail = productRailRef.current;
    if (!rail) return;

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    setProductRailProgress(maxScroll > 0 ? rail.scrollLeft / maxScroll : 0);
  };

  useEffect(() => {
    const section = scrollVideoSectionRef.current;
    const canvas = scrollCanvasRef.current;
    if (!section || !canvas) return;

    let frame = 0;
    let preloadTimer = 0;
    let isDrawQueued = false;
    let renderedFrame = -1;
    let preloadIndex = 0;
    let isDisposed = false;
    const totalFrames = 240;
    const images = new Map<number, HTMLImageElement>();
    const context = canvas.getContext("2d");
    if (!context) return;

    const getFrameUrl = (index: number) =>
      `/videos/scroll-frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;

    const clampFrame = (index: number) => Math.min(Math.max(index, 0), totalFrames - 1);

    const queueDraw = () => {
      if (isDrawQueued) return;
      isDrawQueued = true;
      frame = requestAnimationFrame(drawCurrentFrame);
    };

    const loadFrame = (index: number) => {
      const safeIndex = clampFrame(index);
      const cachedImage = images.get(safeIndex);
      if (cachedImage) return cachedImage;

      const image = new Image();
      image.decoding = "async";
      image.src = getFrameUrl(safeIndex);
      image.addEventListener("load", queueDraw, { once: true });
      images.set(safeIndex, image);

      return image;
    };

    const getScrollProgress = () => {
      const scrollRange = section.offsetHeight - window.innerHeight;
      const rect = section.getBoundingClientRect();
      return scrollRange > 0
        ? Math.min(Math.max(-rect.top / scrollRange, 0), 1)
        : 0;
    };

    const drawImageContain = (image: HTMLImageElement) => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.fillStyle = "#f8f4ec";
      context.fillRect(0, 0, width, height);

      const imageRatio = image.naturalWidth / image.naturalHeight;
      const canvasRatio = width / height;
      const drawHeight = imageRatio > canvasRatio ? width / imageRatio : height;
      const drawWidth = imageRatio > canvasRatio ? width : height * imageRatio;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    };

    function drawCurrentFrame() {
      isDrawQueued = false;
      if (isDisposed) return;

      const nextFrame = Math.round(getScrollProgress() * (totalFrames - 1));
      const image = loadFrame(nextFrame);

      for (let offset = 1; offset <= 5; offset += 1) {
        loadFrame(nextFrame + offset);
        loadFrame(nextFrame - offset);
      }

      if (renderedFrame !== nextFrame && image.complete && image.naturalWidth > 0) {
        renderedFrame = nextFrame;
        drawImageContain(image);
      }
    }

    const preloadFrames = () => {
      for (let count = 0; count < 12 && preloadIndex < totalFrames; count += 1) {
        loadFrame(preloadIndex);
        preloadIndex += 1;
      }

      if (preloadIndex < totalFrames && !isDisposed) {
        preloadTimer = window.setTimeout(preloadFrames, 80);
      }
    };

    loadFrame(0);
    queueDraw();
    preloadFrames();
    window.addEventListener("scroll", queueDraw, { passive: true });
    window.addEventListener("resize", queueDraw);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(preloadTimer);
      window.removeEventListener("scroll", queueDraw);
      window.removeEventListener("resize", queueDraw);
    };
  }, []);



  return (
    <>
    
    <main className="flex-grow pt-[108px] pb-xl">
        {/* Hero Section */}
        <section id="about" className="relative grid min-h-[calc(100svh-132px)] grid-cols-1 overflow-hidden lg:grid-cols-2">
            <div className="relative min-h-[200px] sm:min-h-[340px] lg:min-h-[calc(100svh-132px)]">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={`${currentHeroSlide.id}-image`}
                        className="absolute inset-0 overflow-hidden bg-cover bg-center lg:bg-[center_center]"
                        data-alt={currentHeroSlide.imageAlt}
                        style={currentHeroSlide.videoUrl ? undefined : { backgroundImage: `url('${currentHeroSlide.imageUrl}')` }}
                        initial={{ opacity: 0, scale: 1.04, x: heroDirection * 44 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 1.02, x: heroDirection * -44 }}
                        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {currentHeroSlide.videoUrl && (
                            <video
                                key={currentHeroSlide.videoUrl}
                                className="h-full w-full object-cover"
                                src={currentHeroSlide.videoUrl}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-primary/10" />
            </div>

            <div className={`relative flex items-center px-gutter py-lg transition-colors duration-700 lg:min-h-[calc(100svh-132px)] lg:px-[clamp(48px,7vw,128px)] lg:py-xl ${currentHeroSlide.panelClassName}`}>
                <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={`${currentHeroSlide.id}-copy`}
                    className="max-w-[640px]"
                    initial={{ opacity: 0, x: heroDirection * 44 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: heroDirection * -44 }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="mb-md block font-label-md text-label-md uppercase opacity-85">
                        {currentHeroSlide.kicker}
                    </span>
                    <h1 className="font-display-lg text-[32px] font-bold leading-[1.1] sm:text-[36px] md:text-display-lg md:leading-[1.15]">
                        {currentHeroSlide.title}
                    </h1>
                    <p className="mt-md max-w-[560px] whitespace-pre-line font-body-md text-[15px] leading-[1.45] opacity-80 md:text-[16px] md:leading-[1.55]">
                        {currentHeroSlide.description}
                    </p>
                    <div className="mt-lg flex flex-row gap-xs sm:gap-sm">
                        <Link
                            href={currentHeroSlide.primaryHref}
                            className={`inline-flex min-h-[48px] flex-1 items-center justify-between px-sm font-label-md text-[14px] transition-colors md:min-h-[56px] md:min-w-[240px] md:flex-none md:px-md md:text-label-md ${currentHeroSlide.primaryButtonClassName}`}
                        >
                            {currentHeroSlide.primaryLabel}
                            <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                        </Link>
                        <Link
                            href={currentHeroSlide.secondaryHref}
                            className={`inline-flex min-h-[48px] min-w-[124px] items-center justify-center border px-sm font-label-md text-[14px] transition-colors md:min-h-[56px] md:min-w-[180px] md:px-md md:text-label-md ${currentHeroSlide.secondaryButtonClassName}`}
                        >
                            {currentHeroSlide.secondaryLabel}
                        </Link>
                    </div>
                    <div className="mt-lg flex gap-xs">
                        {heroSlides.map((slide, index) => (
                            <button
                                key={slide.id}
                                type="button"
                                onClick={() => goToHeroIndex(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === heroIndex ? `w-7 ${currentHeroSlide.dotClassName}` : "w-2 bg-current/25"}`}
                                aria-label={`Chuyển đến slide ${index + 1}`}
                                aria-current={index === heroIndex}
                            />
                        ))}
                    </div>
                </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-sm right-sm flex gap-xs lg:hidden">
                    <button
                        type="button"
                        onClick={() => goToHeroSlide(-1)}
                        className="flex h-10 w-10 items-center justify-center bg-[#1f1b15] text-on-primary"
                        aria-label="Slide trước"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => goToHeroSlide(1)}
                        className="flex h-10 w-10 items-center justify-center bg-[#1f1b15] text-on-primary"
                        aria-label="Slide sau"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>
            <button
                type="button"
                onClick={() => goToHeroSlide(-1)}
                className="absolute left-0 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center bg-[#1f1b15] text-on-primary transition-colors hover:bg-primary lg:inline-flex"
                aria-label="Slide trước"
            >
                <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
                type="button"
                onClick={() => goToHeroSlide(1)}
                className="absolute right-0 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center bg-[#1f1b15] text-on-primary transition-colors hover:bg-primary lg:inline-flex"
                aria-label="Slide sau"
            >
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </section>
        {/* Scroll-scrub Product Video */}
        <section ref={scrollVideoSectionRef} className="relative h-[520vh] bg-[#f8f4ec]">
            <div className="sticky top-[108px] flex min-h-[calc(100svh-108px)] items-center overflow-hidden bg-[#f8f4ec]">
                <div className="grid w-full grid-cols-1 items-center gap-lg px-gutter py-lg lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.25fr)_minmax(0,0.95fr)] lg:py-0">
                    <motion.div
                        className="max-w-[420px] justify-self-start text-[#2f2b23]"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="font-label-md text-label-md uppercase text-primary/80">Gối Đa Năng Thảo Dược</p>
                        <h2 className="mt-sm font-display-lg text-[34px] font-bold leading-tight text-primary md:text-[48px]">
                            Chăm sóc linh hoạt cho nhiều vùng đau mỏi
                        </h2>
                        <p className="mt-md font-body-lg text-body-lg text-text-muted">
                            Gối Đa Năng Thảo Dược NaHerbs được thiết kế với kích thước 23 x 36 cm, phù hợp sử dụng cho nhiều vùng trên cơ thể như cổ, vai, gáy, lưng, bụng, đầu gối và các nhóm cơ thường xuyên bị đau mỏi.
                        </p>
                    </motion.div>

                    <div className="relative mx-auto flex h-[48vh] w-full max-w-[620px] items-center justify-center bg-[#f8f4ec] md:h-[66vh] lg:h-[calc(100svh-180px)]">
                        <canvas
                            ref={scrollCanvasRef}
                            className="h-full w-full object-contain"
                            aria-label="Gối Đa Năng Thảo Dược NaHerbs chuyển động theo thao tác cuộn trang"
                        />
                    </div>

                    <motion.div
                        className="max-w-[430px] justify-self-end text-[#2f2b23]"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="font-body-md text-body-md text-text-muted">
                            Khác với túi chườm thông thường, sản phẩm sử dụng cấu trúc 40% lõi thảo dược thiên nhiên kết hợp cùng 60% bông mềm cao cấp, giúp gối vừa mang lại cảm giác êm ái khi sử dụng, vừa giữ được hương thơm dịu nhẹ của thảo dược.
                        </p>
                        <p className="mt-sm font-body-md text-body-md text-text-muted">
                            Lõi thảo dược được thiết kế tháo rời, giúp người dùng dễ dàng vệ sinh vỏ gối và thay thế lõi mới sau thời gian sử dụng, góp phần kéo dài tuổi thọ sản phẩm.
                        </p>
                        <p className="mt-sm font-body-md text-body-md text-text-muted">
                            Sản phẩm có hai phiên bản Có Nhiệt và Không Có Nhiệt, đáp ứng đa dạng nhu cầu chăm sóc sức khỏe và thư giãn hằng ngày.
                        </p>
                        <Link href="/san-pham" className="mt-md inline-flex items-center gap-xs font-label-md text-label-md uppercase text-primary hover:underline">
                            Xem sản phẩm <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
        {/* Brand Philosophy + Benefit Marquee */}
        <section className="bg-surface">
            <div
                className="relative flex min-h-[430px] items-center justify-center bg-cover bg-center px-gutter py-xl md:min-h-[560px]"
                style={{ backgroundImage: "url('/images/brand/bg-brand.jpg')" }}
            >
                <div className="max-w-[760px] bg-surface px-lg py-lg text-center shadow-ambient-2 md:px-xl">
                    <h2 className="font-display-lg text-[34px] font-bold leading-tight text-[#1f1b15] sm:text-[44px] md:whitespace-nowrap md:text-[52px]">
                        Triết lý thương hiệu
                    </h2>
                    <p className="mx-auto mt-md max-w-[520px] font-body-lg text-body-lg text-text-muted">
                        NaHerbs tin vào sự chăm sóc dịu nhẹ từ thiên nhiên, kết hợp thảo dược truyền thống với trải nghiệm sử dụng hiện đại cho nhịp sống hằng ngày.
                    </p>
                    <Link
                        href="/gioi-thieu"
                        className="mx-auto mt-lg inline-flex min-h-[56px] w-full max-w-[390px] items-center justify-between bg-[#1f1b15] px-md font-label-md text-label-md text-on-primary transition-colors hover:bg-primary"
                    >
                        Tìm hiểu thêm
                        <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                    </Link>
                </div>
            </div>
            <div className="overflow-hidden bg-surface py-lg">
                <div className="naherbs-marquee flex w-max items-center gap-lg whitespace-nowrap">
                    {[...Array(2)].map((_, groupIndex) => (
                        <div key={groupIndex} className="flex items-center gap-lg">
                            {benefitMarqueeItems.map((item) => (
                                <span
                                    key={`${groupIndex}-${item}`}
                                    className="font-display-lg text-[44px] font-black uppercase leading-[1.1] text-[#1f1b15] md:text-[88px]"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
        {/* Best-selling Products */}
        <section className="relative overflow-hidden bg-[#fbf7ef] py-xl">
            <div className="grid gap-lg px-gutter lg:grid-cols-2 lg:items-end">
                <div className="mx-auto max-w-[400px] text-center lg:text-left lg:pb-xl">
                    <h2 className="font-display-lg text-[46px] font-black uppercase leading-[0.98] text-[#1f1b15] md:text-[72px]">
                        <span className="block font-serif italic font-normal normal-case">Sản phẩm</span>
                        Bán chạy
                    </h2>
                    <p className="mt-md font-body-md text-body-md leading-relaxed text-text-muted">
                        NaHerbs chọn lọc các sản phẩm được khách hàng yêu thích để chăm sóc cơ thể nhẹ nhàng, tiện lợi mỗi ngày.
                    </p>
                    <Link href="/san-pham" className="mt-md inline-flex items-center gap-xs font-label-md text-label-md uppercase text-primary hover:underline">
                        Xem tất cả <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                </div>

                <div className="relative min-w-0 lg:max-w-full">
                    {productsLoading ? (
                        <div className="ml-auto flex w-full gap-md overflow-hidden md:w-[888px] md:max-w-full xl:w-[1008px] 2xl:w-[1128px]">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="w-[min(80vw,360px)] shrink-0 md:w-[280px] xl:w-[320px] 2xl:w-[360px]">
                                    <div className="aspect-[4/5] animate-pulse bg-[#efeae1]" />
                                    <div className="grid grid-cols-[1fr_56px] gap-sm pt-sm">
                                        <div className="space-y-xs">
                                            <div className="h-5 w-4/5 animate-pulse bg-[#e6d9c5]" />
                                            <div className="h-3 w-2/3 animate-pulse bg-[#e6d9c5]" />
                                            <div className="h-5 w-24 animate-pulse bg-[#e6d9c5]" />
                                        </div>
                                        <div className="h-14 w-14 animate-pulse bg-[#eadcc8]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : selectedProducts.length === 0 ? (
                        <div className="flex min-h-[360px] items-center justify-center pr-gutter">
                            <p className="text-body-md text-text-muted">Chưa tìm thấy các sản phẩm được chọn trong dữ liệu backend.</p>
                        </div>
                    ) : (
                        <>
                            <div className="relative ml-auto w-full md:w-[888px] md:max-w-full xl:w-[1008px] 2xl:w-[1128px]">
                            <div
                                ref={productRailRef}
                                onScroll={updateProductRailProgress}
                                className="flex w-full snap-x gap-md overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {selectedProducts.map((product: ProductSummary, index: number) => {
                                    const imageUrl = product.thumbnailUrl ?? fallbackProductImages[index % fallbackProductImages.length];
                                    const productHref = product.slug ? `/san-pham/${product.slug}` : "/san-pham";
                                    const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";

                                    return (
                                        <article
                                            key={product.id ?? product.slug ?? product.name}
                                            className="group w-[min(80vw,360px)] shrink-0 snap-start md:w-[280px] xl:w-[320px] 2xl:w-[360px]"
                                        >
                                            <Link
                                                href={productHref}
                                                className="relative block aspect-[4/5] overflow-hidden bg-[#efeae1]"
                                                aria-label={product.name ?? "Sản phẩm NaHerbs"}
                                            >
                                                {index === 0 && (
                                                    <span className="absolute left-sm top-sm z-10 bg-primary px-xs py-1 font-caption text-caption uppercase text-on-primary">
                                                        Bán chạy
                                                    </span>
                                                )}
                                                <div
                                                    className="absolute inset-[8%] bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundImage: `url('${imageUrl}')` }}
                                                />
                                            </Link>
                                            <div className="grid grid-cols-[1fr_56px] gap-sm pt-sm">
                                                <Link href={productHref} className="min-w-0">
                                                    <h3 className="line-clamp-2 font-body-lg text-body-lg font-semibold text-[#1f1b15]">
                                                        {product.name ?? "Sản phẩm NaHerbs"}
                                                    </h3>
                                                    {product.shortDescription && (
                                                        <p className="mt-1 line-clamp-2 font-label-sm text-label-sm uppercase text-text-muted">
                                                            {product.shortDescription}
                                                        </p>
                                                    )}
                                                    {isOutOfStock ? (
                                                        <p className="mt-xs font-label-md text-label-md text-error">Hết hàng</p>
                                                    ) : (
                                                        <p className="mt-xs font-price-display text-price-display text-[#1f1b15]">
                                                            {formatProductPrice(product)}
                                                        </p>
                                                    )}
                                                </Link>
                                                <Link
                                                    href={productHref}
                                                    className="flex h-14 w-14 items-center justify-center justify-self-end bg-[#eadcc8] text-[#1f1b15] transition-colors hover:bg-primary hover:text-on-primary"
                                                    aria-label={`Xem ${product.name ?? "sản phẩm"}`}
                                                >
                                                    <span className="material-symbols-outlined text-[26px]">shopping_bag</span>
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                onClick={() => scrollProductRail(-1)}
                                className="absolute left-0 top-[42%] z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center bg-[#1f1b15] text-on-primary transition-colors hover:bg-primary md:inline-flex"
                                aria-label="Xem sản phẩm bán chạy phía trước"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollProductRail(1)}
                                className="absolute right-0 top-[42%] z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center bg-[#1f1b15] text-on-primary transition-colors hover:bg-primary md:inline-flex"
                                aria-label="Xem thêm sản phẩm bán chạy"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                            <div className="relative mt-lg h-px overflow-hidden bg-[#e6d9c5]">
                                <div
                                    className="absolute top-0 h-px bg-[#1f1b15] transition-[left] duration-300 ease-out"
                                    style={{
                                        left: `${productRailProgress * (100 - productRailIndicatorWidth)}%`,
                                        width: `${productRailIndicatorWidth}%`,
                                    }}
                                />
                            </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
        {/* Latest Blog Posts */}
        <section className="bg-[#fbf7ef] px-gutter py-xl">
            <div className="mx-auto max-w-container-max">
                <div className="mb-xl flex flex-col gap-md md:flex-row md:items-start md:justify-between">
                    <h2 className="font-display-lg text-[44px] italic leading-tight text-[#1f1b15] md:text-[72px]">
                        Bài viết mới nhất
                    </h2>
                    <Link
                        href="/tin-tuc"
                        className="inline-flex min-h-[56px] w-full items-center justify-between border border-[#e6d9c5] px-md font-label-md text-label-md uppercase text-[#1f1b15] transition-colors hover:border-primary hover:text-primary md:w-[300px]"
                    >
                        Tất cả bài viết
                        <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                    </Link>
                </div>

                {blogPostsLoading ? (
                    <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index}>
                                <div className="aspect-[4/3] animate-pulse bg-[#efeae1]" />
                                <div className="mt-md h-4 w-28 animate-pulse bg-[#e6d9c5]" />
                                <div className="mt-sm h-7 w-5/6 animate-pulse bg-[#e6d9c5]" />
                                <div className="mt-sm h-4 w-full animate-pulse bg-[#e6d9c5]" />
                                <div className="mt-xs h-4 w-4/5 animate-pulse bg-[#e6d9c5]" />
                            </div>
                        ))}
                    </div>
                ) : latestPosts.length === 0 ? (
                    <div className="border border-[#e6d9c5] bg-surface px-md py-lg text-center">
                        <p className="font-body-md text-body-md text-text-muted">Chưa có bài viết mới để hiển thị.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                        {latestPosts.map((post: BlogPostSummary, index: number) => {
                            const postHref = post.slug ? `/blog/${post.slug}` : "/tin-tuc";
                            const thumbnailUrl = post.thumbnailUrl ?? fallbackProductImages[index % fallbackProductImages.length];
                            const publishedDate = formatBlogDate(post.publishedAt);

                            return (
                                <Link key={post.id ?? post.slug ?? post.title} href={postHref} className="group block">
                                    <div className="aspect-[4/3] overflow-hidden bg-[#efeae1]">
                                        <div
                                            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${thumbnailUrl}')` }}
                                        />
                                    </div>
                                    <div className="mt-md">
                                        <p className="font-label-sm text-label-sm text-[#1f1b15]">
                                            NaHerbs {publishedDate && <span className="text-[#b8955d]">| {publishedDate}</span>}
                                        </p>
                                        <h3 className="mt-sm line-clamp-2 font-headline-md text-[24px] font-semibold leading-tight text-[#1f1b15] transition-colors group-hover:text-primary">
                                            {post.title ?? "Bài viết NaHerbs"}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="mt-sm line-clamp-3 font-body-md text-body-md leading-relaxed text-text-muted">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
        {/* AI Advisor Section */}
        <section className="bg-surface-container my-xl">
            <div
                className="px-gutter max-w-container-max mx-auto py-xl flex flex-col md:flex-row items-center gap-xl relative">
                <div className="w-full md:w-1/2 relative">
                    {/* Soft organic shape behind image */}
                    <div
                        className="absolute inset-0 bg-secondary-fixed rounded-[4rem] transform rotate-3 scale-105 opacity-50 blur-lg">
                    </div>
                    <div className="relative w-full aspect-square rounded-[2rem] bg-cover bg-center shadow-ambient-2 z-10 overflow-hidden"
                        data-alt="Không gian tư vấn chăm sóc sức khỏe NaHerbs với hình ảnh thương hiệu tự nhiên."
                        style={{ backgroundImage: "url('/images/brand/ai-advisor.jpg')" }}>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-md z-10">
                    <div
                        className="inline-flex items-center gap-xs bg-surface-bright px-sm py-xs rounded-full border border-secondary-fixed-dim w-fit shadow-sm">
                        <span className="material-symbols-outlined text-primary text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
                        <span className="font-label-md text-label-md text-primary">NAKI</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Tìm liệu pháp phù hợp nhất cho bạn
                    </h2>
                    <p className="font-body-lg text-body-lg text-text-muted">
                        Không chắc sản phẩm nào phù hợp với tình trạng đau mỏi của bạn? NAKI, trợ lý AI của NaHerbs, được huấn
                        luyện dựa trên kiến thức đông y và vật lý trị liệu, luôn sẵn sàng lắng nghe và đưa ra gợi ý cá
                        nhân hóa 24/7.
                    </p>
                    <button
                        type="button"
                        onClick={openChatbot}
                        className="bg-primary text-on-primary rounded-full px-lg py-3 font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-ambient-2 w-fit flex items-center gap-sm mt-sm">
                        <span className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                        Trò chuyện cùng NAKI
                    </button>
                </div>
            </div>
        </section>
    </main>
    
    </>
  );
}
