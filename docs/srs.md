# SRS – NaHerbs Website MVP

**Dự án:** NaHerbs Website  
**Loại tài liệu:** Software Requirements Specification (SRS)  
**Phiên bản:** v1.0  
**Ngày lập:** 2026-06-27  
**Ngôn ngữ:** Tiếng Việt  
**Tài liệu đầu vào:** `prd.md` v1.1 – NaHerbs Website MVP, dữ liệu sản phẩm, bài viết website, mô tả sản phẩm chi tiết, logo, ảnh blog và ảnh sản phẩm trong Google Drive folder `Website NaHerbs`.

---

## 1. Giới thiệu

### 1.1 Mục đích tài liệu

Tài liệu SRS này mô tả yêu cầu phần mềm cho hệ thống **NaHerbs Website MVP**. Tài liệu được dùng làm cơ sở cho việc phân tích, thiết kế, phát triển, kiểm thử và nghiệm thu hệ thống website giới thiệu thương hiệu, catalog sản phẩm, blog SEO, lead/tư vấn và AI Chatbot tư vấn sản phẩm.

SRS tập trung chuyển hóa yêu cầu sản phẩm trong PRD thành các yêu cầu chức năng, phi chức năng, dữ liệu, giao diện và quy tắc nghiệp vụ có thể triển khai và kiểm thử được.

### 1.2 Phạm vi hệ thống

NaHerbs Website MVP là hệ thống website phục vụ hai nhóm chính:

1. **Khách truy cập/người mua tiềm năng:** xem thông tin thương hiệu, xem danh mục sản phẩm, đọc mô tả chi tiết, đọc blog, hỏi AI Chatbot để được tư vấn sản phẩm phù hợp, gửi yêu cầu tư vấn/đặt mua nhanh.
2. **Quản trị viên NaHerbs:** quản lý sản phẩm, biến thể, ảnh, danh mục, bài blog, lead, cấu hình website và cấu hình AI Chatbot.

MVP không bao gồm giỏ hàng, checkout, thanh toán online, tài khoản khách hàng, vận chuyển tự động, ERP/kế toán/kho thực tế, app mobile hoặc chatbot chẩn đoán/y tế.

### 1.3 Tài liệu tham chiếu

| Mã | Tài liệu | Mô tả |
|---|---|---|
| REF-01 | PRD – NaHerbs Website MVP v1.1 | Tài liệu yêu cầu sản phẩm đầu vào |
| REF-02 | Thông tin Website | Google Sheet chứa sản phẩm, biến thể, giá, mô tả ngắn, trạng thái và kho |
| REF-03 | Bài viết trên website | Google Doc chứa nội dung giới thiệu thương hiệu và bài blog |
| REF-04 | Mô tả sản phẩm chi tiết NaHerbs | Google Doc chứa mô tả chi tiết, công dụng, hướng dẫn dùng, lưu ý sản phẩm |
| REF-05 | Logo / Ảnh Blog / Ảnh sản phẩm | Thư mục asset dùng cho website |

### 1.4 Định nghĩa và thuật ngữ

| Thuật ngữ | Định nghĩa |
|---|---|
| MVP | Minimum Viable Product – phiên bản khả dụng tối thiểu |
| CMS | Content Management System – hệ quản trị nội dung |
| Lead | Thông tin khách hàng quan tâm, cần tư vấn hoặc đặt mua |
| CTA | Call To Action – nút/khu vực kêu gọi hành động như “Tư vấn ngay”, “Liên hệ Zalo” |
| SKU | Mã định danh sản phẩm hoặc biến thể sản phẩm |
| Variant | Biến thể sản phẩm như màu sắc, mùi hương, có nhiệt/không nhiệt |
| AI Chatbot | Trợ lý AI tư vấn sản phẩm dựa trên dữ liệu đã publish trong website |
| Knowledge Base | Nguồn dữ liệu chatbot được phép sử dụng, gồm sản phẩm, biến thể, mô tả, bài viết, cấu hình câu trả lời |
| SEO | Search Engine Optimization – tối ưu tìm kiếm |
| Disclaimer | Cảnh báo/ghi chú giới hạn trách nhiệm, đặc biệt với nội dung liên quan sức khỏe |

---

## 2. Mô tả tổng quan hệ thống

### 2.1 Bối cảnh sản phẩm

NaHerbs là thương hiệu chăm sóc sức khỏe cá nhân và gia đình từ thảo dược thiên nhiên. Website MVP cần đóng vai trò là kênh chính thức để giới thiệu thương hiệu, trình bày sản phẩm, cung cấp nội dung SEO và tạo lead tư vấn/đặt mua.

Hệ thống cần có khả năng quản trị nội dung để đội vận hành cập nhật sản phẩm, giá, tồn kho hiển thị, mô tả, ảnh và bài viết mà không phải sửa code. Ngoài catalog truyền thống, website cần có AI Chatbot để người dùng hỏi bằng ngôn ngữ tự nhiên và nhận gợi ý sản phẩm hiện có trên website.

### 2.2 Chức năng tổng quan

Hệ thống gồm 2 phân hệ chính:

1. **Website khách hàng**
   - Trang chủ.
   - Trang giới thiệu NaHerbs.
   - Danh sách sản phẩm.
   - Chi tiết sản phẩm.
   - Danh mục/nhóm sản phẩm.
   - Blog danh sách và chi tiết bài viết.
   - Form liên hệ/tư vấn/đặt mua nhanh.
   - AI Chatbot tư vấn sản phẩm.
   - SEO cơ bản.
   - Responsive desktop/tablet/mobile.

2. **Admin/CMS**
   - Đăng nhập quản trị.
   - Quản lý sản phẩm.
   - Quản lý biến thể.
   - Quản lý ảnh.
   - Quản lý danh mục.
   - Quản lý blog.
   - Quản lý lead.
   - Quản lý cấu hình website.
   - Quản lý cấu hình và lịch sử AI Chatbot.

### 2.3 Lớp người dùng

| Mã | Người dùng | Mô tả | Nhu cầu chính |
|---|---|---|---|
| U-01 | Khách truy cập | Người vào website chưa xác định nhu cầu rõ | Xem thương hiệu, sản phẩm, blog, liên hệ |
| U-02 | Khách hàng cá nhân | Người quan tâm chăm sóc sức khỏe tại nhà | Tìm sản phẩm phù hợp, hỏi tư vấn, đặt mua |
| U-03 | Nhân viên văn phòng | Người thường đau mỏi cổ vai gáy/lưng do ngồi lâu | Tìm sản phẩm thư giãn cổ vai gáy, lưng, mắt |
| U-04 | Người trung niên/người lớn tuổi | Người cần sản phẩm dễ dùng, hỗ trợ thư giãn | Xem hướng dẫn dùng, lưu ý an toàn, liên hệ tư vấn |
| U-05 | Doanh nghiệp mua quà tặng | Tổ chức cần quà tặng sức khỏe | Xem nhóm sản phẩm phù hợp, gửi yêu cầu tư vấn số lượng |
| U-06 | Spa/cơ sở chăm sóc sức khỏe | Đơn vị quan tâm ngải cứu/tinh dầu | Xem sản phẩm xông ngải/tinh dầu, liên hệ tư vấn |
| U-07 | Admin | Người vận hành website | Quản lý nội dung, sản phẩm, lead, chatbot |

### 2.4 Môi trường vận hành

| Thành phần | Yêu cầu |
|---|---|
| Frontend khách hàng | Web responsive, hỗ trợ Chrome, Edge, Safari, Firefox phiên bản phổ biến |
| Admin/CMS | Web app dành cho quản trị viên, ưu tiên desktop/tablet |
| Backend API | Cung cấp API cho frontend, admin, chatbot, lead và CMS |
| Database | Lưu sản phẩm, biến thể, bài viết, lead, cấu hình và lịch sử chatbot |
| File/Object Storage | Lưu ảnh sản phẩm, ảnh blog, logo và asset website |
| AI Provider | Dịch vụ LLM hoặc mô hình AI dùng cho chatbot, có kiểm soát prompt/guardrail |
| Network | HTTPS bắt buộc trên môi trường production |

