"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useChatbot } from '@/components/chatbot/ChatbotContext';
import { useGetAuthMe } from '@/services/generated/customer-profile/customer-profile';

import { extractApiErrorMessage } from '@/lib/api-error';
import { useToast } from '@/contexts/ToastContext';
import { formatMoney } from '@/lib/order-format';
import { getGetCartQueryKey, usePostCartItems } from '@/services/generated/cart/cart';
import { getProductsSlug, useGetProducts } from '@/services/generated/public-products/public-products';
import type { ProductDetail } from '@/services/generated/model/productDetail';
import type { ProductPage } from '@/services/generated/model/productPage';
import type { ProductSku } from '@/services/generated/model/productSku';
import type { ProductSummary } from '@/services/generated/model/productSummary';
import { useQueryClient } from '@tanstack/react-query';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';

const fallbackProductImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCHIGHpyiH_H6cd9_8Zslswa-mB_l-tp5H_0vn7u3WIMjMMnJY7Gl2AHTm2ZHsVUifzbG8EqLQm_Ixt9t8Vx6pOFbt6Dnyqw-ws8jjMUOL7dT-eoB0UiNVffG1mx5yV0Yt6PFc0k4DxdRLRW6XiG26G9nE62FJONsIsnH_ZG0o9R4e_TLJnVtJuj_Dbfde9XuaRyy8WboVSQRO9eDqyiGWc5DhIFUN4pvK2VY2a0BssBOHGBU4TU07jylZpmTjT4fMQUZiW3y9O4g",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBQvwT_9-iT2SOajLu-FldGTE-JS02fCYW4Vn3r6HDGFmBcZAE6J1z4YGOPZz5TFuYXNl6TxtI7FYYw8e-p0kSgd8TCry0ZfSEEWdlJTKExoQpQJEC_IskQDCVFWnzJfUEarDOkZcPk2qhcENY_ci_MusEhUOPLOsg7LMNYnCSAKGGfYs0A86_rAalkCY3Jwg7C1Xmt2xtKOj16IyETjLs3IvU1Ef23zXjwmR4eRtyupcA3jLaZEMx4bZeghMprhbXBI0wdkUio9nY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuClRWBEUV4yi6_EIQr2oLX9IdPyqCpOZoTrmR7LsFQrQQgeS9fZB-qUANmy34zDMA4-7OJt7DTem0YGYmdsdKu5K077DJya5XIQ-Bjq70AzAp9cHyvOkwYA_7SdNDtaY-AjVSwUwVVT1ELVY7sS9iQJFijRu3yI8tzU9pGRDTqoIqVcJGu0eroB2H34q-jjESBDoWzt_xM8gxHU8W-SixGuonhHoyxGkVwkkelHBWgxAcmIHaLHGza_zoGne-MK5dbfaNN85jBqtXg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzCQwZw62I0hglOAs3IAoSmW3kupqhrDkCy-POmeYr7l2nw0YzDDf61GMar_cc4ynai-1Yt59GbzL6LwL-pOdqFzxmJQToKbBOJZP1a2DVmNF5xiz6bThlmXbFPblg_2TSUbMQn4NAXuP-XrJjllZ4y95M2KdVlBSciBebh7bjTn_qi8Ox5vqUjgYhviRF_Xw7V3fdUpR06DozgCYWFf6PbpuUElMUH3pX_cPNMP4z2lNegeXQ_3CTB472QRnEdaHhb0MGdJt3sAw",
];

function findPurchasableSku(product?: ProductDetail): ProductSku | undefined {
  return product?.versions
    ?.flatMap((version) => version.skus ?? [])
    .find(
      (sku) =>
        sku.id &&
        sku.status === "ACTIVE" &&
        sku.stockStatus !== "OUT_OF_STOCK" &&
        (sku.stockQuantity ?? 0) > 0,
    );
}

