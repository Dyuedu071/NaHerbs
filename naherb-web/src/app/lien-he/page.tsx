import { Metadata } from 'next';
import { getSiteSettingsPublic } from '@/services/generated/seo/seo';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Liên hệ | NaHerbs',
    description: 'Liên hệ với NaHerbs để được tư vấn về các sản phẩm thảo dược và chăm sóc sức khỏe.',
};

export default async function ContactPage() {
    const siteSettings = await getSiteSettingsPublic().catch(() => null);

    let settingsData: Record<string, string> = {};
    if (siteSettings && typeof siteSettings === 'object' && 'data' in siteSettings) {
        settingsData = (siteSettings as { data?: Record<string, string> }).data || {};
    } else if (siteSettings) {
        settingsData = siteSettings as unknown as Record<string, string>;
    }

    const {
        contactEmail = 'contact@naherbs.vn',
        contactPhone = '0988 123 456',
        address = '123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh',
    } = settingsData;

    return (
        <div className="min-h-screen bg-surface-container-lowest flex flex-col">
            <PublicHeader />

            <main className="flex-grow pt-xl pb-xl mt-20 relative">

                {/*  Subtle Herbal Decoration  */}
                <div className="max-w-container-max mx-auto px-gutter">
                    {/*  Header Section  */}
                    <div className="text-center mb-xl">
                        <h1 className="font-display-lg text-display-lg text-primary mb-md">Kết nối với chúng tôi</h1>
                        <p className="font-body-lg text-body-lg text-text-muted max-w-2xl mx-auto">Chúng tôi luôn ở đây để lắng nghe
                            và hỗ trợ hành trình chăm sóc sức khỏe tự nhiên của bạn.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                        {/*  Left: Contact Form  */}
                        <div
                            className="lg:col-span-7 bg-surface-container-lowest p-lg rounded-xl custom-shadow border border-herbal-beige/30">
                            <h2 className="font-headline-md text-headline-md text-secondary mb-lg">Gửi lời nhắn</h2>
                            <form className="space-y-md"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                    <div className="space-y-xs">
                                        <label className="font-label-md text-label-md text-on-surface-variant block">Họ và
                                            tên</label>
                                        <input
                                            className="w-full h-[48px] bg-surface rounded-lg border-border-warm focus:border-primary focus:ring-1 focus:ring-primary transition-all px-md"
                                            placeholder="Nguyễn Văn A" type="text" />
                                    </div>
                                    <div className="space-y-xs">
                                        <label className="font-label-md text-label-md text-on-surface-variant block">Số điện
                                            thoại</label>
                                        <input
                                            className="w-full h-[48px] bg-surface rounded-lg border-border-warm focus:border-primary focus:ring-1 focus:ring-primary transition-all px-md"
                                            placeholder="090 123 4567" type="tel" />
                                    </div>
                                </div>
                                <div className="space-y-xs">
                                    <label className="font-label-md text-label-md text-on-surface-variant block">Email</label>
                                    <input
                                        className="w-full h-[48px] bg-surface rounded-lg border-border-warm focus:border-primary focus:ring-1 focus:ring-primary transition-all px-md"
                                        placeholder="example@email.com" type="email" />
                                </div>
                                <div className="space-y-xs">
                                    <label className="font-label-md text-label-md text-on-surface-variant block">Lời nhắn của
                                        bạn</label>
                                    <textarea
                                        className="w-full bg-surface rounded-lg border-border-warm focus:border-primary focus:ring-1 focus:ring-primary transition-all px-md py-sm"
                                        placeholder="Bạn cần chúng tôi tư vấn điều gì?" rows={5}></textarea>
                                </div>
                                <button
                                    className="w-full md:w-auto px-xl py-md bg-primary text-on-primary rounded-full font-label-md text-label-md hover:scale-105 hover:bg-secondary transition-all duration-200 active:scale-95 shadow-md"
                                    type="submit">Gửi ngay</button>
                            </form>
                        </div>
                        {/*  Right: Info Cards  */}
                        <div className="lg:col-span-5 space-y-md">
                            {/*  Hotline Card  */}
                            <div
                                className="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-herbal-beige/30 flex items-start gap-md group hover:translate-y-[-4px] transition-transform duration-300">
                                <div
                                    className="w-14 h-14 rounded-full bg-success-bg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                    <span className="material-symbols-outlined text-[32px]" data-icon="call">call</span>
                                </div>
                                <div>
                                    <h3 className="font-label-md text-label-md text-text-muted mb-base">Hotline</h3>
                                    <p className="font-price-display text-price-display text-primary">{contactPhone}</p>
                                    <p className="font-caption text-caption text-text-muted">Hỗ trợ 24/7 cho các vấn đề cấp bách</p>
                                </div>
                            </div>
                            {/*  Zalo/Email Card  */}
                            <div
                                className="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-herbal-beige/30 flex items-start gap-md group hover:translate-y-[-4px] transition-transform duration-300">
                                <div
                                    className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                                    <span className="material-symbols-outlined text-[32px]"
                                        data-icon="alternate_email">alternate_email</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-label-md text-label-md text-text-muted mb-base">Zalo &amp; Email</h3>
                                    <div className="space-y-base">
                                        <p className="font-body-lg font-bold text-on-surface">{contactEmail}</p>
                                        <p className="font-body-lg font-bold text-on-surface">Zalo: NaHerbs Official</p>
                                    </div>
                                </div>
                            </div>
                            {/*  Address Card  */}
                            <div
                                className="bg-surface-container-lowest p-md rounded-xl custom-shadow border border-herbal-beige/30 flex items-start gap-md group hover:translate-y-[-4px] transition-transform duration-300">
                                <div
                                    className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-earth-brown group-hover:bg-earth-brown group-hover:text-on-primary transition-colors">
                                    <span className="material-symbols-outlined text-[32px]"
                                        data-icon="location_on">location_on</span>
                                </div>
                                <div>
                                    <h3 className="font-label-md text-label-md text-text-muted mb-base">Địa chỉ trụ sở</h3>
                                    <p className="font-body-md text-body-md text-on-surface">{address}</p>
                                </div>
                            </div>
                            {/*  Featured Botanical Image  */}
                            <div className="rounded-xl overflow-hidden h-48 custom-shadow border border-herbal-beige/30 relative">
                                <Image className="object-cover"
                                    fill
                                    alt="A minimalist and high-end lifestyle photograph of a variety of dried organic herbs and green tea leaves stored in clear glass apothecary jars"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCefUvm5Ktk4tugRDKVdF_kNLv-DdLNznuFuZ0dZMZoyZexHd-9dv-rA7BU4_G-vo08CCiFNpzY-ulWXr70M3OaML22FXc2YOjc8vuE4xAFFgjR9xXmUdViGw_WG4Ioa5uEFFLcC-PBL-H7DN6bEdfRcghzi1j9rseu6c9nOH-EuuEnSSm6ornLxi9QkXTGrxLxXhRwQp_5swnhZsBPPdh7vZhoJ7GccFODCd3DYlQxszHGX-SIV6CLZXVd1Q7eSDApVgsDg5uMhG0" />
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
}