### 2.5 Ràng buộc thiết kế và triển khai

1. Website phải ưu tiên tốc độ tải, dễ SEO, responsive tốt trên mobile.
2. Nội dung liên quan sức khỏe không được diễn đạt như thuốc chữa bệnh hoặc thay thế tư vấn bác sĩ.
3. Chatbot chỉ được tư vấn dựa trên sản phẩm/bài viết/cấu hình đã được publish trong CMS.
4. Chatbot không được tự tạo sản phẩm, tự bịa giá, tự bịa tồn kho hoặc cam kết hiệu quả điều trị.
5. Giá bán, trạng thái còn hàng và tồn kho hiển thị phải lấy từ dữ liệu CMS.
6. Hệ thống phải có cơ chế ẩn sản phẩm/bài viết khỏi website và chatbot.
7. Admin/CMS phải yêu cầu đăng nhập.
8. Lead phải được lưu lại để nhân sự NaHerbs xử lý sau.

### 2.6 Giả định và phụ thuộc

| Mã | Giả định/phụ thuộc |
|---|---|
| AD-01 | Dữ liệu sản phẩm ban đầu sẽ được nhập từ Google Sheet/Docs hiện có. |
| AD-02 | Ảnh sản phẩm, logo và ảnh blog sẽ được chuẩn hóa trước khi publish. |
| AD-03 | Kênh liên hệ chính trong MVP có thể là hotline, Zalo, Facebook hoặc form lead. |
| AD-04 | Tồn kho trong MVP là tồn kho hiển thị, chưa bắt buộc đồng bộ với hệ thống kho thực tế. |
| AD-05 | Chatbot cần phụ thuộc vào dịch vụ AI/LLM hoặc module AI được cấu hình riêng. |
| AD-06 | Nội dung blog/sản phẩm phải được admin kiểm duyệt trước khi publish. |

---

## 3. Yêu cầu giao diện ngoài

### 3.1 Giao diện người dùng – Website khách hàng

#### 3.1.1 Header

- Hệ thống phải hiển thị logo NaHerbs.
- Hệ thống phải hiển thị menu điều hướng tối thiểu: Trang chủ, Sản phẩm, Blog, Về NaHerbs, Liên hệ.
- Hệ thống phải có CTA nổi bật như “Tư vấn ngay”, “Liên hệ Zalo” hoặc “Gọi ngay”.
- Header phải responsive trên mobile, có thể dùng hamburger menu.

#### 3.1.2 Footer

- Hệ thống phải hiển thị thông tin thương hiệu, hotline, Zalo/Facebook, email/địa chỉ nếu có.
- Footer phải có liên kết đến sản phẩm, blog, chính sách/cảnh báo sử dụng nếu có.

#### 3.1.3 Chatbot widget

- Chatbot phải hiển thị dưới dạng widget nổi ở góc màn hình.
- Chatbot phải có trạng thái thu gọn/mở rộng.
- Chatbot phải hiển thị lời chào và câu hỏi gợi ý.
- Chatbot phải hoạt động tốt trên mobile, không che mất CTA quan trọng.
- Chatbot phải có cơ chế chuyển người dùng sang kênh liên hệ thật khi không đủ thông tin hoặc người dùng cần tư vấn sâu.

### 3.2 Giao diện người dùng – Admin/CMS

- Admin phải có trang đăng nhập.
- Admin phải có sidebar/menu quản lý: Dashboard, Sản phẩm, Danh mục, Blog, Lead, Chatbot, Cấu hình website.
- Các màn hình quản lý phải có tìm kiếm, phân trang và trạng thái publish/ẩn.
- Các form nhập liệu phải có validation và thông báo lỗi rõ ràng.

### 3.3 Giao diện phần mềm

| Mã | Giao diện | Mô tả |
|---|---|---|
| SI-01 | Frontend ↔ Backend API | REST/JSON hoặc tương đương |
| SI-02 | Admin ↔ Backend API | REST/JSON có xác thực |
| SI-03 | Backend ↔ Database | Lưu dữ liệu hệ thống |
| SI-04 | Backend ↔ File Storage | Upload, đọc, xóa ảnh |
| SI-05 | Chatbot ↔ AI Provider | Gửi câu hỏi, context sản phẩm/bài viết, nhận phản hồi |
| SI-06 | Website ↔ External Contact Channels | Deep link đến Zalo, Facebook, điện thoại, email |

### 3.4 Giao tiếp và bảo mật truyền thông

- Production phải sử dụng HTTPS.
- API admin phải yêu cầu xác thực.
- File upload phải giới hạn loại file và dung lượng.
- API chatbot phải có rate limit hoặc cơ chế chống spam ở mức tối thiểu.

---

## 4. Yêu cầu chức năng

### 4.1 Nhóm Website khách hàng

#### FR-WEB-01. Trang chủ

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải cung cấp trang chủ giới thiệu nhanh thương hiệu, sản phẩm nổi bật, lợi ích chính, nhóm danh mục, blog mới và CTA tư vấn.

**Yêu cầu chi tiết:**

- FR-WEB-01.1: Trang chủ phải hiển thị hero section với thông điệp thương hiệu.
- FR-WEB-01.2: Trang chủ phải hiển thị danh mục hoặc nhóm sản phẩm chính.
- FR-WEB-01.3: Trang chủ phải hiển thị một số sản phẩm nổi bật/còn hàng.
- FR-WEB-01.4: Trang chủ phải hiển thị lợi ích/giá trị NaHerbs.
- FR-WEB-01.5: Trang chủ phải hiển thị bài blog mới hoặc bài tư vấn nổi bật.
- FR-WEB-01.6: Trang chủ phải có CTA dẫn đến form tư vấn, Zalo/Facebook/hotline hoặc chatbot.

**Tiêu chí nghiệm thu:**

- Người dùng vào trang chủ có thể đi đến danh sách sản phẩm trong tối đa 1 thao tác.
- Người dùng có thể mở chatbot hoặc liên hệ tư vấn từ trang chủ.
- Trang chủ hiển thị tốt trên desktop và mobile.

#### FR-WEB-02. Trang giới thiệu NaHerbs

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải hiển thị nội dung giới thiệu thương hiệu, định vị, thông điệp và giá trị cốt lõi của NaHerbs.

**Yêu cầu chi tiết:**

- FR-WEB-02.1: Trang giới thiệu phải hiển thị NaHerbs là thương hiệu chăm sóc sức khỏe từ thảo dược thiên nhiên.
- FR-WEB-02.2: Trang giới thiệu phải trình bày phương châm “Giải pháp chăm sóc sức khỏe từ thiên nhiên”.
- FR-WEB-02.3: Trang giới thiệu phải hiển thị nhóm sản phẩm chính.
- FR-WEB-02.4: Trang giới thiệu phải có CTA liên hệ/tư vấn.

#### FR-WEB-03. Danh sách sản phẩm

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải cho phép người dùng xem danh sách sản phẩm đã publish.

**Yêu cầu chi tiết:**

- FR-WEB-03.1: Chỉ sản phẩm có trạng thái `Published` mới được hiển thị.
- FR-WEB-03.2: Mỗi card sản phẩm phải hiển thị ảnh đại diện, tên, giá bán, giá gạch nếu có, trạng thái còn hàng/hết hàng và CTA xem chi tiết.
- FR-WEB-03.3: Người dùng có thể lọc theo danh mục/nhóm nhu cầu.
- FR-WEB-03.4: Người dùng có thể tìm kiếm theo tên sản phẩm hoặc từ khóa liên quan.
- FR-WEB-03.5: Hệ thống phải hỗ trợ phân trang hoặc tải thêm khi số lượng sản phẩm lớn.

**Tiêu chí nghiệm thu:**

- Sản phẩm ẩn không xuất hiện ở danh sách.
- Giá hiển thị đúng theo dữ liệu CMS.
- Người dùng có thể truy cập chi tiết sản phẩm từ card sản phẩm.

