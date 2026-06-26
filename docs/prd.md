# PRD – NaHerbs Website MVP

**Dự án:** NaHerbs Website  
**Loại tài liệu:** Product Requirements Document (PRD)  
**Phiên bản:** v1.1  
**Ngày lập:** 2026-06-27  
**Ngôn ngữ MVP:** Tiếng Việt  
**Nguồn đầu vào:** Google Drive folder `Website NaHerbs`, gồm dữ liệu sản phẩm, bài viết website, mô tả sản phẩm chi tiết, logo, ảnh blog và ảnh sản phẩm.
**Cập nhật v1.1:** Bổ sung AI Chatbot tư vấn sản phẩm dựa trên danh mục sản phẩm hiện có trong website.

---

## 1. Tổng quan sản phẩm

NaHerbs Website MVP là website giới thiệu thương hiệu, trưng bày sản phẩm và hỗ trợ tạo lead/đơn quan tâm cho thương hiệu NaHerbs. Website tập trung vào các sản phẩm chăm sóc sức khỏe cá nhân và gia đình từ thảo dược thiên nhiên như gối công thái học thảo dược, túi/gối chườm thảo dược, gối chữ U, bịt mắt thảo dược, tinh dầu thiên nhiên, cốc xông ngải cứu, bộ xông ngải cứu và điếu ngải cứu.

MVP không đặt mục tiêu trở thành sàn thương mại điện tử đầy đủ ngay từ đầu. Trọng tâm là xây dựng một website đáng tin cậy, dễ quản trị, có khả năng hiển thị danh mục sản phẩm, nội dung SEO blog, thông tin thương hiệu và kênh liên hệ/mua hàng rõ ràng.

Bên cạnh catalog và nội dung SEO, MVP cần có **AI Chatbot tư vấn sản phẩm** để hỗ trợ người dùng hỏi đáp nhanh, hiểu nhu cầu của họ và đề xuất các sản phẩm đang có trên website. Chatbot đóng vai trò như trợ lý bán hàng/tư vấn sơ bộ, không thay thế tư vấn y tế và không được tự tạo sản phẩm ngoài danh mục đã publish.

---

## 2. Bối cảnh và vấn đề cần giải quyết

### 2.1 Bối cảnh

NaHerbs định vị là thương hiệu chăm sóc sức khỏe từ thảo dược thiên nhiên, kết hợp giá trị thảo dược truyền thống với thiết kế hiện đại/công thái học. Thương hiệu hướng đến giải pháp chăm sóc sức khỏe an toàn, tiện lợi, phù hợp với nhịp sống hiện đại.

Danh mục sản phẩm hiện có nhiều nhóm sản phẩm, nhiều biến thể như có nhiệt/không nhiệt, màu Be/Nâu Chùa, mùi Quế Hồi/Sả Chanh, điếu ngắn/điếu dài. Dữ liệu sản phẩm hiện đang nằm trong Google Sheets và Google Docs, cần được chuẩn hóa để đưa lên website.

### 2.2 Vấn đề

Khách hàng cần một nơi chính thức để:

- Hiểu NaHerbs là thương hiệu gì, có giá trị gì và sản phẩm có phù hợp với nhu cầu chăm sóc sức khỏe tại nhà hay không.
- Xem danh mục sản phẩm, giá bán, biến thể, trạng thái còn hàng và mô tả rõ ràng.
- Đọc nội dung tư vấn/SEO về đau cổ vai gáy, đau lưng, chườm nóng, tinh dầu, ngải cứu và chăm sóc sức khỏe từ thảo dược.
- Hỏi chatbot để được tư vấn sản phẩm phù hợp theo nhu cầu, ví dụ cổ vai gáy, đau lưng, thư giãn mắt, xông ngải hoặc tinh dầu.
- Liên hệ nhanh để được tư vấn hoặc đặt mua.

Đội vận hành cần một nơi để:

- Quản lý sản phẩm, biến thể, ảnh, giá, tồn kho và trạng thái hiển thị.
- Quản lý bài viết blog, metadata SEO và nội dung tư vấn.
- Kiểm soát dữ liệu mà chatbot được phép sử dụng để tư vấn, bao gồm sản phẩm, biến thể, giá, tồn kho, bài viết và câu trả lời mẫu.
- Cập nhật nội dung website mà không cần chỉnh sửa code cho mỗi thay đổi nhỏ.

---

## 3. Mục tiêu sản phẩm

### 3.1 Mục tiêu kinh doanh

1. Xây dựng website chính thức cho NaHerbs để tăng độ tin cậy thương hiệu.
2. Trưng bày đầy đủ danh mục sản phẩm hiện có, giúp khách hàng dễ hiểu và dễ lựa chọn.
3. Tạo lead mua hàng/tư vấn thông qua form liên hệ, nút gọi điện, Zalo/Facebook/CTA đặt hàng.
4. Hỗ trợ SEO bằng hệ thống blog có cấu trúc, meta title, meta description và keyword rõ ràng.
5. Tạo nền tảng để mở rộng thành e-commerce đầy đủ ở giai đoạn sau.
6. Tăng tỷ lệ chuyển đổi bằng AI Chatbot có khả năng hỏi nhu cầu, tư vấn và gợi ý sản phẩm đang bán trên website.

### 3.2 Mục tiêu người dùng

1. Người dùng có thể xem thông tin thương hiệu và sản phẩm trong vòng vài thao tác.
2. Người dùng có thể lọc/tìm sản phẩm theo nhóm nhu cầu như cổ vai gáy, đau lưng, giấc ngủ, xông ngải, tinh dầu.
3. Người dùng có thể xem chi tiết sản phẩm: ảnh, giá, biến thể, mô tả, công dụng, hướng dẫn dùng, lưu ý an toàn.
4. Người dùng có thể gửi yêu cầu tư vấn/đặt mua nhanh.
5. Người dùng có thể đọc các bài viết tư vấn sức khỏe từ thảo dược và được dẫn về sản phẩm phù hợp.
6. Người dùng có thể hỏi chatbot bằng ngôn ngữ tự nhiên và nhận gợi ý sản phẩm phù hợp, kèm giá, biến thể, trạng thái còn hàng và CTA liên hệ/đặt mua.

---

## 4. Phạm vi MVP

### 4.1 Trong phạm vi MVP

#### Website khách hàng

- Trang chủ.
- Trang giới thiệu NaHerbs.
- Trang danh sách sản phẩm.
- Trang chi tiết sản phẩm.
- Trang danh mục/nhóm sản phẩm.
- Trang blog danh sách bài viết.
- Trang chi tiết bài viết blog.
- Trang liên hệ/tư vấn/đặt mua nhanh.
- Header, footer, menu điều hướng, CTA nổi.
- AI Chatbot tư vấn sản phẩm dựa trên dữ liệu sản phẩm/bài viết đã publish trong website.
- SEO cơ bản cho trang sản phẩm và blog.
- Responsive cho desktop, tablet và mobile.

