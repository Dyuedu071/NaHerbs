import Link from 'next/link';
import AuthFooterLink from './AuthFooterLink';

async function fetchSiteSettings(): Promise<Record<string, string>> {
    try {
        const apiBase =
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
        const res = await fetch(`${apiBase}/v1/settings/site-info`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return {};
        const json = await res.json();
        return json?.data || json || {};
    } catch {
        return {};
    }
}

export default async function PublicFooter() {
    const settings = await fetchSiteSettings();

    const storeName = settings.store_name || "NaHerbs";
    const tagline = settings.store_tagline || "Giải pháp thư giãn và phục hồi năng lượng từ thảo dược thiên nhiên, mang spa về ngôi nhà của bạn.";
    const hotline = settings.store_hotline || "1900 xxxx";
    const email = settings.store_email || "care@naherbs.vn";
    const zaloUrl = settings.store_zalo_url || "https://zalo.me";

    return (
        <footer id="contact" className="w-full pt-xl pb-md bg-primary dark:bg-on-primary-fixed-variant">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
                {/* Brand Column */}
                <div className="flex flex-col gap-sm">
                    <Link className="font-display-lg text-display-lg text-on-primary" href="/">{storeName}</Link>
                    <p className="font-body-md text-body-md text-on-primary/80 mt-xs">
                        {tagline}
                    </p>
                </div>
                {/* Links Column 1 */}
                <div className="flex flex-col gap-sm">
                    <h4 className="font-headline-md text-headline-md text-on-primary mb-xs text-xl">Dòng Sản Phẩm</h4>
                    <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                        href="/san-pham?need=co-vai-gay">Cổ Vai Gáy</Link>
                    <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                        href="/san-pham?need=chuom-nong">Chườm Lưng Bụng</Link>
                    <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                        href="/san-pham?need=thu-gian-mat">Thư Giãn Mắt</Link>
                    <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                        href="/san-pham">Tất Cả Sản Phẩm</Link>
                </div>
                {/* Links Column 2 */}
                <div className="flex flex-col gap-sm">
                    <h4 className="font-headline-md text-headline-md text-on-primary mb-xs text-xl">Hỗ Trợ</h4>
                    <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                        href="/tin-tuc">Tin tức & Blog</Link>
                    <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                        href="/gioi-thieu">Giới thiệu {storeName}</Link>
                    <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                        href="/lien-he">Liên hệ</Link>
                    <AuthFooterLink />
                </div>
                {/* Contact Column */}
                <div className="flex flex-col gap-sm">
                    <h4 className="font-headline-md text-headline-md text-on-primary mb-xs text-xl">Liên Hệ</h4>
                    <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors flex items-center gap-xs"
                        href={`tel:${hotline.replace(/\s+/g, '')}`}>
                        <span className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>phone</span> Hotline: {hotline}
                    </a>
                    <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors flex items-center gap-xs"
                        href={zaloUrl} target="_blank" rel="noopener noreferrer">
                        <span className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>forum</span> Zalo: {storeName} Official
                    </a>
                    <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors flex items-center gap-xs"
                        href={`mailto:${email}`}>
                        <span className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>mail</span> Email: {email}
                    </a>
                </div>
            </div>
            <div
                className="px-gutter max-w-container-max mx-auto mt-xl pt-md border-t border-on-primary/20 flex flex-col md:flex-row justify-between items-center">
                <p className="font-caption text-caption text-on-primary/60">
                    © {new Date().getFullYear()} {storeName}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