#### FR-WEB-04. Chi tiết sản phẩm

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải hiển thị đầy đủ thông tin sản phẩm để người dùng hiểu, so sánh và liên hệ mua/tư vấn.

**Yêu cầu chi tiết:**

- FR-WEB-04.1: Trang chi tiết sản phẩm phải hiển thị tên, ảnh, mô tả ngắn, mô tả chi tiết, giá bán, giá gạch, biến thể và trạng thái còn hàng.
- FR-WEB-04.2: Trang chi tiết phải hiển thị công dụng/lợi ích theo ngôn ngữ an toàn, không cam kết điều trị.
- FR-WEB-04.3: Trang chi tiết phải hiển thị hướng dẫn sử dụng, lưu ý và bảo quản nếu có.
- FR-WEB-04.4: Trang chi tiết phải hiển thị CTA liên hệ, đặt tư vấn hoặc hỏi chatbot.
- FR-WEB-04.5: Trang chi tiết phải hiển thị sản phẩm liên quan.
- FR-WEB-04.6: Trang chi tiết phải có metadata SEO.

#### FR-WEB-05. Danh mục sản phẩm

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải hỗ trợ nhóm sản phẩm theo danh mục để người dùng dễ tìm.

**Danh mục khởi tạo đề xuất:**

- Gối & sản phẩm hỗ trợ cổ vai gáy.
- Túi/gối chườm thảo dược.
- Sản phẩm xông ngải cứu.
- Tinh dầu thiên nhiên.
- Phụ kiện thư giãn/du lịch.
- Quà tặng sức khỏe.

**Yêu cầu chi tiết:**

- FR-WEB-05.1: Một sản phẩm có thể thuộc một hoặc nhiều danh mục.
- FR-WEB-05.2: Danh mục có slug riêng.
- FR-WEB-05.3: Danh mục có thể được publish/ẩn.

#### FR-WEB-06. Blog danh sách

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải hiển thị danh sách bài viết blog đã publish.

**Yêu cầu chi tiết:**

- FR-WEB-06.1: Mỗi card bài viết hiển thị ảnh, tiêu đề, mô tả ngắn, ngày đăng và CTA đọc tiếp.
- FR-WEB-06.2: Blog có thể phân loại theo chủ đề.
- FR-WEB-06.3: Blog có thể tìm kiếm theo từ khóa.
- FR-WEB-06.4: Chỉ bài viết `Published` mới hiển thị với khách.

#### FR-WEB-07. Chi tiết bài viết blog

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải hiển thị nội dung bài viết SEO/tư vấn sức khỏe.

**Yêu cầu chi tiết:**

- FR-WEB-07.1: Trang bài viết phải hiển thị tiêu đề, ảnh, nội dung, mục lục nếu cần và metadata SEO.
- FR-WEB-07.2: Bài viết liên quan sức khỏe phải dùng ngôn ngữ hỗ trợ/thư giãn, không khẳng định chữa bệnh.
- FR-WEB-07.3: Bài viết phải có CTA dẫn đến sản phẩm liên quan hoặc chatbot.
- FR-WEB-07.4: Trang bài viết phải hiển thị disclaimer khi nội dung có yếu tố sức khỏe.

#### FR-WEB-08. Form liên hệ/tư vấn/đặt mua nhanh

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải cho phép người dùng gửi thông tin liên hệ để NaHerbs tư vấn hoặc chốt đơn qua kênh bên ngoài.

**Yêu cầu chi tiết:**

- FR-WEB-08.1: Form phải có tối thiểu họ tên, số điện thoại, nhu cầu/nội dung.
- FR-WEB-08.2: Form có thể gắn sản phẩm quan tâm nếu gửi từ trang chi tiết sản phẩm hoặc chatbot.
- FR-WEB-08.3: Hệ thống phải validate số điện thoại và trường bắt buộc.
- FR-WEB-08.4: Sau khi gửi thành công, hệ thống phải hiển thị thông báo xác nhận.
- FR-WEB-08.5: Lead phải được lưu vào CMS.

#### FR-WEB-09. SEO cơ bản

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải hỗ trợ SEO cơ bản cho trang sản phẩm, danh mục, blog và trang tĩnh.

**Yêu cầu chi tiết:**

- FR-WEB-09.1: Mỗi trang SEO cần có slug thân thiện.
- FR-WEB-09.2: Mỗi sản phẩm/bài blog phải có meta title, meta description.
- FR-WEB-09.3: Hệ thống phải hỗ trợ alt text cho ảnh.
- FR-WEB-09.4: Hệ thống nên sinh sitemap.xml và robots.txt.
- FR-WEB-09.5: URL không được phụ thuộc vào ID kỹ thuật nếu có thể dùng slug.

#### FR-WEB-10. Responsive UI

**Mức ưu tiên:** Must Have  
**Mô tả:** Website khách hàng phải hiển thị tốt trên desktop, tablet và mobile.

**Yêu cầu chi tiết:**

- FR-WEB-10.1: Layout phải không vỡ trên màn hình mobile phổ biến.
- FR-WEB-10.2: CTA, menu và chatbot phải dễ thao tác bằng cảm ứng.
- FR-WEB-10.3: Ảnh phải co giãn phù hợp, tránh làm chậm trang quá mức.

---

### 4.2 Nhóm AI Chatbot tư vấn sản phẩm

#### FR-AI-01. Hiển thị chatbot widget

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải cung cấp chatbot widget cho người dùng hỏi đáp về sản phẩm và nhu cầu chăm sóc sức khỏe.

**Yêu cầu chi tiết:**

- FR-AI-01.1: Chatbot phải xuất hiện trên website khách hàng theo cấu hình bật/tắt trong CMS.
- FR-AI-01.2: Chatbot phải có lời chào mặc định.
- FR-AI-01.3: Chatbot phải có câu hỏi gợi ý như “Tôi bị mỏi cổ vai gáy nên dùng sản phẩm nào?”, “Tôi muốn mua quà tặng sức khỏe”, “Tôi cần sản phẩm thư giãn mắt”.
- FR-AI-01.4: Người dùng có thể đóng/mở chatbot.
- FR-AI-01.5: Chatbot phải hiển thị trạng thái đang trả lời.

#### FR-AI-02. Hiểu nhu cầu và hỏi làm rõ

**Mức ưu tiên:** Must Have  
**Mô tả:** Chatbot phải hiểu câu hỏi tự nhiên của người dùng và hỏi thêm khi thiếu thông tin.

**Yêu cầu chi tiết:**

- FR-AI-02.1: Chatbot phải nhận diện nhóm nhu cầu phổ biến: cổ vai gáy, đau lưng, thư giãn mắt, ngủ/nghỉ ngơi, du lịch, tinh dầu, xông ngải, quà tặng sức khỏe.
- FR-AI-02.2: Nếu nhu cầu mơ hồ, chatbot phải hỏi thêm tối đa 1–3 câu trước khi gợi ý sản phẩm.
- FR-AI-02.3: Chatbot phải ưu tiên câu hỏi ngắn, dễ hiểu.
- FR-AI-02.4: Chatbot không được yêu cầu người dùng cung cấp thông tin nhạy cảm không cần thiết.

#### FR-AI-03. Truy xuất sản phẩm hiện có trên website

**Mức ưu tiên:** Must Have  
**Mô tả:** Chatbot phải chỉ gợi ý sản phẩm dựa trên dữ liệu sản phẩm đã publish trong CMS.

**Yêu cầu chi tiết:**

- FR-AI-03.1: Chatbot phải lấy dữ liệu từ sản phẩm, biến thể, giá, trạng thái còn hàng, mô tả và danh mục đã publish.
- FR-AI-03.2: Chatbot không được gợi ý sản phẩm có trạng thái `Hidden`, `Draft` hoặc đã bị xóa.
- FR-AI-03.3: Nếu sản phẩm hết hàng, chatbot chỉ được nhắc đến khi có cảnh báo rõ “hiện hết hàng” và nên gợi ý sản phẩm thay thế còn hàng.
- FR-AI-03.4: Chatbot không được tự tạo tên sản phẩm, giá, biến thể hoặc tồn kho không có trong CMS.