#### Admin/CMS tối thiểu

- Đăng nhập quản trị.
- Quản lý sản phẩm.
- Quản lý biến thể sản phẩm.
- Quản lý ảnh sản phẩm.
- Quản lý danh mục sản phẩm.
- Quản lý bài viết blog.
- Quản lý lead/liên hệ.
- Quản lý/cấu hình chatbot ở mức tối thiểu: bật/tắt chatbot, prompt hệ thống, câu chào, câu hỏi gợi ý, fallback contact, xem lịch sử hội thoại cơ bản.
- Cấu hình nội dung cơ bản: hotline, Zalo, Facebook, địa chỉ, email, thông tin footer.

### 4.2 Ngoài phạm vi MVP

- Thanh toán online.
- Giỏ hàng/checkout thương mại điện tử đầy đủ.
- Tích hợp vận chuyển tự động.
- Tích hợp ERP/kế toán/kho thật.
- Tài khoản khách hàng, lịch sử đơn hàng.
- Loyalty/referral/voucher nâng cao.
- Đa ngôn ngữ.
- App mobile.
- Tư vấn y tế/chẩn đoán bệnh.
- Chatbot chẩn đoán bệnh, kê đơn, cam kết điều trị hoặc thay thế bác sĩ.
- Chatbot tự động đặt hàng/thanh toán không cần xác nhận người dùng.
- Chatbot tạo/gợi ý sản phẩm không tồn tại trong CMS hoặc sản phẩm đã ẩn/hết hàng nhưng không cảnh báo rõ.
- Livestream/bán hàng realtime.

---

## 5. Đối tượng người dùng

### 5.1 Khách hàng cá nhân

Những người quan tâm đến chăm sóc sức khỏe tại nhà, giảm căng cơ, thư giãn, cải thiện trải nghiệm nghỉ ngơi và sử dụng sản phẩm từ thảo dược thiên nhiên.

### 5.2 Nhân viên văn phòng

Nhóm thường xuyên ngồi lâu, làm việc với máy tính, dễ gặp đau mỏi cổ vai gáy, đau lưng, căng cơ, cần sản phẩm thư giãn tiện lợi.

### 5.3 Người lớn tuổi/người trung niên

Nhóm cần sản phẩm dễ sử dụng, an toàn, hỗ trợ thư giãn, làm ấm và chăm sóc sức khỏe hằng ngày tại nhà.

### 5.4 Người thường xuyên di chuyển

Nhóm cần các sản phẩm như gối chữ U, tinh dầu, bịt mắt thảo dược để thư giãn khi đi công tác/du lịch.

### 5.5 Doanh nghiệp mua quà tặng sức khỏe

Doanh nghiệp có nhu cầu mua sản phẩm chăm sóc sức khỏe làm quà tặng nhân viên, khách hàng hoặc đối tác.

### 5.6 Spa/cơ sở chăm sóc sức khỏe

Nhóm có thể quan tâm đến bộ xông ngải cứu, cốc xông ngải, điếu ngải cứu và tinh dầu.

### 5.7 Quản trị viên NaHerbs

Người vận hành website, cập nhật sản phẩm, giá, ảnh, blog, thông tin liên hệ và xử lý lead.

### 5.8 Người dùng cần tư vấn nhanh qua chatbot

Người dùng chưa biết chọn sản phẩm nào, có nhu cầu mô tả triệu chứng/cảm giác/hoàn cảnh sử dụng bằng ngôn ngữ tự nhiên như “đau cổ vai gáy”, “ngồi văn phòng nhiều”, “muốn quà tặng sức khỏe”, “mỏi mắt”, “cần tinh dầu thư giãn”, sau đó nhận gợi ý sản phẩm phù hợp từ danh mục hiện có.

---

## 6. Định vị thương hiệu và nguyên tắc nội dung

### 6.1 Định vị

NaHerbs là thương hiệu giải pháp chăm sóc sức khỏe từ thiên nhiên, kết hợp thảo dược Việt Nam, thiết kế hiện đại và tính tiện lợi trong đời sống hằng ngày.

### 6.2 Thông điệp chính

- Giải pháp chăm sóc sức khỏe từ thiên nhiên.
- An toàn, tiện lợi, phù hợp với cuộc sống hiện đại.
- Đồng hành cùng người dùng trong hành trình chăm sóc bản thân và gia đình.
- Minh bạch về nguyên liệu, chú trọng trải nghiệm và sự tin cậy.

### 6.3 Giá trị cốt lõi 4R

- **Responsibility – Trách nhiệm:** Cam kết sản phẩm chăm sóc sức khỏe từ thảo dược an toàn, hỗ trợ lối sống lành mạnh.
- **Respectability – Tôn trọng:** Trân trọng thảo dược Việt Nam, minh bạch nguồn gốc và phát triển bền vững.
- **Renovation – Đổi mới:** Kết hợp thảo dược thiên nhiên với thiết kế hiện đại để nâng cao trải nghiệm.
- **Reliability – Đáng tin cậy:** Xây dựng niềm tin qua chất lượng sản phẩm, quy trình kiểm soát và dịch vụ tận tâm.

### 6.4 Nguyên tắc nội dung sức khỏe

Website không được truyền đạt sản phẩm như thuốc chữa bệnh. Nội dung phải dùng ngôn ngữ hỗ trợ, thư giãn, chăm sóc sức khỏe, cải thiện trải nghiệm nghỉ ngơi. Các câu như “điều trị”, “chữa khỏi”, “cam kết hết đau”, “thay thế thuốc” không được sử dụng nếu không có căn cứ pháp lý/y tế.

Mỗi trang sản phẩm, bài blog liên quan sức khỏe và luồng trả lời của chatbot cần có disclaimer hoặc cách diễn đạt an toàn:

> Sản phẩm từ thảo dược chỉ mang tính hỗ trợ thư giãn và chăm sóc sức khỏe, không thay thế thuốc hoặc phương pháp điều trị theo chỉ định của bác sĩ. Nếu tình trạng đau kéo dài hoặc có dấu hiệu bất thường, hãy thăm khám tại cơ sở y tế.

---

## 7. Danh mục sản phẩm khởi tạo

Dữ liệu dưới đây là inventory ban đầu để nhập vào hệ thống CMS.

