export default function AdminPosts() {
  return (
    <main className="flex-1 p-gutter max-w-container-max mx-auto w-full flex flex-col gap-md">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-sm">
        <div>
          <h1 className="text-headline-md font-headline-md text-primary mb-xs">
            Quản lý bài viết
          </h1>
          <p className="text-body-md font-body-md text-text-muted">
            Manage your herbal wellness content, SEO status, and publication schedule.
          </p>
        </div>
        <button className="px-md py-sm bg-primary text-on-primary rounded-full text-label-md font-label-md hover:bg-secondary transition-all shadow-ambient-md flex items-center gap-xs hover:-translate-y-0.5">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Viết bài mới
        </button>
      </div>
      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-sm rounded-xl shadow-ambient-sm border border-border-warm flex gap-sm items-center">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-lg border border-border-warm focus:ring-1 focus:ring-primary focus:border-primary text-body-md font-body-md outline-none transition-colors"
            placeholder="Tìm kiếm bài viết..."
            type="text"
          />
        </div>
        <div className="relative w-64">
          <select className="w-full pl-4 pr-10 py-2.5 bg-surface rounded-lg border border-border-warm focus:ring-1 focus:ring-primary focus:border-primary text-body-md font-body-md appearance-none outline-none transition-colors">
            <option value="">Tất cả danh mục</option>
            <option value="health">Sức khỏe</option>
            <option value="herbal">Mẹo thảo dược</option>
            <option value="homecare">Chăm sóc tại nhà</option>
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            expand_more
          </span>
        </div>
        <button className="px-4 py-2.5 bg-surface-container text-text-main rounded-lg text-label-md font-label-md hover:bg-surface-variant transition-colors border border-border-warm flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Lọc
        </button>
      </div>
      {/* Blog Table Card */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient-sm border border-herbal-beige overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border-warm">
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold w-16">
                  Hình ảnh
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Tiêu đề bài viết
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Danh mục
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Trạng thái
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  Ngày đăng
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold">
                  SEO
                </th>
                <th className="p-sm text-label-md font-label-md text-text-muted font-semibold text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm">
              {/* Row 1 */}
              <tr className="hover:bg-surface/50 transition-colors group">
                <td className="p-sm">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border-warm">
                    <img
                      className="w-full h-full object-cover"
                      alt="Blog Cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAC-ZG8hEyTB7uKtPWv0J7blsUwNTbQEcV2BexL9MBWnbXdDTqw_dG6BO9A3GKw6HixzKCJP1WLcCDwEEuqEU6U3EbeVdx1apQWOL3GfT4DOgFPIB3m6Qt4YtRDLv4VmqKWWNarxKwW5PhvrpDNqECzAYy6lo6Oy060pRnGPNkXDqP8Oejr-LFKV3jLXNYT_EAckprKa4SMUlq4LJPrMSw5BoTqutarL_7YBhFcLfs1BFaw7p8BTi2Ka-djmxj4-V8n20TR0w6hyY"
                    />
                  </div>
                </td>
                <td className="p-sm">
                  <p className="text-body-md font-body-md font-semibold text-text-main">
                    7 Loại Thảo Dược Giúp Cải Thiện Giấc Ngủ
                  </p>
                  <p className="text-caption font-caption text-text-muted truncate w-64">
                    Khám phá sức mạnh của thiên nhiên mang lại giấc ngủ sâu...
                  </p>
                </td>
                <td className="p-sm text-body-md font-body-md">Sức khỏe</td>
                <td className="p-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-success-bg text-primary text-caption font-label-md font-semibold">
                    Published
                  </span>
                </td>
                <td className="p-sm text-body-md font-body-md text-text-muted">
                  12/10/2023
                </td>
                <td className="p-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-success-bg text-primary text-caption font-label-md font-semibold gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>{" "}
                    Good
                  </span>
                </td>
                <td className="p-sm">
                  <div className="flex justify-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-secondary-container/30 transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-secondary-container/30 transition-colors"
                      title="View"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        visibility
                      </span>
                    </button>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-error hover:bg-error-container/30 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-surface/50 transition-colors group">
                <td className="p-sm">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border-warm bg-herbal-beige flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline">
                      image
                    </span>
                  </div>
                </td>
                <td className="p-sm">
                  <p className="text-body-md font-body-md font-semibold text-text-main">
                    Công Dụng Bất Ngờ Của Nha Đam
                  </p>
                  <p className="text-caption font-caption text-text-muted truncate w-64">
                    Nha đam không chỉ dùng để làm đẹp mà còn...
                  </p>
                </td>
                <td className="p-sm text-body-md font-body-md">Mẹo thảo dược</td>
                <td className="p-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-high text-text-muted text-caption font-label-md font-semibold">
                    Draft
                  </span>
                </td>
                <td className="p-sm text-body-md font-body-md text-text-muted">
                  -
                </td>
                <td className="p-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-high text-text-muted text-caption font-label-md font-semibold gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      pending
                    </span>{" "}
                    N/A
                  </span>
                </td>
                <td className="p-sm">
                  <div className="flex justify-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-secondary-container/30 transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-error hover:bg-error-container/30 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-sm border-t border-border-warm flex justify-between items-center bg-surface-container-lowest">
          <p className="text-caption font-caption text-text-muted">
            Showing 1 to 2 of 24 entries
          </p>
          <div className="flex gap-1">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-warm text-text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary bg-primary text-on-primary font-label-md text-label-md">
              1
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-warm text-text-main hover:border-primary hover:text-primary transition-colors font-label-md text-label-md">
              2
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-warm text-text-main hover:border-primary hover:text-primary transition-colors font-label-md text-label-md">
              3
            </button>
            <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-warm text-text-muted hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