#### FR-AI-04. Gợi ý sản phẩm phù hợp

**Mức ưu tiên:** Must Have  
**Mô tả:** Chatbot phải đưa ra gợi ý sản phẩm phù hợp với nhu cầu người dùng kèm lý do và CTA.

**Yêu cầu chi tiết:**

- FR-AI-04.1: Mỗi lượt tư vấn nên gợi ý tối đa 3 sản phẩm để tránh quá tải thông tin.
- FR-AI-04.2: Với mỗi sản phẩm, chatbot phải nêu tên, giá bán, biến thể phù hợp, trạng thái còn hàng và lý do phù hợp.
- FR-AI-04.3: Chatbot phải kèm CTA: xem chi tiết sản phẩm, gửi form tư vấn, gọi hotline hoặc liên hệ Zalo/Facebook.
- FR-AI-04.4: Chatbot phải có thể gợi ý sản phẩm theo ngữ cảnh: “ngồi văn phòng nhiều”, “mỏi mắt”, “đau lưng”, “mua quà cho người lớn tuổi”, “đi du lịch”.
- FR-AI-04.5: Chatbot phải ưu tiên sản phẩm còn hàng và có mô tả đầy đủ.

#### FR-AI-05. Guardrail nội dung sức khỏe

**Mức ưu tiên:** Must Have  
**Mô tả:** Chatbot phải tuân thủ nguyên tắc nội dung an toàn khi trả lời các câu hỏi liên quan sức khỏe.

**Yêu cầu chi tiết:**

- FR-AI-05.1: Chatbot không được chẩn đoán bệnh.
- FR-AI-05.2: Chatbot không được kê đơn, chỉ định điều trị hoặc khuyên ngừng thuốc.
- FR-AI-05.3: Chatbot không được cam kết sản phẩm chữa khỏi, điều trị dứt điểm hoặc thay thế bác sĩ.
- FR-AI-05.4: Chatbot phải dùng ngôn ngữ như “hỗ trợ thư giãn”, “làm ấm”, “giúp dễ chịu”, “phù hợp để chăm sóc tại nhà”.
- FR-AI-05.5: Khi người dùng mô tả đau kéo dài, triệu chứng nghiêm trọng hoặc bất thường, chatbot phải khuyên người dùng thăm khám cơ sở y tế và chỉ tư vấn sản phẩm như giải pháp hỗ trợ thư giãn, không phải điều trị.

#### FR-AI-06. Fallback và chuyển tư vấn viên

**Mức ưu tiên:** Must Have  
**Mô tả:** Khi chatbot không đủ dữ liệu hoặc không chắc chắn, hệ thống phải chuyển hướng người dùng sang kênh liên hệ thật.

**Yêu cầu chi tiết:**

- FR-AI-06.1: Nếu không tìm thấy sản phẩm phù hợp, chatbot phải nói rõ chưa có sản phẩm phù hợp trong danh mục hiện tại.
- FR-AI-06.2: Chatbot phải đề xuất liên hệ hotline/Zalo/Facebook hoặc gửi form tư vấn.
- FR-AI-06.3: Chatbot phải có thể tạo lead từ hội thoại nếu người dùng đồng ý để lại số điện thoại.
- FR-AI-06.4: Chatbot không được giả vờ đã chuyển cho nhân viên nếu hệ thống chưa thực hiện hành động đó.

#### FR-AI-07. Lưu lịch sử hội thoại

**Mức ưu tiên:** Should Have  
**Mô tả:** Hệ thống nên lưu lịch sử hội thoại cơ bản để admin xem lại nhu cầu khách hàng và cải thiện tư vấn.

**Yêu cầu chi tiết:**

- FR-AI-07.1: Hệ thống lưu thời gian, câu hỏi, câu trả lời, sản phẩm được gợi ý và trạng thái tạo lead nếu có.
- FR-AI-07.2: Hệ thống không lưu thông tin nhạy cảm không cần thiết.
- FR-AI-07.3: Admin có thể xem danh sách hội thoại và lọc theo ngày/trạng thái lead.
- FR-AI-07.4: Hệ thống phải có chính sách xóa hoặc ẩn dữ liệu hội thoại nếu cần.

#### FR-AI-08. Cấu hình chatbot trong Admin

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải có thể cấu hình chatbot ở mức tối thiểu.

**Yêu cầu chi tiết:**

- FR-AI-08.1: Admin có thể bật/tắt chatbot.
- FR-AI-08.2: Admin có thể sửa lời chào.
- FR-AI-08.3: Admin có thể sửa câu hỏi gợi ý.
- FR-AI-08.4: Admin có thể cấu hình fallback contact: hotline, Zalo, Facebook hoặc form lead.
- FR-AI-08.5: Admin có thể cấu hình system prompt/guardrail ở mức an toàn hoặc thông qua trường cấu hình được giới hạn.
- FR-AI-08.6: Khi dữ liệu sản phẩm/blog thay đổi trạng thái publish/ẩn, chatbot phải sử dụng dữ liệu mới tương ứng.

---

### 4.3 Nhóm Admin/CMS

#### FR-ADM-01. Đăng nhập quản trị

**Mức ưu tiên:** Must Have  
**Mô tả:** Hệ thống phải yêu cầu admin đăng nhập trước khi truy cập CMS.

**Yêu cầu chi tiết:**

- FR-ADM-01.1: Admin đăng nhập bằng email/tên đăng nhập và mật khẩu.
- FR-ADM-01.2: Hệ thống phải thông báo lỗi khi thông tin đăng nhập sai.
- FR-ADM-01.3: Hệ thống phải có cơ chế đăng xuất.
- FR-ADM-01.4: Session/token phải có thời hạn.

#### FR-ADM-02. Quản lý sản phẩm

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải có thể tạo, sửa, xóa mềm, publish/ẩn sản phẩm.

**Yêu cầu chi tiết:**

- FR-ADM-02.1: Admin có thể tạo sản phẩm với tên, slug, mô tả ngắn, mô tả chi tiết, danh mục, ảnh, giá mặc định và trạng thái.
- FR-ADM-02.2: Admin có thể cập nhật thông tin sản phẩm.
- FR-ADM-02.3: Admin có thể đặt trạng thái `Draft`, `Published`, `Hidden`, `Archived`.
- FR-ADM-02.4: Admin có thể xem danh sách sản phẩm có tìm kiếm/phân trang.
- FR-ADM-02.5: Admin có thể gắn sản phẩm liên quan.
- FR-ADM-02.6: Sản phẩm bị ẩn không được xuất hiện trên website và chatbot.

#### FR-ADM-03. Quản lý biến thể sản phẩm

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải có thể quản lý biến thể như có nhiệt/không nhiệt, màu sắc, mùi hương, kích thước hoặc loại combo.

**Yêu cầu chi tiết:**

- FR-ADM-03.1: Mỗi sản phẩm có thể có nhiều biến thể.
- FR-ADM-03.2: Mỗi biến thể có thể có tên, SKU, giá bán, giá gạch, tồn kho hiển thị, ảnh riêng và trạng thái.
- FR-ADM-03.3: Biến thể ẩn/hết hàng phải được phản ánh trên website và chatbot.
- FR-ADM-03.4: Nếu sản phẩm có biến thể, trang chi tiết phải cho người dùng xem/chọn biến thể.

#### FR-ADM-04. Quản lý ảnh sản phẩm và asset

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải có thể upload và quản lý ảnh sản phẩm/blog/logo.

**Yêu cầu chi tiết:**

- FR-ADM-04.1: Hệ thống phải cho phép upload ảnh định dạng phổ biến như JPG, PNG, WEBP.
- FR-ADM-04.2: Hệ thống phải giới hạn dung lượng file theo cấu hình.
- FR-ADM-04.3: Admin có thể chọn ảnh đại diện sản phẩm.
- FR-ADM-04.4: Admin có thể thêm alt text cho ảnh.
- FR-ADM-04.5: Ảnh bị xóa khỏi sản phẩm không được hiển thị trên website.