| STT | Sản phẩm | Biến thể chính | Giá gạch | Giá bán | Trạng thái/kho |
|---:|---|---|---:|---:|---|
| 1 | Gối Công Thái Học Thảo Dược | Có Nhiệt – Màu Be; Không Nhiệt – Màu Nâu Chùa | 789.000đ | 399.000đ | Còn hàng; biến thể có nhiệt kho 50 |
| 2 | Túi Chườm Đa Năng Thảo Dược NaHerbs | Có Nhiệt – Màu Be; Không Nhiệt – Màu Nâu Chùa | 489.000đ / 389.000đ | 249.000đ / 199.000đ | Còn hàng; biến thể có nhiệt kho 50 |
| 3 | Gối Chườm Đa Năng Thảo Dược Size To Có Bông | Có Nhiệt – Màu Be; Không Nhiệt – Màu Nâu Chùa | 489.000đ / 389.000đ | 249.000đ / 199.000đ | Còn hàng; biến thể có nhiệt kho 50 |
| 4 | Cốc Xông Hơi Ngải Cứu NaHerbs | Combo; Màu Be/Nâu Chùa | 589.000đ | 299.000đ | Còn hàng; kho 6 |
| 5 | Bộ Xông Ngải Cứu Cầm Tay | Combo | 569.000đ | 289.000đ | Còn hàng; kho 1 |
| 6 | Bịt Mắt Thảo Dược NaHerbs | Màu Be/Nâu Chùa | 198.000đ | 99.000đ | Còn hàng; kho 50 |
| 7 | Điếu Ngải Cứu NaHerbs | Điếu Ngắn; Điếu Dài | 309.000đ | 159.000đ | Còn hàng; điếu ngắn kho 10 |
| 8 | Áo Choàng Chữ U Thảo Dược NaHerbs | Màu Be/Nâu Chùa | 589.000đ | 299.000đ | Còn hàng; kho 50 |
| 9 | Gối Chữ U Thảo Dược NaHerbs | Màu Be/Nâu Chùa | 178.000đ | 89.000đ | Còn hàng; kho 10 |
| 10 | Tinh Dầu Thảo Dược NaHerbs | Mùi Quế Hồi; Mùi Sả Chanh | 112.000đ | 49.000đ | Còn hàng; mùi Quế Hồi kho 100 |

### 7.1 Nhóm danh mục đề xuất

- Gối & sản phẩm hỗ trợ cổ vai gáy.
- Túi/gối chườm thảo dược.
- Sản phẩm xông ngải cứu.
- Tinh dầu thiên nhiên.
- Phụ kiện thư giãn/du lịch.
- Quà tặng sức khỏe.

---

## 8. Content SEO và blog

### 8.1 Mục tiêu blog

Blog giúp NaHerbs tăng khả năng tìm kiếm tự nhiên, xây dựng niềm tin, giáo dục người dùng và dẫn dắt về sản phẩm phù hợp.

### 8.2 Nhóm từ khóa chính

- gối thảo dược
- gối chườm thảo dược
- túi chườm thảo dược
- gối chườm nóng
- túi chườm nóng
- gối cổ vai gáy
- gối giảm đau cổ vai gáy
- bịt mắt ngủ thảo dược
- tinh dầu thiên nhiên
- tinh dầu sả chanh
- đấm lưng thảo dược
- cách giảm đau cổ vai gáy
- cách giảm đau lưng
- cách giảm đau cổ
- mẹo giảm đau vai
- thư giãn cơ vai
- giảm đau tự nhiên
- giảm đau bằng thảo dược
- chườm nóng đúng cách
- chườm nóng cổ vai gáy
- chườm nóng đau lưng
- ngải cứu giảm đau

### 8.3 Bài viết khởi tạo trong MVP

MVP nên nhập trước các bài đã có nội dung trong tài liệu:

1. Gối công thái học thảo dược là gì? Công dụng và cách lựa chọn phù hợp.
2. Cách giảm đau lưng tại nhà không cần dùng thuốc.
3. Giảm đau tự nhiên bằng thảo dược: Xu hướng chăm sóc sức khỏe hiện đại.
4. Đau vai gáy sau khi ngủ dậy: Nguyên nhân và cách khắc phục.
5. Ngải cứu có tác dụng gì trong hỗ trợ giảm đau và thư giãn?

### 8.4 Yêu cầu SEO cho blog

- Mỗi bài có slug riêng.
- Mỗi bài có meta title và meta description.
- Mỗi bài có keyword chính.
- Mỗi bài có ảnh đại diện và alt text.
- Mỗi bài có mục lục nếu nội dung dài.
- Mỗi bài có CTA liên quan đến sản phẩm phù hợp.
- Nội dung sức khỏe cần disclaimer không thay thế tư vấn y tế.

---

## 9. User stories

### 9.1 Khách hàng

| ID | User story | Priority |
|---|---|---|
| US-CUS-01 | Là khách hàng, tôi muốn xem trang chủ để hiểu NaHerbs bán gì và thương hiệu có đáng tin không. | P0 |
| US-CUS-02 | Là khách hàng, tôi muốn xem danh sách sản phẩm để so sánh các lựa chọn. | P0 |
| US-CUS-03 | Là khách hàng, tôi muốn lọc sản phẩm theo danh mục/nhu cầu để tìm nhanh sản phẩm phù hợp. | P0 |
| US-CUS-04 | Là khách hàng, tôi muốn xem chi tiết sản phẩm gồm giá, ảnh, biến thể, mô tả, công dụng và lưu ý sử dụng. | P0 |
| US-CUS-05 | Là khách hàng, tôi muốn chọn biến thể sản phẩm để biết giá và trạng thái còn hàng tương ứng. | P0 |
| US-CUS-06 | Là khách hàng, tôi muốn gửi thông tin liên hệ/tư vấn để được NaHerbs hỗ trợ mua hàng. | P0 |
| US-CUS-07 | Là khách hàng, tôi muốn đọc blog để biết cách chăm sóc sức khỏe tại nhà. | P1 |
| US-CUS-08 | Là khách hàng, tôi muốn từ bài blog đi đến sản phẩm liên quan. | P1 |
| US-CUS-09 | Là khách hàng, tôi muốn dùng website tốt trên điện thoại. | P0 |
| US-CUS-10 | Là khách hàng, tôi muốn hỏi chatbot về nhu cầu của mình để được gợi ý sản phẩm phù hợp đang có trên website. | P0 |
| US-CUS-11 | Là khách hàng, tôi muốn chatbot giải thích vì sao sản phẩm được gợi ý phù hợp với nhu cầu của tôi. | P0 |
| US-CUS-12 | Là khách hàng, tôi muốn từ câu trả lời chatbot bấm xem chi tiết sản phẩm hoặc gửi yêu cầu tư vấn/đặt mua. | P0 |

### 9.2 Quản trị viên

| ID | User story | Priority |
|---|---|---|
| US-ADM-01 | Là admin, tôi muốn đăng nhập để quản lý nội dung website. | P0 |
| US-ADM-02 | Là admin, tôi muốn thêm/sửa/xóa sản phẩm để cập nhật danh mục. | P0 |
| US-ADM-03 | Là admin, tôi muốn quản lý biến thể sản phẩm gồm màu, loại, mùi, giá và tồn kho. | P0 |
| US-ADM-04 | Là admin, tôi muốn upload/sắp xếp ảnh sản phẩm. | P0 |
| US-ADM-05 | Là admin, tôi muốn thêm/sửa/xóa bài blog và metadata SEO. | P1 |
| US-ADM-06 | Là admin, tôi muốn xem danh sách lead/liên hệ để xử lý yêu cầu khách hàng. | P0 |
| US-ADM-07 | Là admin, tôi muốn thay đổi hotline, Zalo, Facebook, địa chỉ và thông tin footer. | P1 |
| US-ADM-08 | Là admin, tôi muốn cấu hình chatbot để chatbot chỉ tư vấn dựa trên sản phẩm và nội dung đã publish. | P0 |
| US-ADM-09 | Là admin, tôi muốn xem lịch sử hội thoại/lead từ chatbot để biết khách hàng đang quan tâm sản phẩm nào. | P1 |

