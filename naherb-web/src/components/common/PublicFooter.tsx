import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer id="contact" className="w-full pt-xl pb-md bg-primary dark:bg-on-primary-fixed-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-gutter max-w-container-max mx-auto">
            {/* Brand Column */}
            <div className="flex flex-col gap-sm">
                <Link className="font-display-lg text-display-lg text-on-primary" href="/">NaHerbs</Link>
                <p className="font-body-md text-body-md text-on-primary/80 mt-xs">
                    Giải pháp thư giãn và phục hồi năng lượng từ thảo dược thiên nhiên, mang spa về ngôi nhà của bạn.
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
                    href="/#about">Giới thiệu NaHerbs</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                    href="/#contact">Liên hệ</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
                    href="/dang-nhap">Đăng nhập / Đăng ký</Link>
            </div>
            {/* Contact Column */}
            <div className="flex flex-col gap-sm">
                <h4 className="font-headline-md text-headline-md text-on-primary mb-xs text-xl">Liên Hệ</h4>
                <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors flex items-center gap-xs"
                    href="tel:1900xxxx">
                    <span className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}>phone</span> Hotline: 1900 xxxx
                </a>
                <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors flex items-center gap-xs"
                    href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                    <span className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}>forum</span> Zalo: NaHerbs Official
                </a>
                <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors flex items-center gap-xs"
                    href="mailto:care@naherbs.vn">
                    <span className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}>mail</span> Email: care@naherbs.vn
                </a>
            </div>
        </div>
        <div
            className="px-gutter max-w-container-max mx-auto mt-xl pt-md border-t border-on-primary/20 flex flex-col md:flex-row justify-between items-center">
            <p className="font-caption text-caption text-on-primary/60">
                © {new Date().getFullYear()} NaHerbs. All rights reserved.
            </p>
        </div>
    </footer>
  );
}