function formatProductPrice(product: ProductSummary): string {
  if (product.minSalePrice == null && product.maxSalePrice == null) {
    return "Liên hệ";
  }
  if (product.minSalePrice === product.maxSalePrice || product.maxSalePrice == null) {
    return formatMoney(product.minSalePrice);
  }
  return `${formatMoney(product.minSalePrice)} - ${formatMoney(product.maxSalePrice)}`;
}

export default function Home() {
  const queryClient = useQueryClient();
  const { open: openChatbot } = useChatbot();

  const [addingProductSlug, setAddingProductSlug] = useState<string | null>(null);
  const { data: productsResponse, isLoading: productsLoading } = useGetProducts(
    { size: 4, inStockOnly: true, sort: "latest" },
    { query: { retry: false } },
  );
  const { mutateAsync: addCartItem } = usePostCartItems();

  const { showToast } = useToast();

  const featuredProducts =
    (productsResponse as { data?: ProductPage } | undefined)?.data?.items ?? [];

  const handleAddProduct = async (product: ProductSummary) => {
    if (!product.slug) {
      showToast("Sản phẩm chưa có dữ liệu để thêm vào giỏ.", "error");
      return;
    }

    setAddingProductSlug(product.slug);
    try {
      const detailResponse = await getProductsSlug(product.slug);
      const detail = (detailResponse as { data?: ProductDetail }).data;
      const sku = findPurchasableSku(detail);

      if (!sku?.id) {
        showToast("Sản phẩm hiện chưa có SKU còn hàng.", "error");
        return;
      }

      await addCartItem({ data: { skuId: sku.id, quantity: 1 } });
      await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      showToast("Thêm sản phẩm vào giỏ hàng thành công!", "success");
    } catch (addError) {
      showToast(extractApiErrorMessage(addError), "error");
    } finally {
      setAddingProductSlug(null);
    }
  };

  return (
    <>
    <PublicHeader />
    <main className="flex-grow pt-24 pb-xl">
        {/* Hero Section */}
        <section id="about" className="px-gutter max-w-container-max mx-auto py-xl">
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center bg-surface-container-low rounded-[2rem] overflow-hidden border border-border-warm shadow-ambient-1">
                <div className="p-lg md:p-xl flex flex-col items-start gap-md">
                    <span
                        className="inline-block bg-success-bg text-primary px-sm py-xs rounded-full font-label-md text-label-md border border-herbal-beige">100%
                        Thảo Dược Tự Nhiên</span>
                    <h1 className="font-display-lg text-display-lg text-primary text-balance">
                        Thư giãn mỗi ngày cùng thảo dược NaHerbs
                    </h1>
                    <p className="font-body-lg text-body-lg text-text-muted max-w-md">
                        Trải nghiệm sự chăm sóc dịu nhẹ từ thiên nhiên, giúp giảm căng thẳng và phục hồi năng lượng ngay
                        tại nhà với các liệu pháp chườm nóng truyền thống kết hợp hiện đại.
                    </p>
                    <div className="flex gap-sm mt-sm">
                        <Link href="/san-pham"
                            className="bg-primary text-on-primary rounded-full px-md py-sm font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-all shadow-ambient-2 hover:-translate-y-0.5">
                            Khám Phá Sản Phẩm
                        </Link>
                        <Link href="/#about"
                            className="border border-primary text-primary rounded-full px-md py-sm font-label-md text-label-md hover:bg-success-bg transition-colors">
                            Tìm Hiểu Thêm
                        </Link>
                    </div>
                </div>
                <div className="h-full min-h-[400px] w-full relative">
                    <div className="absolute inset-0 bg-cover bg-center"
                        data-alt="A serene, well-lit modern home spa setting. In the foreground, a beautifully crafted herbal heating pad rests on a soft, folded cream-colored linen towel. Natural sunlight streams softly from a window, casting gentle shadows. The color palette features warm creams, soft earthy greens, and subtle beige tones. A small potted plant sits softly out of focus in the background, creating a calm, minimalist organic aesthetic."
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMfaxpH2qVzpCPcaOCWNaIc6gqtenYdO4GTKV_txAbv9PCu26mK6J8JG3gi8fr9TxJbKlrO7OcT4OA5hn1N-o79CVTcIT-bK3TOHrE4_IQ6lORArGpyv9fddK7kVK3Sy4YHP4GGJMYcJVQSyjFsV0N0IISrhdZh1SaWuq4Cuu62kCTyx2U_r7vqWFv-nkyNsAFo455ICt3JVG5KjfufyKc_kmPvssZpqoSQpFF8kupx1ZpXNNvMRY0R7g-q4EXIJaSNJWS7Eb5c2w')" }}>
                    </div>
                </div>
            </div>
        </section>
        {/* Benefit Strip */}
        <section className="px-gutter max-w-container-max mx-auto pb-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div
                    className="bg-surface rounded-xl p-md flex items-center gap-sm border border-border-warm shadow-ambient-1">
                    <div className="bg-success-bg text-primary p-xs rounded-full flex-shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    </div>
                    <div>
                        <h3 className="font-label-md text-label-md text-primary">Tự nhiên &amp; An toàn</h3>
                        <p className="font-caption text-caption text-text-muted">100% thảo mộc hữu cơ chọn lọc</p>
                    </div>
                </div>
                <div
                    className="bg-surface rounded-xl p-md flex items-center gap-sm border border-border-warm shadow-ambient-1">
                    <div className="bg-success-bg text-primary p-xs rounded-full flex-shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    </div>
                    <div>
                        <h3 className="font-label-md text-label-md text-primary">Tiện lợi sử dụng</h3>
                        <p className="font-caption text-caption text-text-muted">Dễ dàng làm nóng, dùng mọi lúc</p>
                    </div>
                </div>
                <div
                    className="bg-surface rounded-xl p-md flex items-center gap-sm border border-border-warm shadow-ambient-1">
                    <div className="bg-success-bg text-primary p-xs rounded-full flex-shrink-0">
                        <span className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}>home_health</span>
                    </div>
                    <div>
                        <h3 className="font-label-md text-label-md text-primary">Chăm sóc tại nhà</h3>
                        <p className="font-caption text-caption text-text-muted">Spa thư giãn ngay trong phòng bạn</p>
                    </div>
                </div>
            </div>
        </section>
        {/* Category Cards */}
        <section className="px-gutter max-w-container-max mx-auto py-xl border-t border-border-warm/50">
            <div className="flex justify-between items-end mb-md">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">Dòng Sản Phẩm</h2>
                    <p className="font-body-md text-body-md text-text-muted mt-xs">Giải pháp chuyên biệt cho từng nhu cầu cơ
                        thể</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                {/* Category 1 */}
                <Link className="group block relative overflow-hidden rounded-[1.5rem] aspect-[4/5] shadow-ambient-1 border border-border-warm bg-surface-container-low"
                    href="/san-pham?need=co-vai-gay">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        data-alt="A stylized, softly lit close-up of a person's neck and shoulders draped with a warm, natural linen herbal compress pad."
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8u-Pb9_W9jEDxC9-Wh8JBusTNpvaxS_X45dZ4hPbNIdwFkW2CxiDVHGIt5I0XRglSGyfzsm-Fb0W6Hmf-cZ8QCSRJvI18aTA86ozSEYDFGAunhiyrJiJQXJpoyRUn-D9oUBgvMZ2v7alitiKvNmjD_nPOwWrfrxCpHEdlRYCQMqO70oan7jVafF0d8LiIr7RYFP0yK4tPPX6BZfnO00vvhZtnyASBGi65hfMbD3NyBQLgt0t75Ep6UpBChHony6rZxHkt2MkJols')" }}>
                    </div>
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent">
                    </div>
                    <div className="absolute bottom-0 left-0 p-md w-full">
                        <h3 className="font-headline-md text-headline-md text-on-primary mb-xs">Cổ Vai Gáy</h3>
                        <p className="font-body-md text-body-md text-on-primary/90 flex items-center gap-xs">
                            Khám phá <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </p>
                    </div>
                </Link>
                {/* Category 2 */}
                <Link className="group block relative overflow-hidden rounded-[1.5rem] aspect-[4/5] shadow-ambient-1 border border-border-warm bg-surface-container-low"
                    href="/san-pham?need=chuom-nong">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        data-alt="A minimal flat lay composition featuring a rectangular herbal heating pad on a bamboo tray."
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDU7Hg-nRJRypliTAzxSs5krgiNSxMW3rKV9hWJ8vet76xLN48JzIa7vDioWHnv8HqPXkdp9G8hKpgmTglsn-P1fdgoA3CGU03pnAJ8Ujwso2DyVPuvK8VvxqhP-Fv0YDE-_8efnv3dQhvgy-kAytVJvrMnSyMksS39ZbntQm6vAbQQ59nOy6ossHCXBozSNAgw9plzyGPSTBEwb0B1aikKUUDX_lLwWNod9sFc6Z1qzlkCIGqFQiAqaiG5Hb68UqwTmdqSukSm9eU')" }}>
                    </div>
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent">
                    </div>
                    <div className="absolute bottom-0 left-0 p-md w-full">
                        <h3 className="font-headline-md text-headline-md text-on-primary mb-xs">Chườm Nóng Tổng Hợp</h3>
                        <p className="font-body-md text-body-md text-on-primary/90 flex items-center gap-xs">
                            Khám phá <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </p>
                    </div>
                </Link>
                {/* Category 3 */}
                <Link className="group block relative overflow-hidden rounded-[1.5rem] aspect-[4/5] shadow-ambient-1 border border-border-warm bg-surface-container-low"
                    href="/san-pham?need=thu-gian-mat">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        data-alt="A peaceful image showing a person wearing a soft herbal eye mask."
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABJZSNEW3ls3UPS_Nfv-b4r4hlwn2FmDH4ySn_3fDBPvDHygptxHFlqDpkcbFI8Obmnuk5v-35LypmsaBYp1TR8yzf8ALWhPQEdHb5bSaziowppeSB9s2Tal1v4U8bUDkhpzi9Tc4gI41cz70fQ0CiELkMq2wgbNbODO4LG-_GVxc3ibWoZmPhFJBIl-Ju5Kb2-c3koCiR4fAcUD4mZTjK4c66isWpoibanQ2bLNQhwbqIvfOcHY94rX0C2F-1Q91QGv_vbCdTIVo')" }}>
                    </div>
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent">
                    </div>
                    <div className="absolute bottom-0 left-0 p-md w-full">
                        <h3 className="font-headline-md text-headline-md text-on-primary mb-xs">Thư Giãn Mắt</h3>
                        <p className="font-body-md text-body-md text-on-primary/90 flex items-center gap-xs">
                            Khám phá <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </p>
                    </div>
                </Link>
            </div>
        </section>
        {/* Featured Products */}
        <section className="px-gutter max-w-container-max mx-auto py-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-xl">Sản Phẩm Nổi Bật</h2>

            {productsLoading ? (
                <p className="text-center text-body-md text-text-muted">Đang tải sản phẩm...</p>
            ) : featuredProducts.length === 0 ? (
                <p className="text-center text-body-md text-text-muted">Chưa có sản phẩm còn hàng để hiển thị.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
                    {featuredProducts.map((product, index) => {
                        const imageUrl = product.thumbnailUrl ?? fallbackProductImages[index % fallbackProductImages.length];
                        const isAdding = addingProductSlug === product.slug;
                        const isOutOfStock = product.stockStatus === "OUT_OF_STOCK";

                        return (
                            <article
                                key={product.id ?? product.slug ?? product.name}
                                className="bg-surface rounded-xl border border-herbal-beige overflow-hidden shadow-ambient-1 group flex flex-col hover:shadow-ambient-2 transition-shadow"
                            >
                                <div className="relative aspect-square overflow-hidden bg-surface-container-low">
                                    {index === 0 && (
                                        <span className="absolute top-sm left-sm z-10 bg-success-bg text-primary px-xs py-1 rounded-full font-caption text-caption border border-primary/20">
                                            Bán chạy
                                        </span>
                                    )}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                        style={{ backgroundImage: `url('${imageUrl}')` }}
                                    />
                                </div>
                                <div className="p-sm flex flex-col flex-grow gap-xs">
                                    <h3 className="font-body-lg text-body-lg text-primary font-medium line-clamp-2">
                                        {product.name ?? "Sản phẩm NaHerbs"}
                                    </h3>
                                    <p className="font-price-display text-price-display text-text-main mt-auto">
                                        {formatProductPrice(product)}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => void handleAddProduct(product)}
                                        disabled={isAdding || isOutOfStock}
                                        className="mt-xs w-full py-2 rounded-full font-label-md text-label-md border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors flex justify-center items-center gap-xs disabled:cursor-not-allowed disabled:border-outline disabled:text-text-muted disabled:hover:bg-transparent"
                                    >
                                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                                        {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
            <div className="flex justify-center mt-lg">
                <Link href="/san-pham"
                    className="bg-surface border-2 border-primary text-primary rounded-full px-lg py-sm font-label-md text-label-md hover:bg-primary-fixed hover:border-transparent transition-colors">
                    Xem Tất Cả Sản Phẩm
                </Link>
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
                    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] bg-cover bg-center shadow-ambient-2 z-10 overflow-hidden border border-border-warm"
                        data-alt="A portrait of a serene, friendly wellness advisor or a beautifully styled abstract representation of 'AI guidance' using organic shapes and soft glowing lights. The color scheme is predominantly deep green, soft sage, and warm cream. The mood is helpful, intelligent, and deeply connected to nature."
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAyC3tCxgSnOoak_X9p8zInjIivp7FNw94ldwnAkYtB3Jr8_rUDcKgB8-7Otm205LBjJpvQzydbIR7c1-fZ93PufLuGyyqhuMpqDQaJ4E3Hcw80Qd2GTB2x89yzrygFrXbBYsaFryf10w6JIg8CV5PzW3OEkMqAnkQF3WAC01PoJqPfq2xed1501uVJ0YviuvVUsd2XCcDQbR9h9OdpeseC0WpIb7B_0Nc6AytP_C8LSr3OifTK2k7VUY6UvMv-yrET0BDTveVQXX4')" }}>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-md z-10">
                    <div
                        className="inline-flex items-center gap-xs bg-surface-bright px-sm py-xs rounded-full border border-secondary-fixed-dim w-fit shadow-sm">
                        <span className="material-symbols-outlined text-primary text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
                        <span className="font-label-md text-label-md text-primary">Chuyên Gia Trí Tuệ Nhân Tạo</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-primary">
                        Tìm liệu pháp phù hợp nhất cho bạn
                    </h2>
                    <p className="font-body-lg text-body-lg text-text-muted">
                        Không chắc sản phẩm nào phù hợp với tình trạng đau mỏi của bạn? Trợ lý AI của NaHerbs, được huấn
                        luyện dựa trên kiến thức đông y và vật lý trị liệu, luôn sẵn sàng lắng nghe và đưa ra gợi ý cá
                        nhân hóa 24/7.
                    </p>
                    <button
                        type="button"
                        onClick={openChatbot}
                        className="bg-primary text-on-primary rounded-full px-lg py-3 font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-ambient-2 w-fit flex items-center gap-sm mt-sm">
                        <span className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                        Trò chuyện cùng AI ngay
                    </button>
                </div>
            </div>
        </section>
    </main>
    <PublicFooter />
    </>
  );
}