---

## 10. Functional requirements

### FR-01. Trang chủ

**Priority:** P0

Trang chủ cần hiển thị:

- Hero section với thông điệp chính, ảnh/visual thương hiệu và CTA.
- Nhóm sản phẩm nổi bật.
- Lợi ích chính: thảo dược thiên nhiên, thiết kế tiện lợi, hỗ trợ thư giãn, dễ sử dụng tại nhà.
- Danh mục sản phẩm.
- Giới thiệu ngắn về NaHerbs.
- 3–5 bài blog mới/tiêu biểu.
- CTA liên hệ tư vấn/đặt mua.

**Acceptance criteria:**

- Người dùng vào website hiểu NaHerbs bán gì trong 5 giây đầu.
- CTA chính hiển thị rõ trên màn hình đầu tiên ở desktop và mobile.
- Sản phẩm nổi bật dẫn đúng đến trang chi tiết.

---

### FR-02. Trang giới thiệu NaHerbs

**Priority:** P0

Trang giới thiệu cần hiển thị:

- Tổng quan thương hiệu.
- Tầm nhìn.
- Sứ mệnh.
- Giá trị cốt lõi 4R.
- Danh mục sản phẩm và định hướng chăm sóc sức khỏe từ thiên nhiên.
- CTA liên hệ hoặc xem sản phẩm.

**Acceptance criteria:**

- Nội dung không chứa claim y tế quá mức.
- Giá trị 4R được trình bày rõ ràng, dễ đọc.

---

### FR-03. Danh sách sản phẩm

**Priority:** P0

Trang danh sách sản phẩm cần hỗ trợ:

- Hiển thị card sản phẩm gồm ảnh, tên, giá gạch, giá bán, nhãn còn hàng/hết hàng.
- Lọc theo danh mục.
- Lọc theo nhu cầu sử dụng.
- Tìm kiếm theo tên sản phẩm.
- Sắp xếp cơ bản: mới nhất, giá thấp đến cao, giá cao đến thấp.
- Phân trang hoặc tải thêm.

**Acceptance criteria:**

- Card sản phẩm hiển thị giá đúng theo biến thể mặc định.
- Sản phẩm hết hàng vẫn có thể hiển thị nhưng cần nhãn rõ ràng.
- Mobile hiển thị tối thiểu 2 sản phẩm mỗi hàng hoặc 1 sản phẩm mỗi hàng tùy breakpoint.

---

### FR-04. Chi tiết sản phẩm

**Priority:** P0

Trang chi tiết sản phẩm cần hiển thị:

- Gallery ảnh sản phẩm.
- Tên sản phẩm.
- Giá gạch và giá bán.
- Biến thể: phiên bản, màu, mùi, loại điếu hoặc thuộc tính tương ứng.
- Tình trạng còn hàng/kho nếu được bật hiển thị.
- Mô tả ngắn.
- Mô tả chi tiết.
- Công dụng/lợi ích.
- Hướng dẫn sử dụng.
- Hướng dẫn bảo quản.
- Lưu ý an toàn và disclaimer sức khỏe.
- Sản phẩm liên quan.
- CTA: liên hệ tư vấn, đặt mua qua form, gọi điện/Zalo.

**Acceptance criteria:**

- Khi đổi biến thể, giá/trạng thái/kho/ảnh nếu có phải cập nhật tương ứng.
- Không cho gửi lead nếu chưa có thông tin liên hệ bắt buộc.
- Nội dung sản phẩm không khẳng định chữa bệnh.

---

### FR-05. Form liên hệ/tư vấn/đặt mua nhanh

**Priority:** P0

Form cần thu thập:

- Họ tên.
- Số điện thoại.
- Sản phẩm quan tâm.
- Biến thể nếu người dùng chọn từ trang sản phẩm.
- Số lượng.
- Ghi chú.

**Validation:**

- Họ tên bắt buộc.
- Số điện thoại bắt buộc, đúng định dạng cơ bản Việt Nam.
- Sản phẩm quan tâm bắt buộc nếu gửi từ trang chi tiết sản phẩm.

**Acceptance criteria:**

- Sau khi gửi thành công, người dùng thấy thông báo rõ ràng.
- Admin thấy lead trong trang quản trị.
- Hệ thống không lưu trùng nhiều lead giống nhau trong thời gian ngắn nếu user bấm gửi nhiều lần.

---

### FR-06. Blog list

**Priority:** P1

Trang blog list cần hỗ trợ:

- Danh sách bài viết.
- Ảnh đại diện.
- Tiêu đề.
- Mô tả ngắn/excerpt.
- Danh mục/tag.
- Tìm kiếm bài viết.
- Lọc theo chủ đề.

**Acceptance criteria:**

- Bài viết mới nhất hiển thị trước theo mặc định.
- Click bài viết mở đúng trang chi tiết.

---

### FR-07. Blog detail

**Priority:** P1

Trang chi tiết bài viết cần hiển thị:

- Tiêu đề.
- Meta/keyword phục vụ SEO.
- Ảnh đại diện.
- Nội dung định dạng heading, paragraph, list, image.
- Bài viết liên quan.
- CTA sản phẩm liên quan.
- Disclaimer sức khỏe nếu nội dung có nhắc đến giảm đau/thảo dược/chăm sóc sức khỏe.

**Acceptance criteria:**

- Heading H1 chỉ có 1 lần.
- Slug thân thiện SEO.
- Meta title/description được render đúng.

---

### FR-08. Admin authentication

**Priority:** P0

Admin cần đăng nhập trước khi truy cập CMS.

**Acceptance criteria:**

- Không đăng nhập không được vào trang quản trị.
- Có cơ chế logout.
- Mật khẩu không lưu plaintext.

---

### FR-09. Product CMS

**Priority:** P0

Admin có thể:

- Tạo sản phẩm.
- Sửa sản phẩm.
- Ẩn/hiện sản phẩm.
- Xóa mềm sản phẩm.
- Gắn danh mục.
- Nhập mô tả ngắn, mô tả chi tiết, công dụng, hướng dẫn sử dụng, bảo quản, lưu ý.
- Quản lý SEO title, SEO description, slug.

**Acceptance criteria:**

- Slug không trùng.
- Giá bán không lớn hơn giá gạch nếu cả hai cùng có dữ liệu.
- Sản phẩm chưa có tên không được publish.

---

### FR-10. Variant CMS

**Priority:** P0

Admin có thể quản lý biến thể:

