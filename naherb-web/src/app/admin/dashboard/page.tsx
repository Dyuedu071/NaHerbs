export default function AdminDashboard() {
  return (
    <main className="flex-1 p-gutter max-w-container-max mx-auto w-full">
      <div className="mb-lg">
        <h2 className="text-headline-md font-headline-md text-primary-container">Tổng quan</h2>
        <p className="text-body-md text-text-muted mt-base">Theo dõi hiệu suất cửa hàng hôm nay.</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
          <div>
            <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
              Tổng sản phẩm
            </p>
            <p className="text-price-display font-price-display text-text-main mt-xs">
              1,248
            </p>
            <p className="text-caption text-primary mt-base flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>{" "}
              +12% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center text-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
        </div>
        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
          <div>
            <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
              Đơn hàng mới
            </p>
            <p className="text-price-display font-price-display text-text-main mt-xs">
              42
            </p>
            <p className="text-caption text-primary mt-base flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>{" "}
              +5 hôm nay
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_mall
            </span>
          </div>
        </div>
        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
          <div>
            <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
              Đơn chờ xác nhận QR
            </p>
            <p className="text-price-display font-price-display text-error-text mt-xs">
              8
            </p>
            <p className="text-caption text-text-muted mt-base flex items-center gap-1">
              Cần xử lý ngay
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-error-bg flex items-center justify-center text-error-text">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              qr_code_scanner
            </span>
          </div>
        </div>
        {/* Stat Card 4 */}
        <div className="bg-surface-container-lowest rounded-2xl p-md shadow-level-1 border border-herbal-beige flex items-start justify-between">
          <div>
            <p className="text-caption font-caption text-text-muted uppercase tracking-wider">
              Doanh thu tháng
            </p>
            <p className="text-price-display font-price-display text-text-main mt-xs">
              125.5M
            </p>
            <p className="text-caption text-primary mt-base flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>{" "}
              Đạt 85% mục tiêu
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
          </div>
        </div>
      </div>
      {/* Complex Layout: Main Table & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Recent Orders Table (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-level-1 border border-herbal-beige overflow-hidden flex flex-col">
          <div className="p-md border-b border-herbal-beige flex justify-between items-center bg-surface-container-low/50">
            <h3 className="text-body-lg font-body-lg font-semibold text-text-main">
              Đơn hàng gần đây
            </h3>
            <button className="text-label-md font-label-md text-primary hover:text-primary-container transition-colors">
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-caption font-caption text-text-muted uppercase tracking-wide">
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Mã Đơn
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Khách Hàng
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Tổng Tiền
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige">
                    Trạng Thái
                  </th>
                  <th className="p-sm font-semibold border-b border-herbal-beige text-right">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-md text-text-main divide-y divide-herbal-beige">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-sm font-medium">#ORD-001</td>
                  <td className="p-sm">
                    <div className="flex flex-col">
                      <span>Nguyễn Văn A</span>
                      <span className="text-caption text-text-muted">
                        0901234567
                      </span>
                    </div>
                  </td>
                  <td className="p-sm">1,250,000 đ</td>
                  <td className="p-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container text-text-muted text-caption font-semibold">
                      Chờ xác nhận
                    </span>
                  </td>
                  <td className="p-sm text-right">
                    <button
                      className="p-2 text-text-muted hover:text-primary transition-colors"
                      title="Chi tiết"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-sm font-medium">#ORD-002</td>
                  <td className="p-sm">
                    <div className="flex flex-col">
                      <span>Trần Thị B</span>
                      <span className="text-caption text-text-muted">
                        0987654321
                      </span>
                    </div>
                  </td>
                  <td className="p-sm">850,000 đ</td>
                  <td className="p-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-success-bg text-primary text-caption font-semibold">
                      Đã thanh toán
                    </span>
                  </td>
                  <td className="p-sm text-right">
                    <button
                      className="p-2 text-text-muted hover:text-primary transition-colors"
                      title="Chi tiết"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-sm font-medium">#ORD-003</td>
                  <td className="p-sm">
                    <div className="flex flex-col">
                      <span>Lê Văn C</span>
                      <span className="text-caption text-text-muted">
                        0912345678
                      </span>
                    </div>
                  </td>
                  <td className="p-sm">2,100,000 đ</td>
                  <td className="p-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-bg text-error-text text-caption font-semibold">
                      Lỗi thanh toán
                    </span>
                  </td>
                  <td className="p-sm text-right">
                    <button
                      className="p-2 text-text-muted hover:text-primary transition-colors"
                      title="Chi tiết"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-sm font-medium">#ORD-004</td>
                  <td className="p-sm">
                    <div className="flex flex-col">
                      <span>Phạm Thị D</span>
                      <span className="text-caption text-text-muted">
                        0976543210
                      </span>
                    </div>
                  </td>
                  <td className="p-sm">450,000 đ</td>
                  <td className="p-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-success-bg text-primary text-caption font-semibold">
                      Đã thanh toán
                    </span>
                  </td>
                  <td className="p-sm text-right">
                    <button
                      className="p-2 text-text-muted hover:text-primary transition-colors"
                      title="Chi tiết"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Side Panels (Takes up 1 column on large screens) */}
        <div className="lg:col-span-1 space-y-md">
          {/* Low Stock Widget */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-herbal-beige overflow-hidden">
            <div className="p-sm border-b border-herbal-beige bg-surface-container-low/50 flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-tertiary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <h3 className="text-label-md font-label-md text-text-main">
                Sản phẩm sắp hết hàng
              </h3>
            </div>
            <div className="p-sm space-y-sm">
              <div className="flex items-center gap-sm">
                <div className="w-12 h-12 rounded-lg bg-herbal-beige border border-border-warm overflow-hidden shrink-0 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">emoji_food_beverage</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-medium text-text-main truncate">
                    Trà Thảo Mộc An Thần
                  </p>
                  <p className="text-caption text-error-text">Còn lại: 3 hộp</p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <div className="w-12 h-12 rounded-lg bg-herbal-beige border border-border-warm overflow-hidden shrink-0 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-medium text-text-main truncate">
                    Tinh Dầu Bạc Hà Nguyên Chất
                  </p>
                  <p className="text-caption text-error-text">Còn lại: 5 lọ</p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <div className="w-12 h-12 rounded-lg bg-herbal-beige border border-border-warm overflow-hidden shrink-0 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">spa</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-medium text-text-main truncate">
                    Kem Dưỡng Da Cấp Ẩm
                  </p>
                  <p className="text-caption text-error-text">Còn lại: 2 hũ</p>
                </div>
              </div>
            </div>
          </div>
          {/* Pending QR Payments Widget */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-level-1 border border-herbal-beige overflow-hidden">
            <div className="p-sm border-b border-herbal-beige bg-surface-container-low/50 flex items-center justify-between">
              <div className="flex items-center gap-xs">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  qr_code
                </span>
                <h3 className="text-label-md font-label-md text-text-main">
                  Thanh toán QR chờ duyệt
                </h3>
              </div>
              <span className="bg-primary text-on-primary text-caption font-bold px-2 py-0.5 rounded-full">
                8
              </span>
            </div>
            <div className="p-sm space-y-sm">
              {/* Pending Item 1 */}
              <div className="flex justify-between items-center p-sm rounded-xl border border-border-warm bg-surface-container/30">
                <div>
                  <p className="text-label-md font-label-md text-text-main">
                    #ORD-089
                  </p>
                  <p className="text-caption text-text-muted">10 phút trước</p>
                </div>
                <div className="flex items-center gap-sm">
                  <p className="text-body-md font-bold text-primary">850K</p>
                  <button className="px-3 py-1 rounded-full bg-primary text-on-primary text-caption hover:bg-primary-container transition-colors shadow-level-1">
                    Duyệt
                  </button>
                </div>
              </div>
              {/* Pending Item 2 */}
              <div className="flex justify-between items-center p-sm rounded-xl border border-border-warm bg-surface-container/30">
                <div>
                  <p className="text-label-md font-label-md text-text-main">
                    #ORD-092
                  </p>
                  <p className="text-caption text-text-muted">25 phút trước</p>
                </div>
                <div className="flex items-center gap-sm">
                  <p className="text-body-md font-bold text-primary">1,200K</p>
                  <button className="px-3 py-1 rounded-full bg-primary text-on-primary text-caption hover:bg-primary-container transition-colors shadow-level-1">
                    Duyệt
                  </button>
                </div>
              </div>
            </div>
            <div className="p-sm pt-0">
              <button className="w-full py-2 text-center text-label-md text-primary hover:bg-surface-container rounded-lg transition-colors">
                Xem tất cả yêu cầu
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