#### FR-ADM-05. Quản lý danh mục

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải có thể quản lý danh mục/nhóm sản phẩm.

**Yêu cầu chi tiết:**

- FR-ADM-05.1: Admin có thể tạo, sửa, ẩn danh mục.
- FR-ADM-05.2: Danh mục có tên, slug, mô tả, ảnh đại diện nếu có và trạng thái.
- FR-ADM-05.3: Một danh mục có thể chứa nhiều sản phẩm.
- FR-ADM-05.4: Danh mục ẩn không hiển thị trên website.

#### FR-ADM-06. Quản lý bài viết blog

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải có thể tạo, sửa, xóa mềm, publish/ẩn bài viết blog.

**Yêu cầu chi tiết:**

- FR-ADM-06.1: Bài viết có tiêu đề, slug, mô tả ngắn, nội dung, ảnh đại diện, tác giả, ngày publish, trạng thái.
- FR-ADM-06.2: Bài viết có meta title, meta description, keyword chính.
- FR-ADM-06.3: Bài viết có thể gắn sản phẩm liên quan.
- FR-ADM-06.4: Bài viết sức khỏe phải có disclaimer hoặc được gắn cờ cần disclaimer.
- FR-ADM-06.5: Bài viết ẩn không xuất hiện trên website và không được chatbot dùng như nguồn tư vấn chính.

#### FR-ADM-07. Quản lý lead

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải xem và xử lý lead từ form liên hệ hoặc chatbot.

**Yêu cầu chi tiết:**

- FR-ADM-07.1: Lead phải lưu họ tên, số điện thoại, nội dung, sản phẩm quan tâm nếu có, nguồn lead và thời gian gửi.
- FR-ADM-07.2: Nguồn lead có thể là `Contact Form`, `Product Detail`, `Chatbot`, `Blog CTA`.
- FR-ADM-07.3: Admin có thể đổi trạng thái lead: `New`, `Contacted`, `Qualified`, `Closed`, `Rejected`.
- FR-ADM-07.4: Admin có thể ghi chú nội bộ cho lead.
- FR-ADM-07.5: Admin có thể tìm kiếm/lọc lead theo ngày, trạng thái, nguồn.

#### FR-ADM-08. Quản lý cấu hình website

**Mức ưu tiên:** Must Have  
**Mô tả:** Admin phải có thể cấu hình thông tin liên hệ và nội dung chung.

**Yêu cầu chi tiết:**

- FR-ADM-08.1: Admin có thể cập nhật hotline, Zalo, Facebook, email, địa chỉ.
- FR-ADM-08.2: Admin có thể cập nhật nội dung footer.
- FR-ADM-08.3: Admin có thể cập nhật metadata mặc định của website.
- FR-ADM-08.4: Admin có thể cập nhật disclaimer mặc định.

#### FR-ADM-09. Dashboard tối thiểu

**Mức ưu tiên:** Should Have  
**Mô tả:** Admin nên có dashboard tổng quan để xem nhanh dữ liệu vận hành.

**Yêu cầu chi tiết:**

- FR-ADM-09.1: Dashboard hiển thị tổng số sản phẩm, bài viết, lead mới.
- FR-ADM-09.2: Dashboard hiển thị số hội thoại chatbot gần đây nếu bật lưu lịch sử.
- FR-ADM-09.3: Dashboard hiển thị sản phẩm sắp hết/hết hàng theo tồn kho hiển thị nếu có.

---

## 5. Use Case chính

### UC-01. Xem danh sách sản phẩm

| Trường | Nội dung |
|---|---|
| Actor | Khách truy cập |
| Mục tiêu | Tìm sản phẩm phù hợp trong danh mục NaHerbs |
| Tiền điều kiện | Có sản phẩm Published trong CMS |
| Luồng chính | 1. Người dùng vào trang Sản phẩm. 2. Hệ thống hiển thị danh sách sản phẩm. 3. Người dùng lọc/tìm kiếm. 4. Người dùng chọn một sản phẩm. 5. Hệ thống mở trang chi tiết. |
| Ngoại lệ | Nếu không có sản phẩm phù hợp, hệ thống hiển thị trạng thái rỗng và gợi ý liên hệ/chatbot. |
| Hậu điều kiện | Người dùng xem được sản phẩm hoặc chuyển sang tư vấn. |

### UC-02. Xem chi tiết sản phẩm

| Trường | Nội dung |
|---|---|
| Actor | Khách truy cập |
| Mục tiêu | Xem thông tin chi tiết, biến thể, giá và CTA liên hệ |
| Tiền điều kiện | Sản phẩm tồn tại và Published |
| Luồng chính | 1. Người dùng mở trang sản phẩm. 2. Hệ thống hiển thị ảnh, giá, mô tả, biến thể, trạng thái. 3. Người dùng chọn CTA liên hệ hoặc hỏi chatbot. |
| Ngoại lệ | Nếu sản phẩm bị ẩn, hệ thống trả 404 hoặc redirect phù hợp. |
| Hậu điều kiện | Người dùng có đủ thông tin để quyết định liên hệ/đặt tư vấn. |

### UC-03. Gửi lead tư vấn

| Trường | Nội dung |
|---|---|
| Actor | Khách hàng tiềm năng |
| Mục tiêu | Để lại thông tin cho NaHerbs tư vấn |
| Tiền điều kiện | Form liên hệ khả dụng |
| Luồng chính | 1. Người dùng mở form. 2. Nhập họ tên, số điện thoại, nhu cầu. 3. Gửi form. 4. Hệ thống validate. 5. Hệ thống lưu lead. 6. Hệ thống thông báo thành công. |
| Ngoại lệ | Nếu thiếu dữ liệu hoặc sai số điện thoại, hệ thống hiển thị lỗi. |
| Hậu điều kiện | Lead xuất hiện trong Admin/CMS. |

### UC-04. Hỏi chatbot để được tư vấn sản phẩm

| Trường | Nội dung |
|---|---|
| Actor | Người dùng cần tư vấn nhanh |
| Mục tiêu | Nhận gợi ý sản phẩm phù hợp từ danh mục hiện có |
| Tiền điều kiện | Chatbot đang bật; có dữ liệu sản phẩm Published |
| Luồng chính | 1. Người dùng mở chatbot. 2. Người dùng nhập nhu cầu. 3. Chatbot phân tích nhu cầu. 4. Nếu cần, chatbot hỏi thêm. 5. Chatbot truy xuất sản phẩm phù hợp. 6. Chatbot trả lời tối đa 3 sản phẩm kèm lý do, giá, biến thể, trạng thái và CTA. |
| Ngoại lệ | Nếu không có sản phẩm phù hợp, chatbot nói rõ và đề xuất liên hệ tư vấn viên. Nếu câu hỏi có yếu tố y tế nghiêm trọng, chatbot khuyên thăm khám và chỉ tư vấn sản phẩm ở mức hỗ trợ thư giãn. |
| Hậu điều kiện | Người dùng xem sản phẩm, gửi lead hoặc liên hệ NaHerbs. |

### UC-05. Admin quản lý sản phẩm

| Trường | Nội dung |
|---|---|
| Actor | Admin |
| Mục tiêu | Tạo/cập nhật sản phẩm hiển thị trên website và chatbot |
| Tiền điều kiện | Admin đã đăng nhập |
| Luồng chính | 1. Admin mở menu Sản phẩm. 2. Tạo hoặc sửa sản phẩm. 3. Nhập thông tin, ảnh, danh mục, giá, trạng thái. 4. Lưu. 5. Hệ thống cập nhật website và nguồn dữ liệu chatbot. |
| Ngoại lệ | Nếu thiếu trường bắt buộc hoặc slug trùng, hệ thống báo lỗi. |
| Hậu điều kiện | Sản phẩm được lưu và hiển thị/ẩn theo trạng thái. |

### UC-06. Admin quản lý chatbot