- Tên biến thể.
- Thuộc tính: phiên bản, màu, mùi, loại, size.
- Giá gạch.
- Giá bán.
- Tồn kho.
- Trạng thái.
- Ảnh riêng nếu có.

**Acceptance criteria:**

- Một sản phẩm có thể có nhiều biến thể.
- Biến thể có thể kế thừa ảnh/mô tả từ sản phẩm cha nếu không có dữ liệu riêng.
- Không cho publish sản phẩm nếu không có ít nhất một biến thể bán được, trừ khi sản phẩm được cấu hình không dùng biến thể.

---

### FR-11. Media management

**Priority:** P0

Admin có thể upload và quản lý ảnh:

- Ảnh sản phẩm.
- Ảnh blog.
- Logo/asset thương hiệu.
- Alt text.
- Thứ tự hiển thị.

**Acceptance criteria:**

- Ảnh upload được validate định dạng và dung lượng.
- Ảnh sản phẩm phải có ảnh đại diện.
- Alt text nên bắt buộc hoặc cảnh báo thiếu để hỗ trợ SEO/accessibility.

---

### FR-12. Blog CMS

**Priority:** P1

Admin có thể:

- Tạo/sửa/xóa mềm bài viết.
- Lưu nháp/publish.
- Gắn danh mục/tag.
- Nhập meta title, meta description, keyword chính.
- Chọn ảnh đại diện.
- Gắn sản phẩm liên quan.

**Acceptance criteria:**

- Bài chưa publish không hiển thị ngoài website.
- Slug bài viết không trùng.
- Bài viết có cảnh báo nếu thiếu meta title hoặc meta description.

---

### FR-13. Lead management

**Priority:** P0

Admin có thể xem danh sách lead:

- Thời gian gửi.
- Họ tên.
- Số điện thoại.
- Sản phẩm/biến thể quan tâm.
- Số lượng.
- Ghi chú.
- Trạng thái xử lý: mới, đã liên hệ, đang xử lý, hoàn tất, bỏ qua.

**Acceptance criteria:**

- Lead mới hiển thị đầu danh sách.
- Admin có thể đổi trạng thái xử lý.
- Có tìm kiếm theo số điện thoại/tên.

---

### FR-14. Cấu hình website

**Priority:** P1

Admin có thể cấu hình:

- Hotline.
- Zalo.
- Facebook.
- Email.
- Địa chỉ.
- Footer text.
- CTA mặc định.
- Social links.

**Acceptance criteria:**

- Thay đổi cấu hình được áp dụng ngoài website mà không cần deploy lại.


---

### FR-15. AI Chatbot tư vấn sản phẩm

**Priority:** P0

Website cần có chatbot AI hiển thị ở giao diện khách hàng dưới dạng widget nổi, ưu tiên góc dưới bên phải trên desktop và bottom sheet/floating button trên mobile.

Chatbot cần hỗ trợ:

- Chào hỏi người dùng và gợi ý một số câu hỏi nhanh như:
  - “Tôi bị mỏi cổ vai gáy nên dùng sản phẩm nào?”
  - “Tôi cần quà tặng sức khỏe cho nhân viên văn phòng.”
  - “Sản phẩm nào phù hợp để thư giãn mắt?”
  - “Tôi muốn tìm sản phẩm xông ngải cứu tại nhà.”
- Hiểu nhu cầu người dùng bằng ngôn ngữ tự nhiên.
- Hỏi thêm 1–3 câu làm rõ khi nhu cầu chưa đủ rõ, ví dụ: vị trí cần thư giãn, có cần làm nóng không, dùng tại nhà hay văn phòng, ngân sách, mua cho bản thân hay làm quà.
- Tìm và gợi ý sản phẩm từ dữ liệu sản phẩm đã publish trong CMS.
- Ưu tiên sản phẩm còn hàng; nếu sản phẩm hết hàng, chatbot phải nói rõ trạng thái và đề xuất sản phẩm thay thế nếu có.
- Trả lời kèm thông tin ngắn gọn: tên sản phẩm, giá bán, biến thể phù hợp, lý do đề xuất, CTA xem chi tiết/liên hệ tư vấn.
- Dẫn link đến trang chi tiết sản phẩm tương ứng.
- Có thể gợi ý bài blog liên quan nếu câu hỏi thiên về kiến thức/chăm sóc sức khỏe.
- Có thể tạo lead từ hội thoại khi người dùng đồng ý để lại họ tên, số điện thoại, sản phẩm quan tâm và ghi chú.
- Fallback sang hotline/Zalo/form liên hệ nếu chatbot không chắc chắn hoặc người dùng cần tư vấn trực tiếp.

Chatbot không được:

- Chẩn đoán bệnh, kê đơn, đưa lời khuyên điều trị y tế hoặc cam kết chữa khỏi.
- Tạo ra sản phẩm, giá, biến thể hoặc khuyến mãi không tồn tại trong CMS.
- Gợi ý sản phẩm đã ẩn/unpublished.
- Nói chắc chắn sản phẩm có tác dụng điều trị bệnh.
- Thu thập thông tin nhạy cảm không cần thiết.

**Nguồn dữ liệu chatbot được phép sử dụng:**

- Product/Variant đã publish.
- Giá bán, giá gạch, tồn kho/trạng thái còn hàng.
- Mô tả ngắn, mô tả chi tiết, công dụng/lợi ích, hướng dẫn dùng, bảo quản, lưu ý.
- Danh mục sản phẩm, tag nhu cầu sử dụng.
- Blog đã publish.
- Cấu hình website: hotline, Zalo, Facebook, chính sách/disclaimer.

**Format phản hồi đề xuất:**

```text
Dựa trên nhu cầu của bạn, NaHerbs gợi ý:

1. [Tên sản phẩm]
- Phù hợp vì: ...
- Biến thể nên chọn: ...
- Giá: ...
- Tình trạng: ...
- Xem chi tiết: [link]

Lưu ý: Sản phẩm thảo dược hỗ trợ thư giãn/chăm sóc sức khỏe, không thay thế tư vấn hoặc điều trị y tế.
```

**Acceptance criteria:**

- Người dùng có thể mở/đóng chatbot trên desktop và mobile.
- Chatbot trả lời được tối thiểu các nhóm nhu cầu: cổ vai gáy, đau lưng/thư giãn lưng, thư giãn mắt/giấc ngủ, xông ngải cứu, tinh dầu, quà tặng sức khỏe, du lịch/văn phòng.
- Mỗi câu trả lời tư vấn sản phẩm phải có ít nhất 1 sản phẩm có thật trong CMS hoặc nói rõ không tìm thấy sản phẩm phù hợp.
- Chatbot không được đề xuất sản phẩm ngoài danh mục đã publish.
- Chatbot không được đưa claim y tế cấm như “chữa khỏi”, “điều trị dứt điểm”, “thay thuốc”.
- Nếu thông tin sản phẩm thay đổi trong CMS, chatbot phải phản ánh dữ liệu mới sau khi đồng bộ/re-index.
- Người dùng có thể bấm CTA từ chatbot để mở trang sản phẩm hoặc gửi lead.
- Admin có thể xem lead được tạo từ chatbot với source là `chatbot`.

