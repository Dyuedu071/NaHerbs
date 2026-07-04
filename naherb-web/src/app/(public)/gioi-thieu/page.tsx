import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Về NaHerbs | Tinh hoa thảo dược thiên nhiên',
  description: 'Tinh hoa thảo dược, chăm sóc sức khỏe từ thiên nhiên',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      
      
      <main className="flex-grow pt-20">

        {/*  Hero Section  */}
        <section className="relative min-h-[716px] flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10">
                </div>
                <div className="w-full h-full bg-cover bg-center opacity-40"
                    data-alt="A lush, serene medicinal herb garden at sunrise, with soft golden light filtering through sage green leaves and delicate white blossoms. The style is professional architectural photography with a focus on macro botanical details and a minimalist, clean aesthetic that feels organic and spa-like."
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBBhOtjBYaaMC3LTXP8UABhgHPLmet9ZhG8C1r04hIlukYA1aPvaRhsXzIXQmX4V-XGPKEZgjOeMp_eG7OKhp4UlGeF1sLWTz9hnpR1B8npPOOdjEjHrvBqGRDv-1JmTIcLfSbNd6pvgcRslpjAuyyK12xh_5FJbNTprMb6nky_nJsg425ZmHY75uGeizMKbKIGSRI-Y9R1VOrrQiFj_WKUQKRA3yrb810Ee8N7gjadqvKXSOBol1_hMID-Gmls9PHjLDBQzdPv0jQ')` }}>
                </div>
            </div>
            <div className="max-w-container-max mx-auto px-gutter relative z-20">
                <div className="max-w-2xl">
                    <h1 className="font-display-lg text-display-lg text-primary mb-sm">Về NaHerbs</h1>
                    <p className="font-headline-lg text-secondary opacity-90 leading-tight">
                        Tinh hoa thảo dược, chăm sóc sức khỏe từ thiên nhiên
                    </p>
                    <div className="mt-lg flex gap-md">
                        <div className="w-12 h-[2px] bg-soft-sage self-center"></div>
                        <p className="font-body-lg text-on-surface-variant max-w-md italic">
                            Chúng tôi tin rằng mẹ thiên nhiên luôn nắm giữ những bí mật tuyệt vời nhất để duy trì vẻ đẹp
                            và sức khỏe bền vững.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        {/*  Brand Story Section  */}
        <section className="py-xl max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
                <div className="relative">
                    <div className="rounded-xl overflow-hidden tonal-shadow border border-herbal-beige/30 relative aspect-[4/5] w-full">
                        <Image className="object-cover"
                            fill
                            alt="A close-up artistic shot of a traditional herbalist's workspace"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwE9_UxJnKtVCN7DhEkUPPA-zJ2nALbTnyP74xPQpkES0IdNXoCpFIeACHjBrYf7pMN8sMd-0j5KsecYRPZiKMfdcXeq0aq_pkRMEml3L4i-wJnDbP3aOfwjjPiZsBYBHqGORA0kZ4YVDJWM4_S8tRwAAp5h1Fda19wk-jbVoYL03TbHfxk-W84OXeqIxr1RZWKHkGEhZk_lYqy3UVTixZpDHBO_wlJR1Y50hP72hZe7tfnlh0QcCcaK__WVlQjsEwA1mk5i94qps" />
                    </div>
                    <div
                        className="absolute -bottom-md -right-md bg-primary-container p-md rounded-xl text-on-primary-container shadow-lg hidden md:block">
                        <span className="font-display-lg text-display-lg block">10+</span>
                        <span className="font-label-md">Năm kinh nghiệm</span>
                    </div>
                </div>
                <div className="space-y-md">
                    <span className="font-label-md text-primary uppercase tracking-widest">Câu chuyện thương hiệu</span>
                    <h2 className="font-headline-lg text-primary">Về NaHerbs</h2>
                    <p className="font-body-lg text-on-surface-variant">
                        NaHerbs là thương hiệu chăm sóc sức khỏe cá nhân và gia đình, mang đến những giá trị tuyệt vời
                        từ thảo dược tự nhiên. Chúng tôi tận tâm phát triển các sản phẩm an toàn, hiệu quả, đáp ứng nhu
                        cầu chăm sóc sức khỏe toàn diện trong cuộc sống hiện đại.
                    </p>
                    <div className="pt-md">
                        <button
                            className="border border-primary text-primary font-label-md px-md py-xs rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300">
                            Khám phá quy trình
                        </button>
                    </div>
                </div>
            </div>
        </section>
        {/*  Mission & Vision Section  */}
        <section className="py-xl bg-surface-container/50">
            <div className="max-w-container-max mx-auto px-gutter">
                <div className="text-center mb-xl max-w-2xl mx-auto">
                    <h2 className="font-headline-lg text-primary mb-md">Tầm nhìn &amp; Sứ mệnh</h2>
                    <p className="font-body-md text-on-surface-variant">Định hướng phát triển bền vững vì sức khỏe cộng đồng
                        và sự cân bằng của hệ sinh thái.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {/*  Vision Card  */}
                    <div
                        className="bg-white p-lg rounded-xl tonal-shadow border border-herbal-beige/20 group hover:-translate-y-2 transition-transform duration-300">
                        <div
                            className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-primary text-[32px]">visibility</span>
                        </div>
                        <h3 className="font-headline-md text-primary mb-sm">Tầm nhìn</h3>
                        <p className="font-body-lg text-on-surface-variant">
                            Đến năm 2029, NaHerbs hướng tới trở thành thương hiệu Việt Nam hàng đầu trong lĩnh vực chăm
                            sóc sức khỏe tự nhiên, vươn tầm quốc tế với những sản phẩm chất lượng và uy tín.
                        </p>
                    </div>
                    {/*  Mission Card  */}
                    <div
                        className="bg-white p-lg rounded-xl tonal-shadow border border-herbal-beige/20 group hover:-translate-y-2 transition-transform duration-300">
                        <div
                            className="w-16 h-16 bg-secondary-container/30 rounded-full flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-primary text-[32px]">eco</span>
                        </div>
                        <h3 className="font-headline-md text-primary mb-sm">Sứ mệnh</h3>
                        <p className="font-body-lg text-on-surface-variant">
                            Sứ mệnh của NaHerbs là mang đến những giải pháp chăm sóc sức khỏe từ thảo dược an toàn, hiệu
                            quả, góp phần nâng cao chất lượng cuộc sống và bảo vệ sức khỏe cho mọi gia đình.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        {/*  4R Core Values Section  */}
        <section className="py-xl max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-xl">
                <h2 className="font-headline-lg text-primary">Giá trị cốt lõi 4R</h2>
                <div className="w-20 h-1 bg-soft-sage mx-auto mt-sm"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {/*  Responsibility  */}
                <div className="text-center group">
                    <div
                        className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-md rotate-3 group-hover:rotate-0 transition-transform duration-300">
                        <span className="material-symbols-outlined text-[36px]">shield_with_heart</span>
                    </div>
                    <h4 className="font-label-md text-headline-md text-primary mb-xs">Responsibility</h4>
                    <p className="font-body-md text-on-surface-variant">Cam kết sản phẩm an toàn, lối sống lành mạnh.</p>
                </div>
                {/*  Respectability  */}
                <div className="text-center group">
                    <div
                        className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-md -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                        <span className="material-symbols-outlined text-[36px]">verified</span>
                    </div>
                    <h4 className="font-label-md text-headline-md text-primary mb-xs">Respectability</h4>
                    <p className="font-body-md text-on-surface-variant">Trân trọng thảo dược Việt, nguyên liệu chất lượng.
                    </p>
                </div>
                {/*  Renovation  */}
                <div className="text-center group">
                    <div
                        className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-md rotate-6 group-hover:rotate-0 transition-transform duration-300">
                        <span className="material-symbols-outlined text-[36px]">lightbulb</span>
                    </div>
                    <h4 className="font-label-md text-headline-md text-primary mb-xs">Renovation</h4>
                    <p className="font-body-md text-on-surface-variant">Nghiên cứu cải tiến, kết hợp thảo dược và thiết kế
                        hiện đại.</p>
                </div>
                {/*  Reliability  */}
                <div className="text-center group">
                    <div
                        className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center text-on-primary mb-md -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                        <span className="material-symbols-outlined text-[36px]">handshake</span>
                    </div>
                    <h4 className="font-label-md text-headline-md text-primary mb-xs">Reliability</h4>
                    <p className="font-body-md text-on-surface-variant">Xây dựng niềm tin qua chất lượng và dịch vụ tận tâm.
                    </p>
                </div>
            </div>
        </section>
        {/*  Product Philosophy Section  */}
        <section className="py-xl mb-xl">
            <div className="max-w-container-max mx-auto px-gutter">
                <div className="bg-primary rounded-xl p-lg md:p-xl relative overflow-hidden">
                    {/*  Subtle background decoration  */}
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[400px] absolute -top-20 -right-20">spa</span>
                    </div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-lg items-center">
                        <div className="lg:col-span-3">
                            <span className="font-label-md text-primary-fixed uppercase tracking-widest mb-xs block">Triết
                                lý sản phẩm</span>
                            <h2 className="font-display-lg text-on-primary mb-md text-[42px]">100% Thuần khiết &amp; Thủ
                                công</h2>
                            <p className="font-body-lg text-on-primary/80 mb-lg">
                                Chúng tôi từ chối các thành phần hóa học độc hại. Mỗi sản phẩm của NaHerbs là sự kết hợp
                                hoàn hảo giữa phương pháp thủ công tỉ mỉ và tiêu chuẩn vệ sinh hiện đại, đảm bảo giữ
                                trọn vẹn hoạt tính sinh học của dược liệu.
                            </p>
                            <div className="grid grid-cols-2 gap-md">
                                <div className="flex items-center gap-xs text-on-primary">
                                    <span className="material-symbols-outlined text-soft-sage"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="font-label-md">Không paraben</span>
                                </div>
                                <div className="flex items-center gap-xs text-on-primary">
                                    <span className="material-symbols-outlined text-soft-sage"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="font-label-md">Không hương liệu tổng hợp</span>
                                </div>
                                <div className="flex items-center gap-xs text-on-primary">
                                    <span className="material-symbols-outlined text-soft-sage"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="font-label-md">Nguyên liệu canh tác hữu cơ</span>
                                </div>
                                <div className="flex items-center gap-xs text-on-primary">
                                    <span className="material-symbols-outlined text-soft-sage"
                                        style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <span className="font-label-md">Quy trình khép kín</span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="aspect-square rounded-xl overflow-hidden border-4 border-white/20 tonal-shadow relative w-full h-full">
                                <Image className="object-cover"
                                    fill
                                    alt="A cinematic close-up of clear glass dropper bottles containing golden herbal oil"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkzyx12B4fNeHc_Xa5LNAKoPQAJv3qoQfqFnr2HkPiE8vLjbeS5JDtAV7M2fImvg2vXVYcE2zwgpwjDXGkmBxqpHja2A9_z_ur2GRStWpfBj4zTpe6XvrExKI_SFtR9-XONCgluGaIZlHSAk4NXpp6iy_wZgE7Xs96O5duX5QU5ZIQmDsMammm5x-lkQNYyQ2ifKKaYtDhSqBszo0d-fONnvtZfHllyYGcTPmRhyqdq0bJ_LfzhNwRVvjmycqZ8PmEWQ6EBaLdoms" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    
      </main>

      
    </div>
  );
}