| Trường | Nội dung |
|---|---|
| Actor | Admin |
| Mục tiêu | Cấu hình cách chatbot tư vấn và fallback |
| Tiền điều kiện | Admin đã đăng nhập |
| Luồng chính | 1. Admin mở menu Chatbot. 2. Bật/tắt chatbot. 3. Cập nhật lời chào, câu hỏi gợi ý, fallback contact, guardrail. 4. Lưu cấu hình. 5. Hệ thống áp dụng cấu hình mới trên website. |
| Ngoại lệ | Nếu cấu hình không hợp lệ, hệ thống báo lỗi. |
| Hậu điều kiện | Chatbot hoạt động theo cấu hình mới. |

### UC-07. Admin xử lý lead

| Trường | Nội dung |
|---|---|
| Actor | Admin |
| Mục tiêu | Theo dõi và xử lý lead từ website/chatbot |
| Tiền điều kiện | Admin đã đăng nhập; có lead trong hệ thống |
| Luồng chính | 1. Admin mở Lead. 2. Lọc lead mới. 3. Xem chi tiết. 4. Liên hệ khách qua kênh ngoài. 5. Cập nhật trạng thái và ghi chú. |
| Ngoại lệ | Nếu không có lead, hệ thống hiển thị trạng thái rỗng. |
| Hậu điều kiện | Lead được cập nhật trạng thái xử lý. |

---

## 6. Yêu cầu dữ liệu

### 6.1 Entity: Product

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID sản phẩm |
| name | String | Có | Tên sản phẩm |
| slug | String | Có | URL slug, duy nhất |
| shortDescription | Text | Có | Mô tả ngắn |
| description | Rich Text | Có | Mô tả chi tiết |
| categoryIds | List | Có | Danh mục sản phẩm |
| thumbnailUrl | String | Không | Ảnh đại diện |
| status | Enum | Có | Draft/Published/Hidden/Archived |
| seoTitle | String | Không | Meta title |
| seoDescription | String | Không | Meta description |
| primaryKeyword | String | Không | Từ khóa SEO chính |
| safetyNote | Text | Không | Lưu ý/cảnh báo sản phẩm |
| createdAt | DateTime | Có | Thời gian tạo |
| updatedAt | DateTime | Có | Thời gian cập nhật |

### 6.2 Entity: ProductVariant

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID biến thể |
| productId | UUID/Long | Có | Sản phẩm cha |
| name | String | Có | Tên biến thể |
| sku | String | Không | Mã SKU |
| color | String | Không | Màu sắc |
| scent | String | Không | Mùi hương |
| size | String | Không | Kích thước |
| type | String | Không | Loại: Có Nhiệt/Không Nhiệt/Combo/... |
| listPrice | Decimal | Không | Giá gạch |
| salePrice | Decimal | Có | Giá bán |
| displayStock | Integer | Không | Kho hiển thị |
| stockStatus | Enum | Có | InStock/OutOfStock/LowStock/Hidden |
| imageUrl | String | Không | Ảnh riêng biến thể |
| status | Enum | Có | Active/Hidden |

### 6.3 Entity: Category

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID danh mục |
| name | String | Có | Tên danh mục |
| slug | String | Có | Slug duy nhất |
| description | Text | Không | Mô tả danh mục |
| imageUrl | String | Không | Ảnh đại diện |
| status | Enum | Có | Published/Hidden |

### 6.4 Entity: BlogPost

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID bài viết |
| title | String | Có | Tiêu đề |
| slug | String | Có | Slug duy nhất |
| excerpt | Text | Có | Mô tả ngắn |
| content | Rich Text | Có | Nội dung bài viết |
| thumbnailUrl | String | Không | Ảnh đại diện |
| status | Enum | Có | Draft/Published/Hidden/Archived |
| seoTitle | String | Không | Meta title |
| seoDescription | String | Không | Meta description |
| primaryKeyword | String | Không | Keyword chính |
| relatedProductIds | List | Không | Sản phẩm liên quan |
| requireDisclaimer | Boolean | Có | Có cần disclaimer sức khỏe không |
| publishedAt | DateTime | Không | Ngày publish |

### 6.5 Entity: Lead

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID lead |
| fullName | String | Có | Họ tên |
| phone | String | Có | Số điện thoại |
| email | String | Không | Email |
| message | Text | Có | Nội dung nhu cầu |
| source | Enum | Có | ContactForm/ProductDetail/Chatbot/BlogCTA |
| interestedProductId | UUID/Long | Không | Sản phẩm quan tâm |
| chatbotConversationId | UUID/Long | Không | Hội thoại tạo ra lead |
| status | Enum | Có | New/Contacted/Qualified/Closed/Rejected |
| internalNote | Text | Không | Ghi chú nội bộ |
| createdAt | DateTime | Có | Thời gian tạo |

### 6.6 Entity: ChatbotConfig

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID cấu hình |
| enabled | Boolean | Có | Bật/tắt chatbot |
| greetingMessage | Text | Có | Câu chào |
| suggestedQuestions | JSON/List | Không | Câu hỏi gợi ý |
| fallbackPhone | String | Không | Hotline fallback |
| fallbackZaloUrl | String | Không | Zalo fallback |
| fallbackFacebookUrl | String | Không | Facebook fallback |
| systemPrompt | Text | Có | Prompt hệ thống/guardrail |
| maxRecommendations | Integer | Có | Số sản phẩm gợi ý tối đa, mặc định 3 |
| updatedAt | DateTime | Có | Thời gian cập nhật |

### 6.7 Entity: ChatbotConversation

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID hội thoại |
| anonymousUserId | String | Không | ID tạm cho khách chưa đăng nhập |
| startedAt | DateTime | Có | Thời gian bắt đầu |
| lastMessageAt | DateTime | Có | Tin nhắn cuối |
| leadId | UUID/Long | Không | Lead liên quan nếu có |
| summary | Text | Không | Tóm tắt nhu cầu |
| status | Enum | Có | Active/Completed/LeadCreated/Archived |

### 6.8 Entity: ChatbotMessage

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID tin nhắn |
| conversationId | UUID/Long | Có | Hội thoại |
| role | Enum | Có | User/Assistant/System |
| content | Text | Có | Nội dung tin nhắn |
| recommendedProductIds | List | Không | Sản phẩm được gợi ý |
| createdAt | DateTime | Có | Thời gian gửi |

### 6.9 Entity: SiteConfig

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| id | UUID/Long | Có | ID cấu hình |
| brandName | String | Có | Tên thương hiệu |
| hotline | String | Không | Số điện thoại |
| zaloUrl | String | Không | Link Zalo |
| facebookUrl | String | Không | Link Facebook |
| email | String | Không | Email |
| address | String | Không | Địa chỉ |
| footerContent | Text | Không | Nội dung footer |
| defaultSeoTitle | String | Không | SEO title mặc định |
| defaultSeoDescription | String | Không | SEO description mặc định |
| defaultDisclaimer | Text | Không | Disclaimer mặc định |

---

## 7. Quy tắc nghiệp vụ