---

### FR-16. Chatbot Admin & Knowledge Control

**Priority:** P1 cho lịch sử hội thoại, P0 cho cấu hình an toàn tối thiểu

Admin cần có khu vực cấu hình chatbot ở mức tối thiểu.

Admin có thể:

- Bật/tắt chatbot ngoài website.
- Cấu hình câu chào đầu tiên.
- Cấu hình câu hỏi gợi ý nhanh.
- Cấu hình fallback message khi chatbot không chắc chắn.
- Cấu hình disclaimer mặc định.
- Xem danh sách hội thoại cơ bản: thời gian, nhu cầu chính, sản phẩm được gợi ý, trạng thái lead nếu có.
- Đánh dấu hội thoại cần follow-up.

**Acceptance criteria:**

- Khi chatbot bị tắt, widget không hiển thị ngoài website.
- Câu chào/câu hỏi gợi ý thay đổi từ admin được áp dụng mà không cần deploy lại.
- Hội thoại có phát sinh lead phải liên kết được với bản ghi lead.
- Không hiển thị dữ liệu nhạy cảm không cần thiết trong danh sách hội thoại.


---

## 11. Non-functional requirements

### NFR-01. Performance

- First Contentful Paint mục tiêu dưới 2.5 giây trên kết nối phổ thông.
- Ảnh cần được nén và lazy-load.
- Trang danh sách sản phẩm cần phân trang hoặc tải thêm để tránh tải quá nhiều ảnh cùng lúc.

### NFR-02. Responsive

- Website phải dùng tốt trên mobile, tablet, desktop.
- Các CTA liên hệ cần dễ bấm trên mobile.

### NFR-03. SEO

- Mỗi trang chính có title, meta description, canonical URL.
- URL thân thiện, có slug.
- Product schema và article schema nên được hỗ trợ ở giai đoạn sau nếu kịp trong MVP.
- Ảnh có alt text.
- Có sitemap.xml và robots.txt.

### NFR-04. Security

- Admin route yêu cầu xác thực.
- Mật khẩu hash an toàn.
- Validate input form.
- Chống spam form bằng rate limit hoặc captcha nhẹ.
- Chống XSS trong nội dung CMS.
- Không expose thông tin nhạy cảm trong frontend.

### NFR-05. AI reliability & safety

- Chatbot phải sử dụng cơ chế grounding/RAG hoặc function/tool retrieval từ database sản phẩm để trả lời dựa trên dữ liệu thật.
- Cần có system prompt/rule cố định để ngăn chatbot bịa sản phẩm, bịa giá, bịa tồn kho hoặc claim y tế.
- Câu trả lời tư vấn phải ưu tiên sản phẩm còn hàng và có link sản phẩm.
- Nếu confidence thấp, chatbot phải hỏi thêm hoặc chuyển sang hotline/Zalo/form tư vấn.
- Log hội thoại cần đủ để debug và cải thiện chất lượng tư vấn, nhưng không lưu thông tin nhạy cảm vượt nhu cầu.

### NFR-06. Maintainability

- Tách module sản phẩm, blog, lead, media, settings, chatbot.
- Dữ liệu sản phẩm có thể import thủ công từ sheet ban đầu.
- Nội dung blog có thể quản trị qua CMS.
- Chatbot cần có lớp service riêng để dễ thay đổi nhà cung cấp LLM hoặc thay đổi chiến lược retrieval.

### NFR-07. Accessibility

- Màu chữ có độ tương phản đủ.
- Button/CTA có label rõ.
- Ảnh có alt text.
- Form có label và lỗi validation dễ hiểu.

---

## 12. Business rules

| ID | Rule |
|---|---|
| BR-01 | Sản phẩm chỉ được publish khi có tên, slug, giá bán hoặc thông tin liên hệ mua hàng, ảnh đại diện và trạng thái hợp lệ. |
| BR-02 | Biến thể sản phẩm có thể ghi đè giá, kho, ảnh và trạng thái của sản phẩm cha. |
| BR-03 | Giá bán không được lớn hơn giá gạch nếu cả hai cùng được nhập. |
| BR-04 | Sản phẩm hết hàng phải hiển thị nhãn rõ ràng hoặc bị ẩn tùy cấu hình admin. |
| BR-05 | Nội dung không được khẳng định sản phẩm chữa bệnh hoặc thay thế thuốc. |
| BR-06 | Trang sản phẩm/bài blog liên quan sức khỏe phải có disclaimer phù hợp. |
| BR-07 | Lead từ form phải có họ tên và số điện thoại hợp lệ. |
| BR-08 | Admin có thể thay đổi trạng thái xử lý lead nhưng không nên xóa cứng dữ liệu lead. |
| BR-09 | Blog chưa publish không hiển thị ngoài website. |
| BR-10 | Slug sản phẩm và slug bài viết phải duy nhất. |
| BR-11 | Ảnh sản phẩm cần có ảnh đại diện; ảnh blog cần có ảnh đại diện nếu bài được publish. |
| BR-12 | Dữ liệu sản phẩm ban đầu từ Google Sheet là nguồn khởi tạo, nhưng CMS là nguồn vận hành sau khi website chạy. |
| BR-13 | Chatbot chỉ được tư vấn dựa trên sản phẩm, biến thể, bài blog và cấu hình đã publish/active trong CMS. |
| BR-14 | Chatbot không được bịa sản phẩm, giá, tồn kho, khuyến mãi hoặc công dụng không có trong dữ liệu nguồn. |
| BR-15 | Chatbot phải ưu tiên gợi ý sản phẩm còn hàng; nếu đề cập sản phẩm hết hàng phải cảnh báo rõ. |
| BR-16 | Chatbot không được chẩn đoán bệnh, kê đơn, cam kết chữa khỏi hoặc thay thế tư vấn y tế. |
| BR-17 | Chatbot có thể tạo lead chỉ khi người dùng chủ động cung cấp thông tin liên hệ và đồng ý nhận tư vấn. |
| BR-18 | Mỗi lead từ chatbot phải lưu source = chatbot và lưu sản phẩm/biến thể quan tâm nếu xác định được. |
| BR-19 | Hội thoại chatbot cần có cơ chế fallback sang nhân sự/hotline/Zalo khi câu hỏi vượt phạm vi tư vấn sản phẩm. |

---

## 13. Data model đề xuất

### 13.1 Product

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes | Khóa chính |
| name | String | Yes | Tên sản phẩm |
| slug | String | Yes | Unique |
| category_id | FK | Yes | Danh mục |
| short_description | Text | No | Mô tả ngắn |
| detail_description | RichText | No | Mô tả chi tiết |
| benefits | RichText | No | Công dụng/lợi ích |
| usage_instruction | RichText | No | Hướng dẫn dùng |
| preservation_instruction | RichText | No | Bảo quản |
| safety_note | RichText | No | Lưu ý an toàn |
| status | Enum | Yes | Draft/Published/Hidden |
| seo_title | String | No | SEO |
| seo_description | String | No | SEO |
| created_at | DateTime | Yes |  |
| updated_at | DateTime | Yes |  |

