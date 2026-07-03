import { Metadata } from 'next';
import { getSiteSettingsPublic } from '@/services/generated/seo/seo';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';

export const metadata: Metadata = {
  title: 'Liên hệ | NaHerbs',
  description: 'Liên hệ với NaHerbs để được tư vấn về các sản phẩm thảo dược và chăm sóc sức khỏe.',
};

export default async function ContactPage() {
  const siteSettings = await getSiteSettingsPublic().catch(() => null);
  
  let settingsData: any = {};
  if (siteSettings && typeof siteSettings === 'object' && 'data' in siteSettings) {
    settingsData = (siteSettings as any).data || {};
  } else if (siteSettings) {
    settingsData = siteSettings;
  }

  const {
    storeName = 'NaHerbs',
    contactEmail = 'contact@naherbs.vn',
    contactPhone = '0988 123 456',
    address = '123 Đường Mẫu, Quận 1, TP. Hồ Chí Minh',
    facebookUrl = '#',
    instagramUrl = '#',
  } = settingsData;

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      <PublicHeader />
      
      <main className="flex-grow pt-24 pb-xl px-gutter max-w-container-max mx-auto w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-xl">
            <h1 className="font-display-lg-mobile md:text-display-lg text-primary mb-sm font-bold">Liên Hệ</h1>
            <p className="font-body-md text-text-muted">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-low p-lg rounded-2xl border border-surface-variant shadow-[0_8px_30px_-4px_rgba(46,77,57,0.1)]">
            {/* Contact Info */}
            <div className="space-y-lg">
              <h2 className="font-headline-md text-primary font-semibold mb-md border-b border-border-warm pb-sm">Thông tin liên hệ</h2>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[24px]">location_on</span>
                </div>
                <div>
                  <h3 className="font-label-md text-text-main mb-1">Địa chỉ</h3>
                  <p className="font-body-md text-text-muted leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </div>
                <div>
                  <h3 className="font-label-md text-text-main mb-1">Điện thoại</h3>
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="font-body-md text-primary hover:underline transition-colors">{contactPhone}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[24px]">mail</span>
                </div>
                <div>
                  <h3 className="font-label-md text-text-main mb-1">Email</h3>
                  <a href={`mailto:${contactEmail}`} className="font-body-md text-primary hover:underline transition-colors">{contactEmail}</a>
                </div>
              </div>

              <div className="pt-md border-t border-border-warm">
                <h3 className="font-label-md text-text-main mb-4">Kết nối với chúng tôi</h3>
                <div className="flex gap-4">
                  {facebookUrl && facebookUrl !== '#' && (
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {instagramUrl && instagramUrl !== '#' && (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form Placeholder */}
            <div className="bg-white p-lg rounded-xl border border-border">
              <h3 className="font-headline-md text-primary mb-md font-semibold">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-label-md text-text-main mb-1">Họ và tên</label>
                  <input type="text" id="name" className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg focus:ring-2 focus:ring-primary/20 text-body-md" placeholder="Nhập họ tên của bạn" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-label-md text-text-main mb-1">Email</label>
                  <input type="email" id="email" className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg focus:ring-2 focus:ring-primary/20 text-body-md" placeholder="Nhập email của bạn" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-label-md text-text-main mb-1">Nội dung</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-2 bg-surface-container-low border border-surface-variant rounded-lg focus:ring-2 focus:ring-primary/20 text-body-md resize-none" placeholder="Nhập nội dung tin nhắn..."></textarea>
                </div>
                <button type="button" className="w-full py-3 bg-primary text-white rounded-full font-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-md">
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