| Mã | Quy tắc |
|---|---|
| BR-01 | Chỉ sản phẩm `Published` mới được hiển thị cho khách hàng. |
| BR-02 | Sản phẩm `Hidden`, `Draft`, `Archived` không được chatbot gợi ý. |
| BR-03 | Giá bán và giá gạch phải lấy từ dữ liệu CMS, không hardcode ở frontend. |
| BR-04 | Nếu sản phẩm có nhiều biến thể, giá hiển thị ở card có thể là giá thấp nhất hoặc giá mặc định theo cấu hình. |
| BR-05 | Sản phẩm hết hàng vẫn có thể hiển thị nếu admin cho phép, nhưng phải có nhãn rõ ràng. |
| BR-06 | Chatbot phải ưu tiên sản phẩm còn hàng khi tư vấn. |
| BR-07 | Chatbot không được bịa sản phẩm, biến thể, giá hoặc tồn kho. |
| BR-08 | Chatbot chỉ được dùng sản phẩm, bài viết và cấu hình đã publish/cho phép sử dụng. |
| BR-09 | Chatbot không được chẩn đoán bệnh, kê đơn, khuyên ngừng thuốc hoặc thay thế bác sĩ. |
| BR-10 | Nội dung website và chatbot không được dùng các claim như “chữa khỏi”, “điều trị dứt điểm”, “cam kết hết đau” nếu chưa có căn cứ pháp lý/y tế. |
| BR-11 | Các nội dung liên quan sức khỏe phải dùng ngôn ngữ hỗ trợ: thư giãn, làm ấm, dễ chịu, chăm sóc tại nhà. |
| BR-12 | Bài viết/blog sức khỏe phải có disclaimer hoặc cách diễn đạt an toàn. |
| BR-13 | Lead phải có số điện thoại hợp lệ trước khi lưu. |
| BR-14 | Lead từ chatbot phải gắn nguồn `Chatbot`. |
| BR-15 | Admin phải đăng nhập mới được thay đổi sản phẩm, blog, lead hoặc chatbot config. |
| BR-16 | Slug sản phẩm, danh mục và bài viết phải duy nhất. |
| BR-17 | Ảnh upload phải đúng định dạng và dung lượng được hệ thống cho phép. |
| BR-18 | Khi admin ẩn sản phẩm, sản phẩm đó phải biến mất khỏi website và nguồn tư vấn chatbot. |
| BR-19 | Khi không có sản phẩm phù hợp, chatbot phải nói rõ và chuyển hướng sang liên hệ tư vấn viên. |
| BR-20 | Chatbot không được yêu cầu người dùng cung cấp dữ liệu nhạy cảm không cần thiết. |

---

## 8. Yêu cầu phi chức năng

### 8.1 Hiệu năng

| Mã | Yêu cầu |
|---|---|
| NFR-PERF-01 | Trang chủ, danh sách sản phẩm và blog phải tải trong thời gian chấp nhận được trên mạng phổ thông. |
| NFR-PERF-02 | Ảnh phải được tối ưu dung lượng trước khi hiển thị nếu có thể. |
| NFR-PERF-03 | API danh sách sản phẩm/blog phải hỗ trợ phân trang. |
| NFR-PERF-04 | Chatbot phải phản hồi trong thời gian hợp lý; nếu chậm phải hiển thị trạng thái đang xử lý. |

### 8.2 Bảo mật

| Mã | Yêu cầu |
|---|---|
| NFR-SEC-01 | Admin/CMS phải yêu cầu xác thực. |
| NFR-SEC-02 | Mật khẩu admin phải được hash an toàn, không lưu plain text. |
| NFR-SEC-03 | API admin phải kiểm tra quyền truy cập. |
| NFR-SEC-04 | File upload phải kiểm tra MIME type, extension và dung lượng. |
| NFR-SEC-05 | Hệ thống phải chống XSS ở nội dung blog/sản phẩm rich text. |
| NFR-SEC-06 | Hệ thống phải có rate limit hoặc biện pháp chống spam cho form lead và chatbot. |
| NFR-SEC-07 | Dữ liệu cá nhân trong lead phải chỉ hiển thị cho admin được phép. |

### 8.3 Độ tin cậy và toàn vẹn dữ liệu

| Mã | Yêu cầu |
|---|---|
| NFR-REL-01 | Dữ liệu lead đã gửi thành công không được mất trong điều kiện hệ thống hoạt động bình thường. |
| NFR-REL-02 | Cập nhật trạng thái sản phẩm phải nhất quán giữa website và chatbot. |
| NFR-REL-03 | Nếu AI provider lỗi, chatbot phải hiển thị fallback liên hệ thay vì treo giao diện. |
| NFR-REL-04 | Hệ thống nên có backup database định kỳ trên production. |

### 8.4 Khả dụng và tương thích

| Mã | Yêu cầu |
|---|---|
| NFR-COMP-01 | Website phải tương thích với Chrome, Edge, Firefox, Safari phiên bản phổ biến. |
| NFR-COMP-02 | Website phải responsive trên mobile, tablet và desktop. |
| NFR-COMP-03 | Admin/CMS ưu tiên desktop nhưng không được vỡ layout trên tablet. |

### 8.5 SEO và truy cập

| Mã | Yêu cầu |
|---|---|
| NFR-SEO-01 | URL sản phẩm, danh mục, blog phải thân thiện và có slug. |
| NFR-SEO-02 | Trang sản phẩm và blog phải hỗ trợ meta title, meta description, heading hợp lý. |
| NFR-SEO-03 | Hình ảnh quan trọng nên có alt text. |
| NFR-SEO-04 | Hệ thống nên hỗ trợ sitemap.xml và robots.txt. |

### 8.6 AI Safety và chất lượng tư vấn

| Mã | Yêu cầu |
|---|---|
| NFR-AI-01 | Chatbot phải có guardrail để tránh nội dung y tế không an toàn. |
| NFR-AI-02 | Chatbot phải trả lời dựa trên dữ liệu CMS/knowledge base, không tự bịa thông tin. |
| NFR-AI-03 | Chatbot phải nêu rõ giới hạn khi câu hỏi vượt ngoài phạm vi sản phẩm NaHerbs. |
| NFR-AI-04 | Chatbot phải ưu tiên sản phẩm còn hàng và phù hợp nhu cầu. |
| NFR-AI-05 | Chatbot phải có fallback human handoff khi không chắc chắn. |

### 8.7 Khả năng bảo trì

| Mã | Yêu cầu |
|---|---|
| NFR-MAINT-01 | Code frontend, backend, admin nên được tổ chức rõ module: product, blog, lead, chatbot, config. |
| NFR-MAINT-02 | Cấu hình liên hệ, disclaimer và chatbot không nên hardcode. |
| NFR-MAINT-03 | Hệ thống cần có logging lỗi API và chatbot để debug. |
| NFR-MAINT-04 | Các enum trạng thái phải được định nghĩa thống nhất. |

---

## 9. Ma trận phân quyền tối thiểu

| Chức năng | Khách truy cập | Admin |
|---|---:|---:|
| Xem trang chủ | Có | Có |
| Xem sản phẩm published | Có | Có |
| Xem bài viết published | Có | Có |
| Gửi lead | Có | Có |
| Hỏi chatbot | Có | Có |
| Đăng nhập CMS | Không | Có |
| Quản lý sản phẩm | Không | Có |
| Quản lý biến thể | Không | Có |
| Quản lý ảnh | Không | Có |
| Quản lý danh mục | Không | Có |
| Quản lý blog | Không | Có |
| Quản lý lead | Không | Có |
| Quản lý chatbot config | Không | Có |
| Xem lịch sử chatbot | Không | Có |
| Quản lý cấu hình website | Không | Có |

---

## 10. Yêu cầu nhập liệu ban đầu

### 10.1 Danh sách sản phẩm khởi tạo

Hệ thống cần hỗ trợ nhập tối thiểu các sản phẩm ban đầu sau:

1. Gối Công Thái Học Thảo Dược – Có Nhiệt/Không Nhiệt.
2. Túi Chườm Đa Năng Thảo Dược NaHerbs – Có Nhiệt/Không Nhiệt.
3. Gối Chườm Đa Năng Thảo Dược Size To Có Bông – Có Nhiệt/Không Nhiệt.
4. Cốc Xông Hơi Ngải Cứu NaHerbs.
5. Bộ Xông Ngải Cứu Cầm Tay.
6. Bịt Mắt Thảo Dược NaHerbs.
7. Điếu Ngải Cứu NaHerbs – Điếu Ngắn/Điếu Dài.
8. Áo Choàng Chữ U Thảo Dược NaHerbs.
9. Gối Chữ U Thảo Dược NaHerbs.
10. Tinh Dầu Thảo Dược NaHerbs – Quế Hồi/Sả Chanh.

### 10.2 Bài viết/blog khởi tạo

Hệ thống cần hỗ trợ nhập tối thiểu các bài viết khởi tạo sau nếu nội dung đã sẵn sàng:

