"use client";

import Link from 'next/link';
import PublicHeader from '@/components/common/PublicHeader';

export default function Blog() {

  return (
    <>
    {/* TopNavBar */}
    <PublicHeader />

    <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="w-full bg-surface py-xl px-gutter">
            <div className="max-w-container-max mx-auto text-center">
                <h1 className="font-display-lg text-display-lg text-primary mb-md">Cẩm nang Sức khỏe NaHerbs</h1>
                <p className="font-body-lg text-body-lg text-text-muted max-w-2xl mx-auto">
                    Khám phá những bí quyết chăm sóc sức khỏe tự nhiên, từ các bài thuốc dân gian đến mẹo vặt hàng ngày
                    với thảo dược thiên nhiên, giúp bạn duy trì một lối sống cân bằng và an lành.
                </p>
            </div>
        </section>
        {/* Featured Article & Search/Filter Section */}
        <section className="max-w-container-max mx-auto px-gutter pb-xl">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-md mb-xl">
                {/* Filters */}
                <div className="flex flex-wrap gap-xs">
                    <button
                        className="px-6 py-3 rounded-full font-label-md text-label-md bg-primary text-on-primary transition-all duration-200 shadow-level-1">Tất
                        cả</button>
                    <button
                        className="px-6 py-3 rounded-full font-label-md text-label-md bg-surface border border-border-warm text-secondary hover:border-primary hover:text-primary transition-all duration-200 shadow-level-1">Sức
                        khỏe</button>
                    <button
                        className="px-6 py-3 rounded-full font-label-md text-label-md bg-surface border border-border-warm text-secondary hover:border-primary hover:text-primary transition-all duration-200 shadow-level-1">Mẹo
                        thảo dược</button>
                    <button
                        className="px-6 py-3 rounded-full font-label-md text-label-md bg-surface border border-border-warm text-secondary hover:border-primary hover:text-primary transition-all duration-200 shadow-level-1">Chăm
                        sóc tại nhà</button>
                </div>
                {/* Search */}
                <div className="relative w-full md:w-80 group">
                    <input
                        className="w-full h-12 pl-12 pr-4 rounded-full bg-surface border border-border-warm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 font-body-md text-body-md placeholder-text-muted shadow-level-1 group-hover:shadow-level-2"
                        placeholder="Tìm kiếm bài viết..." type="text" />
                    <span
                        className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">search</span>
                </div>
            </div>
            {/* Featured Article Bento/Glassmorphism style */}
            <div className="relative rounded-2xl overflow-hidden shadow-level-2 group cursor-pointer h-[500px] mb-xl">
                {/* Image */}
                <div className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBKxQEnWFCUbEvDghL5pCA9LdYNK29ahy831jKqQ-QWXeHrw1QV2_uWriBTiI4KYgoClZKdrDbbSmLRInnWJ07NHHtPmNfs9ldnYoDWpQzyIRuLPQHad3P0qVcQ7rPj7Z2NzJAGuT-Iw2zARUQ3K-6pCjAau4vGfIpZVFV5uMmGx0Iq9c4D0LbNIRDp8kU1BVVP8JY1VOG2qFsK5ZiZkZl3gXN1_oWDyoeD8Y7Hq8P2BSszu4n6F53ycJfmQpNblMk1VsdJ-Mx2GTQ')" }}>
                </div>
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/30 to-transparent">
                </div>
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-lg w-full md:w-2/3">
                    <span
                        className="inline-block px-4 py-1.5 bg-success-bg/90 backdrop-blur-sm text-primary rounded-full font-label-md text-label-md mb-md">Bài
                        viết nổi bật</span>
                    <h2
                        className="font-headline-lg text-headline-lg text-on-primary mb-md group-hover:text-secondary-fixed transition-colors">
                        7 Loại Thảo Dược Giúp Cải Thiện Giấc Ngủ Tự Nhiên</h2>
                    <p className="font-body-md text-body-md text-on-primary/90 mb-md line-clamp-2">Giấc ngủ ngon là nền tảng
                        của một sức khỏe tốt. Khám phá cách sử dụng hoa cúc, tâm sen, và các loại thảo dược khác để thư
                        giãn hệ thần kinh, mang lại giấc ngủ sâu và trọn vẹn hơn mỗi đêm.</p>
                    <button
                        className="inline-flex items-center gap-xs font-label-md text-label-md text-on-primary hover:text-secondary-fixed transition-colors">
                        Xem thêm <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>
            </div>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {/* Card 1 */}
                <article
                    className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                    <div className="relative w-full pt-[56.25%] overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            alt="A macro shot of a warm cup of herbal tea"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC50KLWUXzNFDb9gJRoAMMuaB-uMM1GXAYuINlPLwU_hSiSD205DmAfjdwMHwnb2bx0C2C_IXdCQmYelRb3JwPjvgdA_mziLk_nvay1yV8zb7UBSPZ_BwVUT9dZrBYeSuq9ahQ36S2CbhKJ7VGl4z0mKf47EiFyuw-zEGmjjiaPzePmAkxYR6UklNdLBBsdvvfcdK3qP4Xdn7zbuSjhBdTnPffSYYg_ru-PwZW37A_c5V6RHF2mzxvBhLirDXOwWUO1YdCEqH41qcg" />
                        <div
                            className="absolute top-4 left-4 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full font-caption text-caption text-primary">
                            Sức khỏe</div>
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                        <time className="font-caption text-caption text-text-muted mb-xs block">24 Tháng 10, 2024</time>
                        <h3
                            className="font-headline-md text-headline-md text-primary mb-sm line-clamp-2 group-hover:text-earth-brown transition-colors">
                            Công Dụng Bất Ngờ Của Nha Đam Trong Việc Phục Hồi Dạ Dày</h3>
                        <p className="font-body-md text-body-md text-text-muted line-clamp-3 mb-md flex-grow">Không chỉ làm
                            đẹp da, nha đam còn chứa nhiều enzyme giúp hỗ trợ tiêu hóa, làm dịu niêm mạc dạ dày và giảm
                            thiểu triệu chứng trào ngược axit hiệu quả.</p>
                        <a className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown hover:text-primary transition-colors mt-auto"
                            href="#">
                            Đọc tiếp <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                        </a>
                    </div>
                </article>
                {/* Card 2 */}
                <article
                    className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                    <div className="relative w-full pt-[56.25%] overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            alt="A beautifully styled kitchen counter"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAi7FUNx9v5JkXavr2yIRJtG4ZRRj6RZmunAr7FJPvqf7vDm8V4CtRKnFZ7EokMzxjjkO0xRVM1vfADtROQ0den2OBvTBYsU_-Y49hUJlFW7LSjxccUX9NDZrXub9KBrL5s7aBLWGI0_cYriFzXP0Bas6t43XVIZUv0XwAAhNQSjJ3LRf5wGq2eklO8Mplg2eW2II3N4C5YnO23eH9DI8FlBgvHZZmMrFxsl-sZznGCYSSb8NUd04ZZz91jpzhlXHZKKjhfrdSeXvM" />
                        <div
                            className="absolute top-4 left-4 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full font-caption text-caption text-primary">
                            Mẹo thảo dược</div>
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                        <time className="font-caption text-caption text-text-muted mb-xs block">20 Tháng 10, 2024</time>
                        <h3
                            className="font-headline-md text-headline-md text-primary mb-sm line-clamp-2 group-hover:text-earth-brown transition-colors">
                            Cách Tối Ưu Hóa Khả Năng Hấp Thụ Nghệ (Curcumin)</h3>
                        <p className="font-body-md text-body-md text-text-muted line-clamp-3 mb-md flex-grow">Nghệ là một
                            chất chống viêm tuyệt vời, nhưng cơ thể rất khó hấp thụ. Hãy tìm hiểu lý do tại sao bạn luôn
                            nên kết hợp nghệ với hạt tiêu đen và một chút chất béo lành mạnh.</p>
                        <a className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown hover:text-primary transition-colors mt-auto"
                            href="#">
                            Đọc tiếp <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                        </a>
                    </div>
                </article>
                {/* Card 3 */}
                <article
                    className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                    <div className="relative w-full pt-[56.25%] overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            alt="A person's hands gently massaging a soothing botanical balm"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC45qYqKpI4JFo1cag_Cpxv44_J-hFTlbQ3LkTGIsF7kR-nud_Q3SjcTaZmslJ5lO9PXJHWCv1NTKp8B_CHF4PjKMDG6Z_oZaq3C6LJGgpP31dyYTJY3DohfXuMNejQe0WaL7kSoFlDS6Ieo9SR7QgHid44l8guUO-svE691-YoTbvCB7zOq-O9mCvLjdntt0KO7rR1J9Ht_RhkL79-4gtmR2vgAXoCaUltyjVHqHbLKOp0VijywfNl9VQgRzqgW81Rne8-pisnT08" />
                        <div
                            className="absolute top-4 left-4 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full font-caption text-caption text-primary">
                            Chăm sóc tại nhà</div>
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                        <time className="font-caption text-caption text-text-muted mb-xs block">15 Tháng 10, 2024</time>
                        <h3
                            className="font-headline-md text-headline-md text-primary mb-sm line-clamp-2 group-hover:text-earth-brown transition-colors">
                            Massage Tinh Dầu Bạch Đàn Giảm Đau Cổ Vai Gáy</h3>
                        <p className="font-body-md text-body-md text-text-muted line-clamp-3 mb-md flex-grow">Hướng dẫn chi
                            tiết cách tự xoa bóp tại nhà với tinh dầu bạch đàn và dầu nền để làm giãn cơ, giảm căng
                            thẳng sau một ngày dài làm việc trước máy tính.</p>
                        <a className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown hover:text-primary transition-colors mt-auto"
                            href="#">
                            Đọc tiếp <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                        </a>
                    </div>
                </article>
                {/* Card 4 */}
                <article
                    className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                    <div className="relative w-full pt-[56.25%] overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            alt="A flat lay composition of various dried herbs"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHLoCLuaqIXRJ4BognbH4rMefogERzVvSBWR4dHrGS0XWrrM0RnAvbsVYxLm4woR6FTm_WjDT9n__GV5fZAgFVrm74psthK2DG96mZzCRDsS9ab66jkrBar0QfBdRN4z0iEyGhsReA2wEgAMvvDQp6oMsdtbmMzs8BKNsIYYZVZWlUF3Ynh2Y2YVHLTIrYNrOP5kwH5t63XgaTthOoVAJNwZFejPBCi_l24dWUARr_hgPiYi7_g4GDCaxtlW9qbAB0RjFZV8Z4QHc" />
                        <div
                            className="absolute top-4 left-4 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full font-caption text-caption text-primary">
                            Sức khỏe</div>
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                        <time className="font-caption text-caption text-text-muted mb-xs block">10 Tháng 10, 2024</time>
                        <h3
                            className="font-headline-md text-headline-md text-primary mb-sm line-clamp-2 group-hover:text-earth-brown transition-colors">
                            Gia Vị Mùa Đông: Tăng Cường Miễn Dịch Tự Nhiên</h3>
                        <p className="font-body-md text-body-md text-text-muted line-clamp-3 mb-md flex-grow">Bổ sung quế,
                            hồi và gừng vào thực đơn hàng ngày không chỉ làm tăng hương vị món ăn mà còn là tấm khiên
                            vững chắc bảo vệ hệ miễn dịch trong những ngày chuyển mùa.</p>
                        <a className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown hover:text-primary transition-colors mt-auto"
                            href="#">
                            Đọc tiếp <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                        </a>
                    </div>
                </article>
                {/* Card 5 */}
                <article
                    className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                    <div className="relative w-full pt-[56.25%] overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            alt="A close up of a steaming bowl of herbal soup"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWRSCpRKRUQoWOBEwTH7fusjoI8OSzMRnQpqG6Lje_oYOAEhVzVp8bo60tctUR13vCCPxke7GwhDp2Ra-JBfFBB8HCI_IZhM5Ow7eop9aO1LNX7Dx7pWj3ub6hiwF4uYLo_NliW2wLHolYlXYJyXy4ednl076m1hBNCUtKl6YC9QI2LrKHlwrIU-AejI-Xk1FRLJJUftc6pctrmlNWCPifcXCBgAbPxhIcLevqPnu1zsqA1kZK9nnk9yVEijn53SWyIrbk8aiHQrg" />
                        <div
                            className="absolute top-4 left-4 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full font-caption text-caption text-primary">
                            Chăm sóc tại nhà</div>
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                        <time className="font-caption text-caption text-text-muted mb-xs block">05 Tháng 10, 2024</time>
                        <h3
                            className="font-headline-md text-headline-md text-primary mb-sm line-clamp-2 group-hover:text-earth-brown transition-colors">
                            Công Thức Canh Thảo Dược Bồi Bổ Cơ Thể Suy Nhược</h3>
                        <p className="font-body-md text-body-md text-text-muted line-clamp-3 mb-md flex-grow">Bài thuốc ẩm
                            thực kết hợp kỷ tử, táo đỏ và đẳng sâm giúp phục hồi năng lượng nhanh chóng cho người vừa ốm
                            dậy hoặc thường xuyên làm việc quá sức.</p>
                        <a className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown hover:text-primary transition-colors mt-auto"
                            href="#">
                            Đọc tiếp <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                        </a>
                    </div>
                </article>
                {/* Card 6 */}
                <article
                    className="bg-surface rounded-2xl overflow-hidden shadow-level-1 border border-herbal-beige hover:shadow-level-2 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                    <div className="relative w-full pt-[56.25%] overflow-hidden">
                        <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            alt="A modern, minimalistic bathroom setting showing a clear glass bottle of herbal hair wash liquid"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTaeEx2GrMQRu3M9I-CSnh3p_xbLkoghHvJrlm2xzC4KI9HHA8nlS-ImNq7RwL-8iVG1g9sp8M0cxsrRw5kIvNO8nkNd2iV8_G5Gs9h1_TxwvLdos0ZLxt9i4Ytb4FouD_gTyH8SNm5NtN3HvzUHJqzwLOEfDgL-_sT8dTjCbZDrlxRdZ_vNVu2RTGD637FlSMoxUzCxmHQleukRqO-MGyhjQpHD-dXfRlgt5_s9XP4gAS84pOQF_eSoTG5rJE2pfAvZjf4ofsfBI" />
                        <div
                            className="absolute top-4 left-4 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-full font-caption text-caption text-primary">
                            Mẹo thảo dược</div>
                    </div>
                    <div className="p-md flex flex-col flex-grow">
                        <time className="font-caption text-caption text-text-muted mb-xs block">01 Tháng 10, 2024</time>
                        <h3
                            className="font-headline-md text-headline-md text-primary mb-sm line-clamp-2 group-hover:text-earth-brown transition-colors">
                            Gội Đầu Bằng Vỏ Bưởi Và Sả: Bí Quyết Tóc Dày Mượt</h3>
                        <p className="font-body-md text-body-md text-text-muted line-clamp-3 mb-md flex-grow">Trở về với
                            phương pháp chăm sóc tóc truyền thống. Nước gội thảo mộc không hóa chất giúp làm sạch da
                            đầu, kích thích mọc tóc và mang lại hương thơm thư giãn.</p>
                        <a className="inline-flex items-center gap-xs font-label-md text-label-md text-earth-brown hover:text-primary transition-colors mt-auto"
                            href="#">
                            Đọc tiếp <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                        </a>
                    </div>
                </article>
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-xs mt-xl">
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-variant transition-colors disabled:opacity-50"
                    disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-level-1">1</button>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:bg-surface-variant transition-colors font-label-md text-label-md">2</button>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:bg-surface-variant transition-colors font-label-md text-label-md">3</button>
                <span className="text-text-muted">...</span>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:bg-surface-variant transition-colors font-label-md text-label-md">8</button>
                <button
                    className="w-10 h-10 flex items-center justify-center rounded-full text-text-muted hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </section>
    </main>

    {/* Footer */}
    <footer className="w-full pt-xl pb-md bg-primary">
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
                <h4 className="font-headline-md text-headline-md text-on-primary mb-xs text-xl">Product Categories</h4>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">Cổ Vai Gáy</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">Chườm Lưng Bụng</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">Thư Giãn Mắt</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">Phụ Kiện Thảo Dược</Link>
            </div>
            {/* Links Column 2 */}
            <div className="flex flex-col gap-sm">
                <h4 className="font-headline-md text-headline-md text-on-primary mb-xs text-xl">Support Links</h4>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">Hướng dẫn sử dụng</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">Chính sách đổi trả</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">Chính sách bảo mật</Link>
                <Link className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed w-fit"
                    href="#">FAQ</Link>
            </div>
            {/* Contact Column */}
            <div className="flex flex-col gap-sm">
                <h4 className="font-headline-md text-headline-md text-on-primary mb-xs text-xl">Liên Hệ</h4>
                <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed flex items-center gap-xs"
                    href="#">
                    <span className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}>phone</span> Hotline: 1900 xxxx
                </a>
                <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed flex items-center gap-xs"
                    href="#">
                    <span className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}>forum</span> Zalo: NaHerbs Official
                </a>
                <a className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary-fixed flex items-center gap-xs"
                    href="#">
                    <span className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}>mail</span> Email: care@naherbs.vn
                </a>
            </div>
        </div>
        <div
            className="px-gutter max-w-container-max mx-auto mt-xl pt-md border-t border-on-primary/20 flex flex-col md:flex-row justify-between items-center">
            <p className="font-caption text-caption text-on-primary/60">
                © 2024 NaHerbs. All rights reserved.
            </p>
        </div>
    </footer>
    {/* Fixed AI Chat Trigger */}
    <button
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-ambient-3 flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50">
        <span className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1", fontSize: "28px" }}>psychiatry</span>
    </button>
    </>
  );
}