### 13.2 ProductVariant

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes | Khóa chính |
| product_id | FK | Yes | Product cha |
| name | String | Yes | Ví dụ: Có Nhiệt – Màu Be |
| version | String | No | Có Nhiệt/Không Nhiệt/Combo |
| color | String | No | Be/Nâu Chùa |
| scent | String | No | Quế Hồi/Sả Chanh |
| type | String | No | Điếu Ngắn/Điếu Dài |
| original_price | Decimal | No | Giá gạch |
| sale_price | Decimal | Yes | Giá bán |
| stock_quantity | Integer | No | Kho |
| status | Enum | Yes | Active/Inactive/OutOfStock |
| image_id | FK | No | Ảnh riêng nếu có |

### 13.3 Category

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes |  |
| name | String | Yes |  |
| slug | String | Yes | Unique |
| description | Text | No |  |
| display_order | Integer | No |  |
| status | Enum | Yes | Active/Hidden |

### 13.4 MediaAsset

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes |  |
| url | String | Yes | Đường dẫn ảnh |
| alt_text | String | No | SEO/accessibility |
| type | Enum | Yes | Product/Blog/Logo/Other |
| file_size | Integer | No |  |
| mime_type | String | No |  |

### 13.5 BlogPost

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes |  |
| title | String | Yes |  |
| slug | String | Yes | Unique |
| excerpt | Text | No |  |
| content | RichText/Markdown | Yes |  |
| featured_image_id | FK | No |  |
| category_id | FK | No |  |
| main_keyword | String | No |  |
| seo_title | String | No |  |
| seo_description | String | No |  |
| status | Enum | Yes | Draft/Published/Hidden |
| published_at | DateTime | No |  |

### 13.6 Lead

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes |  |
| full_name | String | Yes |  |
| phone | String | Yes |  |
| product_id | FK | No | Sản phẩm quan tâm |
| variant_id | FK | No | Biến thể quan tâm |
| quantity | Integer | No |  |
| note | Text | No |  |
| source_page | String | No | URL nguồn |
| status | Enum | Yes | New/Contacted/Processing/Done/Ignored |
| created_at | DateTime | Yes |  |


### 13.7 ChatbotConversation

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes | Khóa chính |
| session_id | String | Yes | Mã phiên ẩn danh hoặc visitor session |
| user_name | String | No | Nếu người dùng cung cấp |
| phone | String | No | Nếu người dùng cung cấp |
| detected_need | String | No | Nhu cầu chính: cổ vai gáy, đau lưng, tinh dầu... |
| recommended_product_ids | JSON/Text | No | Danh sách sản phẩm đã gợi ý |
| lead_id | FK | No | Liên kết lead nếu có |
| status | Enum | Yes | Open/Converted/NeedFollowUp/Closed |
| created_at | DateTime | Yes |  |
| updated_at | DateTime | Yes |  |

### 13.8 ChatbotMessage

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes | Khóa chính |
| conversation_id | FK | Yes | Hội thoại cha |
| role | Enum | Yes | User/Assistant/System |
| content | Text | Yes | Nội dung tin nhắn |
| product_refs | JSON/Text | No | Product/Variant được nhắc đến trong câu trả lời |
| safety_flag | String | No | Ví dụ: medical_claim_risk, out_of_scope |
| created_at | DateTime | Yes |  |

### 13.9 ChatbotConfig

| Field | Type | Required | Notes |
|---|---|---|---|
| id | UUID/Long | Yes |  |
| enabled | Boolean | Yes | Bật/tắt chatbot |
| welcome_message | Text | Yes | Câu chào |
| suggested_questions | JSON/Text | No | Danh sách câu hỏi gợi ý |
| fallback_message | Text | Yes | Tin nhắn khi không chắc chắn |
| disclaimer | Text | Yes | Disclaimer mặc định |
| updated_at | DateTime | Yes |  |

---

## 14. Sitemap đề xuất

```text
/
/about
/products
/products/{category-slug}
/product/{product-slug}
/blog
/blog/{post-slug}
/contact
/admin/login
/admin/dashboard
/admin/products
/admin/products/create
/admin/products/{id}/edit
/admin/blog
/admin/blog/create
/admin/blog/{id}/edit
/admin/leads
/admin/chatbot
/admin/chatbot/conversations
/admin/settings
```

---

## 15. Yêu cầu UI/UX

### 15.1 Phong cách giao diện

- Tự nhiên, sạch, đáng tin cậy, thân thiện với sức khỏe.
- Ưu tiên màu liên tưởng đến thiên nhiên, thảo dược, sự ấm áp và thư giãn.
- Không dùng cảm giác bệnh viện/quá y tế.
- Hình ảnh cần làm nổi bật chất liệu, texture vải, thảo dược, cảm giác sử dụng tại nhà.

### 15.2 Header

- Logo NaHerbs.
- Menu: Trang chủ, Sản phẩm, Blog, Về NaHerbs, Liên hệ.
- CTA: Tư vấn ngay / Đặt mua.
- Mobile menu dạng drawer.

### 15.3 Footer

- Thông tin thương hiệu.
- Danh mục sản phẩm.
- Chính sách/liên hệ.
- Hotline/Zalo/Facebook.
- Disclaimer ngắn về sản phẩm không thay thế điều trị y tế.

### 15.4 CTA

- CTA chính: “Tư vấn ngay”, “Đặt mua”, “Liên hệ NaHerbs”.
- Mobile nên có CTA nổi: gọi điện/Zalo.


### 15.5 Chatbot widget

- Chatbot hiển thị dạng nút nổi, không che CTA gọi điện/Zalo trên mobile.
- Khi mở, chatbot cần có câu chào ngắn, thân thiện và gợi ý câu hỏi nhanh.
- Tin nhắn gợi ý sản phẩm nên hiển thị dạng card nhỏ gồm tên sản phẩm, ảnh thumbnail nếu có, giá, trạng thái và nút “Xem chi tiết”.
- Luôn có lựa chọn chuyển sang tư vấn trực tiếp qua hotline/Zalo/form.
- Câu trả lời cần ngắn gọn, dễ hiểu, tránh thuật ngữ y tế phức tạp.
- Disclaimer nên hiển thị tinh gọn trong các câu trả lời liên quan sức khỏe.

---

## 16. Acceptance criteria tổng thể cho MVP

MVP được coi là hoàn thành khi:

1. Website public có đầy đủ trang chủ, giới thiệu, sản phẩm, chi tiết sản phẩm, blog, chi tiết blog và liên hệ.
2. Tối thiểu 10 sản phẩm khởi tạo được nhập từ dữ liệu hiện có.
3. Tối thiểu 5 bài blog khởi tạo được nhập từ tài liệu hiện có.
4. Người dùng có thể gửi form tư vấn/đặt mua và admin xem được lead.
5. Admin có thể CRUD sản phẩm, biến thể, ảnh và bài blog.
6. Website responsive tốt trên mobile và desktop.
7. Các trang sản phẩm/blog có title/meta description/slug thân thiện SEO.
8. Nội dung không chứa claim y tế sai phạm; các trang liên quan sức khỏe có disclaimer.
9. Ảnh sản phẩm/blog được tối ưu dung lượng cơ bản và có alt text.
10. Không có lỗi nghiêm trọng về bảo mật form/admin ở mức MVP.
11. Chatbot AI hoạt động trên desktop/mobile, có thể tư vấn theo nhu cầu và gợi ý sản phẩm đã publish trong CMS.
12. Chatbot không bịa sản phẩm/giá/kho và không đưa claim y tế vượt phạm vi.
13. Chatbot có CTA dẫn sang trang chi tiết sản phẩm hoặc tạo lead tư vấn.

---

## 17. Milestone triển khai đề xuất

### Milestone 1 – Setup nền tảng

- Khởi tạo project frontend/backend/CMS hoặc framework full-stack.
- Thiết kế database schema.
- Cấu hình auth admin.
- Cấu hình upload media.

### Milestone 2 – Product module

- Product listing.
- Product detail.
- Product CMS.
- Variant CMS.
- Import dữ liệu sản phẩm ban đầu.

### Milestone 3 – Brand pages & lead

- Trang chủ.
- Trang giới thiệu.
- Trang liên hệ.
- Lead form.
- Lead admin.

### Milestone 4 – Blog & SEO

- Blog listing/detail.
- Blog CMS.
- SEO metadata.
- Sitemap/robots.
- Import bài viết ban đầu.

### Milestone 5 – AI Chatbot MVP

- Thiết kế chatbot widget.
- Xây dựng API hội thoại.
- Tích hợp retrieval sản phẩm/blog từ CMS.
- Cấu hình rule an toàn: không claim y tế, không bịa sản phẩm/giá/kho.
- Hiển thị product cards trong câu trả lời.
- Tạo lead từ chatbot.
- Admin cấu hình câu chào, câu hỏi gợi ý, fallback và xem hội thoại cơ bản.

### Milestone 6 – QA & launch

- Responsive test.
- SEO checklist.
- Security checklist.
- Performance/image optimization.
- Deploy production.

---

## 18. Rủi ro và điểm cần làm rõ

| Nhóm | Vấn đề cần làm rõ | Ảnh hưởng |
|---|---|---|
| Bán hàng | MVP chỉ tạo lead hay cần giỏ hàng/checkout ngay? | Ảnh hưởng lớn đến scope backend/frontend |
| Thanh toán | Có cần COD, chuyển khoản, QR, cổng thanh toán không? | Nếu có sẽ vượt scope MVP hiện tại |
| Vận chuyển | Có cần phí ship/tỉnh thành/đơn vị vận chuyển không? | Ảnh hưởng checkout và vận hành |
| Kho | Kho trong sheet là số tham khảo hay cần đồng bộ tồn kho thật? | Ảnh hưởng logic hết hàng |
| Giá | Giá có thay đổi thường xuyên không? Ai được quyền sửa? | Ảnh hưởng CMS/permission |
| Ảnh | Ảnh trong Drive đã là ảnh final chưa? Có cần crop/resize theo chuẩn không? | Ảnh hưởng UI và thời gian nhập liệu |
| Pháp lý | Cần chính sách đổi trả, bảo hành, giao hàng, quyền riêng tư không? | Nên có trước launch |
| Y tế | Có chứng nhận/căn cứ nào cho claim sản phẩm không? | Ảnh hưởng copywriting và rủi ro pháp lý |
| SEO | Ưu tiên keyword nào trong 1–3 tháng đầu? | Ảnh hưởng kế hoạch blog |
| Brand | Có brand guideline màu/font/logo final chưa? | Ảnh hưởng UI |
| Chatbot AI | Dùng nhà cung cấp LLM nào, chi phí/token và giới hạn tốc độ ra sao? | Ảnh hưởng chi phí vận hành và kiến trúc |
| Chatbot AI | Dữ liệu sản phẩm/blog được đồng bộ vào chatbot theo thời gian thực hay theo lịch re-index? | Ảnh hưởng độ chính xác khi giá/kho thay đổi |
| Chatbot AI | Có cho phép chatbot tạo lead trực tiếp không, hay chỉ dẫn về form? | Ảnh hưởng UX và data model |
| Chatbot AI | Cần lưu lịch sử hội thoại bao lâu? | Ảnh hưởng privacy, storage và vận hành |
| Chatbot AI | Mức độ kiểm duyệt claim sức khỏe/y tế cần nghiêm ngặt đến đâu? | Ảnh hưởng rủi ro pháp lý và prompt/rule safety |

---

## 19. Recommendation cho MVP

Nên triển khai MVP theo hướng **catalog + content + lead generation + AI product advisor**, chưa làm checkout online. Lý do:

- Dữ liệu hiện có phù hợp nhất với catalog sản phẩm và SEO blog.
- Danh mục có nhiều biến thể nhưng chưa có quy trình vận chuyển/thanh toán rõ ràng.
- Lead form + Zalo/hotline giúp ra mắt nhanh, kiểm chứng nhu cầu thật và giảm độ phức tạp kỹ thuật.
- AI Chatbot giúp người dùng chọn sản phẩm nhanh hơn, đặc biệt khi danh mục có nhiều biến thể như có nhiệt/không nhiệt, màu, mùi, size.
- Sau khi có traffic và quy trình xử lý đơn ổn định, có thể mở rộng sang giỏ hàng, checkout, payment và vận chuyển.

---

## 20. Success metrics

### Giai đoạn launch MVP

- 100% sản phẩm khởi tạo có trang chi tiết.
- 100% bài blog khởi tạo có meta title/meta description.
- Website đạt responsive cơ bản trên mobile/desktop.
- Form lead hoạt động ổn định.
- Admin có thể cập nhật sản phẩm/blog không cần developer.
- Chatbot có thể trả lời các kịch bản tư vấn sản phẩm cốt lõi và dẫn đúng sang sản phẩm trong CMS.

### Giai đoạn sau launch 1–3 tháng

- Số lead qua form/Zalo/hotline.
- Tỷ lệ click CTA từ trang sản phẩm.
- Organic traffic vào blog.
- Top keyword có impression/click.
- Tỷ lệ người dùng xem sản phẩm sau khi đọc blog.
- Thời gian trung bình trên trang sản phẩm/blog.
- Số lượt mở chatbot.
- Tỷ lệ hội thoại chatbot có click sản phẩm.
- Tỷ lệ hội thoại chatbot tạo lead.
- Top nhu cầu người dùng hỏi chatbot.
- Tỷ lệ fallback sang nhân sự/hotline/Zalo.