1. Gối công thái học thảo dược là gì? Công dụng và cách lựa chọn phù hợp.
2. Cách giảm đau lưng tại nhà không cần dùng thuốc.
3. Giảm đau tự nhiên bằng thảo dược: Xu hướng chăm sóc sức khỏe hiện đại.
4. Đau vai gáy sau khi ngủ dậy: Nguyên nhân và cách khắc phục.
5. Ngải cứu có tác dụng gì trong hỗ trợ giảm đau và thư giãn?

### 10.3 Câu hỏi gợi ý chatbot khởi tạo

1. Tôi bị mỏi cổ vai gáy thì nên dùng sản phẩm nào?
2. Tôi ngồi văn phòng nhiều, nên chọn gối hay túi chườm?
3. Tôi muốn mua quà tặng sức khỏe cho người lớn tuổi.
4. Tôi bị mỏi mắt do dùng máy tính nhiều, có sản phẩm nào phù hợp không?
5. Tôi muốn tìm sản phẩm xông ngải cứu tại nhà.
6. Tôi muốn tinh dầu để thư giãn không gian phòng.

---

## 11. Tiêu chí nghiệm thu tổng thể

| Mã | Tiêu chí |
|---|---|
| AC-01 | Khách truy cập có thể xem trang chủ, giới thiệu, danh sách sản phẩm, chi tiết sản phẩm, blog và liên hệ trên desktop/mobile. |
| AC-02 | Admin có thể đăng nhập CMS và quản lý sản phẩm, biến thể, ảnh, danh mục, blog, lead, cấu hình website. |
| AC-03 | Dữ liệu sản phẩm Published hiển thị đúng ở website khách hàng. |
| AC-04 | Sản phẩm Hidden/Draft không hiển thị cho khách và không được chatbot gợi ý. |
| AC-05 | Người dùng có thể gửi form tư vấn thành công và lead xuất hiện trong CMS. |
| AC-06 | Chatbot có thể nhận câu hỏi tự nhiên, hỏi làm rõ khi cần và gợi ý tối đa 3 sản phẩm hiện có. |
| AC-07 | Chatbot hiển thị tên sản phẩm, giá, biến thể, trạng thái còn hàng và lý do gợi ý. |
| AC-08 | Chatbot không đưa claim y tế nguy hiểm, không chẩn đoán, không cam kết chữa khỏi. |
| AC-09 | Khi không có sản phẩm phù hợp hoặc AI lỗi, chatbot chuyển hướng sang hotline/Zalo/Facebook/form lead. |
| AC-10 | Trang sản phẩm và blog có slug, meta title, meta description và responsive layout. |
| AC-11 | Nội dung sức khỏe trên website có disclaimer hoặc cách diễn đạt an toàn. |
| AC-12 | Admin có thể bật/tắt chatbot và sửa lời chào/câu hỏi gợi ý/fallback contact. |

---

## 12. Traceability Matrix

| Mục tiêu PRD | Yêu cầu SRS liên quan |
|---|---|
| Xây dựng website chính thức tăng độ tin cậy thương hiệu | FR-WEB-01, FR-WEB-02, FR-WEB-09 |
| Trưng bày danh mục sản phẩm | FR-WEB-03, FR-WEB-04, FR-WEB-05, FR-ADM-02, FR-ADM-03 |
| Tạo lead mua hàng/tư vấn | FR-WEB-08, FR-ADM-07, UC-03 |
| Hỗ trợ SEO bằng blog | FR-WEB-06, FR-WEB-07, FR-WEB-09, FR-ADM-06 |
| Dễ quản trị nội dung | FR-ADM-02 đến FR-ADM-09 |
| Chatbot tư vấn sản phẩm hiện có | FR-AI-01 đến FR-AI-08, UC-04 |
| Kiểm soát rủi ro claim y tế | FR-AI-05, BR-09, BR-10, BR-11, NFR-AI-01 |
| Responsive website | FR-WEB-10, NFR-COMP-02 |

---

## 13. Ngoài phạm vi phiên bản MVP

Các chức năng sau không thuộc phạm vi SRS MVP v1.0:

1. Giỏ hàng đầy đủ.
2. Checkout và thanh toán online.
3. Tích hợp vận chuyển tự động.
4. Đồng bộ kho thật/ERP/kế toán.
5. Tài khoản khách hàng và lịch sử đơn hàng.
6. Voucher, loyalty, referral.
7. Đa ngôn ngữ.
8. App mobile.
9. Livestream/bán hàng realtime.
10. Chatbot chẩn đoán bệnh, kê đơn hoặc thay thế bác sĩ.
11. Chatbot tự động đặt hàng/thanh toán không cần xác nhận người dùng.
12. Tích hợp CRM nâng cao.

---

## 14. Vấn đề cần làm rõ trước khi phát triển

| Mã | Nội dung cần làm rõ | Ảnh hưởng |
|---|---|---|
| OQ-01 | Chọn stack kỹ thuật chính thức cho frontend/backend/CMS | Thiết kế kiến trúc và estimate |
| OQ-02 | Có cần đồng bộ dữ liệu từ Google Sheet định kỳ hay nhập thủ công vào CMS? | Thiết kế import/data pipeline |
| OQ-03 | Kênh liên hệ chính là Zalo, hotline, Facebook hay form nội bộ? | Thiết kế CTA và lead workflow |
| OQ-04 | Chatbot dùng AI provider nào, giới hạn chi phí/token ra sao? | Thiết kế AI service, guardrail, logging |
| OQ-05 | Có cần lưu toàn bộ hội thoại chatbot hay chỉ lưu khi tạo lead? | Privacy, database, admin UI |
| OQ-06 | Có cần phân quyền nhiều role admin hay chỉ một admin trong MVP? | Thiết kế auth/authorization |
| OQ-07 | Tồn kho hiển thị có cần tự động trừ khi có lead/đơn không? | Logic inventory |
| OQ-08 | Nội dung disclaimer pháp lý cuối cùng do ai duyệt? | Rủi ro claim sức khỏe |
| OQ-09 | Chính sách bảo mật dữ liệu khách hàng/lead cần hiển thị công khai không? | Compliance và footer pages |
| OQ-10 | Ảnh sản phẩm có cần resize/crop tự động không? | File processing và performance |

---

## 15. Phụ lục – Gợi ý response format của chatbot

Khi chatbot gợi ý sản phẩm, phản hồi nên có cấu trúc:

```text
Dựa trên nhu cầu của bạn, NaHerbs có thể gợi ý:

1. [Tên sản phẩm]
- Phù hợp vì: [lý do ngắn]
- Biến thể nên xem: [biến thể]
- Giá bán: [giá từ CMS]
- Trạng thái: [còn hàng/hết hàng]
- Xem chi tiết: [CTA]

Lưu ý: Sản phẩm thảo dược hỗ trợ thư giãn và chăm sóc sức khỏe tại nhà, không thay thế thuốc hoặc chỉ định của bác sĩ. Nếu tình trạng đau kéo dài hoặc có dấu hiệu bất thường, bạn nên thăm khám tại cơ sở y tế.
```

Ví dụ logic tư vấn:

| Nhu cầu người dùng | Nhóm sản phẩm ưu tiên |
|---|---|
| Mỏi cổ vai gáy/ngồi văn phòng | Gối công thái học, áo choàng chữ U, túi/gối chườm |
| Đau lưng/cần chườm vùng lớn | Gối chườm đa năng size to, túi chườm đa năng |
| Mỏi mắt/mất thư giãn khi ngủ | Bịt mắt thảo dược |
| Đi công tác/du lịch | Gối chữ U thảo dược, tinh dầu |
| Xông ngải tại nhà/spa | Cốc xông hơi ngải cứu, bộ xông ngải cứu cầm tay, điếu ngải cứu |
| Muốn không gian thư giãn | Tinh dầu thảo dược Quế Hồi/Sả Chanh |
| Quà tặng sức khỏe | Gối công thái học, áo choàng chữ U, combo xông ngải, tinh dầu |
