# UI/UX Design Specification – NaHerbs Website MVP

**Dự án:** NaHerbs Website  
**Tài liệu:** UI/UX Design Specification  
**Phiên bản:** v1.0  
**Ngày lập:** 2026-06-27  
**Frontend:** `naherb-web` – React + Vite  
**Backend:** `naherb-api` – Spring Boot  
**Database:** PostgreSQL trên Supabase  
**Mục đích sử dụng:** Làm đầu vào cho Stitch hoặc các công cụ AI UI generation để tạo màn hình website/admin responsive.

---

## 1. Tổng quan định hướng UI/UX

### 1.1 Định vị cảm xúc của giao diện

NaHerbs là thương hiệu chăm sóc sức khỏe cá nhân và gia đình từ thảo dược thiên nhiên. Website không nên có cảm giác như nhà thuốc, bệnh viện hoặc sàn thương mại điện tử flash-sale. Giao diện cần tạo cảm giác:

- Tự nhiên.
- Ấm áp.
- Tin cậy.
- Gần gũi với chăm sóc tại nhà.
- Thư giãn, dễ chịu.
- Có tính thương mại điện tử nhưng không quá “sale sốc”.
- Sạch sẽ, dễ đọc, dễ chọn sản phẩm.

### 1.2 Phong cách thiết kế tổng thể

**Style name:** Organic Wellness E-commerce

Đặc điểm:

- Nền sáng ấm, thiên kem/beige.
- Xanh thảo dược làm màu thương hiệu chính.
- Nâu đất/beige làm màu phụ để gợi cảm giác thảo mộc, vải, gối, túi chườm.
- Cam đất/terracotta dùng làm màu nhấn cho giá, khuyến mãi, CTA phụ.
- Bo góc mềm, nhiều khoảng trắng, ít đường viền cứng.
- Hình ảnh sản phẩm cần nổi bật chất liệu vải, màu be/nâu, thảo dược, cảm giác thư giãn tại nhà.
- UI phải đủ hiện đại cho e-commerce: cart, checkout, order tracking, chatbot.

### 1.3 Nguyên tắc trải nghiệm chính

1. **Nhanh hiểu:** Người dùng vào trang chủ phải hiểu NaHerbs bán gì trong 5 giây đầu.
2. **Dễ chọn:** Sản phẩm có nhiều phiên bản/màu nên UI chọn biến thể phải rõ ràng.
3. **Tin cậy:** Nội dung sức khỏe phải có disclaimer nhẹ, không nói quá công dụng.
4. **Ít ma sát:** Người dùng không cần đăng nhập khi xem sản phẩm/blog/chatbot; chỉ đăng nhập/đăng ký khi thêm vào giỏ hàng hoặc checkout.
5. **Rõ thanh toán:** COD và chuyển khoản QR phải được giải thích rõ vì QR là cố định và xác nhận thủ công.
6. **Mobile-first:** Khách hàng có khả năng mua qua điện thoại, nên tất cả screen phải responsive tốt.
7. **AI hỗ trợ bán hàng:** Chatbot nên tư vấn tự nhiên nhưng luôn dẫn về sản phẩm thật trong website.

---

## 2. Color System

### 2.1 Palette chính

NaHerbs nên dùng bộ màu **Herbal Warm Natural**.

| Token | Hex | Vai trò | Cảm giác |
|---|---|---|---|
| Primary Green | `#4F6F52` | Màu brand chính, CTA chính | Thảo dược, tin cậy, tự nhiên |
| Deep Green | `#2F4F3A` | Heading, footer, hover, text nhấn mạnh | Chững chạc, cao cấp, bền vững |
| Soft Sage | `#A8BFA3` | Nền nhẹ, icon phụ, trạng thái mềm | Dịu, thư giãn |
| Warm Cream | `#F7F1E5` | Nền toàn trang | Ấm, sạch, gần gũi |
| Herbal Beige | `#E8D8BD` | Section phụ, card nền nhẹ, border | Mộc, thảo mộc, vải tự nhiên |
| Earth Brown | `#8A6A4F` | Text phụ, badge, footer phụ | Đất, thảo dược khô |
| Terracotta Accent | `#C7774D` | Giá bán, giảm giá, CTA phụ | Ấm, nổi bật nhưng không gắt |
| Text Dark | `#2B2B2B` | Body text chính | Dễ đọc |
| Muted Text | `#6F6A61` | Text phụ, helper text | Dịu, không áp lực |
| Border Warm | `#DDD0BC` | Border input/card | Nhẹ, ấm |
| White | `#FFFFFF` | Surface/card | Sạch, rõ |

### 2.2 Semantic colors

| Token | Hex | Dùng cho |
|---|---|---|
| Success BG | `#E7F0E4` | Badge còn hàng, thông báo thành công |
| Success Text | `#4F6F52` | Text còn hàng |
| Warning BG | `#F4E9D8` | Chờ xác nhận thanh toán, lưu ý QR |
| Warning Text | `#8A6A4F` | Text cảnh báo nhẹ |
| Error BG | `#FBEAE5` | Error message, input lỗi |
| Error Text | `#B94A3A` | Lỗi form, cảnh báo nghiêm trọng |
| Info BG | `#EEF4EA` | Box thông tin, chatbot suggestion |
| Info Text | `#2F4F3A` | Text info |

### 2.3 CSS color tokens

```css
:root {
  --color-primary: #4F6F52;
  --color-primary-dark: #2F4F3A;
  --color-primary-light: #A8BFA3;

  --color-background: #F7F1E5;
  --color-surface: #FFFFFF;
  --color-surface-warm: #E8D8BD;
  --color-border: #DDD0BC;

  --color-accent: #C7774D;
  --color-brown: #8A6A4F;

  --color-text: #2B2B2B;
  --color-text-muted: #6F6A61;
  --color-placeholder: #9A948A;

  --color-success-bg: #E7F0E4;
  --color-success-text: #4F6F52;

  --color-warning-bg: #F4E9D8;
  --color-warning-text: #8A6A4F;

  --color-error-bg: #FBEAE5;
  --color-error-text: #B94A3A;
}
```

### 2.4 Cách dùng màu theo component

| Component | Màu chính |
|---|---|
| Body background | `#F7F1E5` |
| Card sản phẩm | `#FFFFFF` |
| Section thương hiệu | `#E8D8BD` hoặc gradient kem → sage |
| Header | Trắng mờ/cream, sticky, border `#DDD0BC` |
| Footer | `#2F4F3A`, chữ `#F7F1E5` |
| Button chính | Nền `#4F6F52`, chữ trắng |
| Button hover | Nền `#2F4F3A` |
| Button phụ | Border/text `#4F6F52`, nền transparent/white |
| Giá bán | `#C7774D` |
| Giá gạch | `#9A948A`, gạch ngang |
| Badge còn hàng | BG `#E7F0E4`, text `#4F6F52` |
| Badge hết hàng | BG `#F4E9D8`, text `#8A6A4F` |
| Input focus | Border `#4F6F52`, shadow xanh nhẹ |
| Chatbot header | `#4F6F52` |
| QR payment note | BG `#F4E9D8`, border `#E8D8BD` |

### 2.5 Màu nên tránh

Không nên dùng làm màu chủ đạo:

- Xanh dương y tế.
- Đỏ tươi.
- Tím đậm.
- Neon green.
- Cam sale quá chói.
- Đen trắng luxury quá lạnh.

Lý do: dễ làm website giống nhà thuốc, bệnh viện, spa luxury hoặc sàn sale đại trà.

---

## 3. Typography System

### 3.1 Font đề xuất

#### Option A – Khuyên dùng cho MVP

- **Primary font:** Inter
- **Display font:** Lora

Dùng Inter cho toàn bộ UI, form, button, admin, cart, checkout, chatbot. Dùng Lora cho một số heading lớn ở public website để tạo cảm giác wellness/thảo dược.

```css
:root {
  --font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-serif: "Lora", Georgia, serif;
}
```

#### Option B – Đơn giản hơn

Chỉ dùng Inter cho tất cả màn hình.

Phù hợp nếu muốn dev nhanh, ít rủi ro font mismatch.

### 3.2 Typography scale

```css
:root {
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-4xl: 40px;
  --text-5xl: 56px;

  --leading-tight: 1.2;
  --leading-snug: 1.35;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}
```

### 3.3 Public website typography

| Thành phần | Desktop | Mobile | Weight | Font |
|---|---:|---:|---:|---|
| Hero eyebrow | 14px | 13px | 600 | Inter |
| Hero title | 48–56px | 32–38px | 600/700 | Lora hoặc Inter |
| Hero subtitle | 18–20px | 16px | 400 | Inter |
| Section title | 32–40px | 26–30px | 600 | Lora hoặc Inter |
| Section subtitle | 16–18px | 15–16px | 400 | Inter |
| Product detail title | 32–40px | 26–32px | 600 | Inter/Lora |
| Product card title | 16–18px | 15–16px | 500/600 | Inter |
| Body text | 16px | 15–16px | 400 | Inter |
| Blog body | 17–18px | 16px | 400 | Inter |
| Small text | 13–14px | 12–13px | 400 | Inter |
| Button text | 15–16px | 15px | 600 | Inter |
| Price | 20–28px | 18–24px | 700 | Inter |

### 3.4 Admin typography

Admin CMS cần gọn, rõ, không cần font serif.

| Thành phần | Size | Weight |
|---|---:|---:|
| Page title | 24–28px | 700 |
| Section title | 18–20px | 600 |
| Table header | 13px | 600 |
| Table body | 14px | 400/500 |
| Form label | 14px | 500 |
| Input text | 14–15px | 400 |
| Button | 14–15px | 600 |
| Helper/error | 12–13px | 400 |

### 3.5 Text style rules

- Heading không nên dùng chữ quá cứng hoặc quá đậm.
- Body line-height tối thiểu 1.5.
- Blog body nên dùng line-height 1.7 để dễ đọc.
- Không dùng toàn chữ in hoa cho heading dài.
- CTA nên ngắn, động từ rõ: “Thêm vào giỏ hàng”, “Đặt hàng”, “Tư vấn ngay”, “Xem chi tiết”.

---

## 4. Spacing, Radius, Shadow, Layout Tokens

### 4.1 Spacing scale

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

### 4.2 Border radius

| Token | Value | Dùng cho |
|---|---:|---|
| `--radius-sm` | 8px | Badge nhỏ, table chip |
| `--radius-md` | 12px | Admin input, small card |
| `--radius-lg` | 16px | Input public, product card |
| `--radius-xl` | 24px | Hero card, form card, feature section |
| `--radius-pill` | 999px | Button, variant option, quantity stepper |

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;
}
```

### 4.3 Shadow

Shadow nên mềm, xanh/nâu nhẹ, không dùng shadow đen đậm.

```css
:root {
  --shadow-sm: 0 4px 12px rgba(47, 79, 58, 0.06);
  --shadow-md: 0 12px 32px rgba(47, 79, 58, 0.08);
  --shadow-lg: 0 24px 60px rgba(47, 79, 58, 0.12);
}
```

### 4.4 Container width

| Breakpoint | Max width | Padding |
|---|---:|---:|
| Mobile | 100% | 16px |
| Tablet | 100% | 24px |
| Desktop | 1180–1240px | 32px |
| Wide | 1280px | 32px |

```css
.container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}
```

---

## 5. Responsive Breakpoints

### 5.1 Breakpoint tokens

| Token | Width | Thiết bị |
|---|---:|---|
| `xs` | < 480px | Mobile nhỏ |
| `sm` | 480–767px | Mobile lớn |
| `md` | 768–1023px | Tablet |
| `lg` | 1024–1279px | Laptop/Desktop |
| `xl` | ≥ 1280px | Desktop rộng |

### 5.2 Responsive rules chung

- Mobile-first.
- Header mobile dùng hamburger/drawer.
- Product grid:
  - Mobile: 1 card/row hoặc 2 card/row nếu ảnh nhỏ và text ngắn.
  - Tablet: 2–3 card/row.
  - Desktop: 3–4 card/row.
- Product detail:
  - Desktop: gallery trái, info phải.
  - Mobile: gallery trên, info dưới, sticky add-to-cart bar dưới màn hình.
- Cart/checkout:
  - Desktop: form trái, order summary phải sticky.
  - Mobile: từng section xếp dọc, order summary có thể collapse.
- Admin:
  - Desktop: sidebar cố định.
  - Tablet/mobile: sidebar drawer, table chuyển sang card list khi cần.
- Chatbot:
  - Desktop: floating panel 380–420px.
  - Mobile: bottom sheet chiếm 80–90% chiều cao.

---

## 6. Component Design System

## 6.1 Buttons

### Button variants

| Variant | Style | Use case |
|---|---|---|
| Primary | Nền xanh, chữ trắng | CTA chính: thêm giỏ hàng, đặt hàng, đăng nhập |
| Secondary | Border xanh, chữ xanh | Xem thêm, quay lại, CTA phụ |
| Accent | Nền terracotta, chữ trắng | Giá tốt, khuyến mãi, liên hệ Zalo nếu cần nổi |
| Ghost | Transparent | Icon button, menu, admin action nhẹ |
| Danger | Nền/ chữ đỏ đất | Xóa, hủy đơn |

### Button sizing

| Size | Height | Padding | Font |
|---|---:|---:|---:|
| Small | 36px | 14px | 14px |
| Medium | 44px | 18px | 15px |
| Large | 52px | 24px | 16px |

### Button CSS guideline

```css
.button-primary {
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  border: none;
  background: #4F6F52;
  color: #FFFFFF;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.button-primary:hover {
  background: #2F4F3A;
  box-shadow: 0 8px 20px rgba(47, 79, 58, 0.16);
}

.button-primary:active {
  transform: translateY(1px);
}

.button-primary:disabled {
  background: #A8BFA3;
  cursor: not-allowed;
  box-shadow: none;
}
```

### Button copy rules

Nên dùng:

- “Thêm vào giỏ hàng”
- “Mua ngay”
- “Đặt hàng”
- “Xác nhận thanh toán”
- “Xem chi tiết”
- “Tư vấn ngay”
- “Liên hệ Zalo”

Tránh:

- “Submit”
- “OK”
- “Click here”
- “Buy!!!”

---

## 6.2 Text fields and forms

### Public input

Textfield public nên mềm, nền trắng, border be nhạt, focus xanh.

```css
.input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border-radius: 14px;
  border: 1px solid #DDD0BC;
  background: #FFFFFF;
  color: #2B2B2B;
  font-size: 15px;
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.input::placeholder {
  color: #9A948A;
}

.input:focus {
  border-color: #4F6F52;
  box-shadow: 0 0 0 4px rgba(79, 111, 82, 0.12);
}

.input:disabled {
  background: #F1E8DA;
  color: #9A948A;
  cursor: not-allowed;
}

.input-error {
  border-color: #B94A3A;
  box-shadow: 0 0 0 4px rgba(185, 74, 58, 0.10);
}
```

### Admin input

Admin input nên compact hơn.

```css
.admin-input {
  height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #DDD0BC;
  background: #FFFFFF;
  font-size: 14px;
}
```

### Textarea

```css
.textarea {
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #DDD0BC;
  background: #FFFFFF;
  color: #2B2B2B;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
}
```

### Label and helper text

```css
.label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #2F4F3A;
}

.helper {
  margin-top: 6px;
  font-size: 13px;
  color: #6F6A61;
}

.error {
  margin-top: 6px;
  font-size: 13px;
  color: #B94A3A;
}
```

### Form layout rules

- Luôn có label, không chỉ dùng placeholder.
- Placeholder dùng ví dụ ngắn, màu nhạt.
- Error hiển thị ngay dưới field.
- Required field có dấu `*` nhẹ màu terracotta hoặc error text.
- Form public nên có card trắng trên nền kem.
- Form checkout nên chia step/section rõ.

### Form card

```css
.form-card {
  background: #FFFFFF;
  border: 1px solid #E8D8BD;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(47, 79, 58, 0.08);
}
```

---

## 6.3 Select, radio, checkbox

### Select

Dùng cho địa chỉ, trạng thái admin, filter danh mục.

- Height: 48px public, 42px admin.
- Radius: 14px public, 10px admin.
- Icon chevron màu green/brown.
- Focus giống input.

### Radio card

Dùng cho chọn payment method: COD hoặc QR.

```text
[●] Thanh toán khi nhận hàng (COD)
    Bạn thanh toán tiền mặt khi nhận sản phẩm.

[○] Chuyển khoản QR
    Quét mã QR cố định và chờ NaHerbs xác nhận thủ công.
```

Style:

- Card border be nhạt.
- Active border xanh, background success bg.
- Icon radio xanh.

### Checkbox

Dùng cho:

- Đồng ý điều khoản/chính sách.
- Lưu thông tin giao hàng.
- Admin select rows.

Checkbox active màu primary green.

---

## 6.4 Product cards

### Product card anatomy

Mỗi card sản phẩm public cần có:

1. Ảnh sản phẩm.
2. Badge trạng thái: Còn hàng / Hết hàng / Sắp hết.
3. Tên sản phẩm.
4. Mô tả ngắn 1–2 dòng.
5. Giá bán.
6. Giá gạch nếu có.
7. Variant summary ngắn nếu sản phẩm có nhiều phiên bản.
8. CTA: “Xem chi tiết” hoặc “Thêm vào giỏ”.

### Product card style

```css
.product-card {
  background: #FFFFFF;
  border: 1px solid #E8D8BD;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(47, 79, 58, 0.06);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 44px rgba(47, 79, 58, 0.12);
}
```

### Image ratio

- Product card image: 4:3 hoặc 1:1.
- Product detail gallery: 1:1 hoặc 4:3.
- Blog thumbnail: 16:9.
- Hero product image: organic cutout hoặc card nền cream.

### Product card mobile

- Mobile nhỏ: 1 card/row.
- Mobile lớn: có thể 2 card/row nếu card compact.
- Text tên sản phẩm giới hạn 2 dòng.
- Button full width.

---

## 6.5 Variant selection component

Sản phẩm NaHerbs có phiên bản, màu/mùi/loại, và tồn kho tính riêng theo SKU. Không nên chỉ dùng dropdown nếu số lượng option ít. Nên dùng option pill hoặc option card.

### Example

```text
Phiên bản
[ Có Nhiệt ] [ Không Nhiệt ]

Màu sắc
[ Be ] [ Nâu Chùa ]
```

### Variant option style

```css
.variant-option {
  min-height: 42px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid #DDD0BC;
  background: #FFFFFF;
  color: #2B2B2B;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.variant-option-active {
  border-color: #4F6F52;
  background: #E7F0E4;
  color: #2F4F3A;
}

.variant-option-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  text-decoration: line-through;
}
```

### Variant UX rules

- Khi chọn phiên bản, danh sách màu/mùi phải chỉ hiển thị option khả dụng cho phiên bản đó.
- Nếu tổ hợp hết hàng, option disabled hoặc hiển thị “Hết hàng”.
- Khi chọn SKU, giá, tồn kho, ảnh nếu có phải cập nhật ngay.
- Nếu chưa chọn đủ variant, button “Thêm vào giỏ hàng” disabled và helper text: “Vui lòng chọn phiên bản và màu sắc”.

---

## 6.6 Quantity stepper

Dùng cho product detail, cart.

```text
[-] 1 [+]
```

Style:

```css
.quantity-stepper {
  display: inline-flex;
  align-items: center;
  height: 44px;
  border-radius: 999px;
  border: 1px solid #DDD0BC;
  background: #FFFFFF;
  overflow: hidden;
}
```

UX rules:

- Không cho quantity < 1.
- Không cho quantity vượt tồn kho SKU.
- Nếu tồn kho thấp, hiển thị “Chỉ còn X sản phẩm”.

---

## 6.7 Badges

| Badge | BG | Text | Dùng cho |
|---|---|---|---|
| Còn hàng | `#E7F0E4` | `#4F6F52` | Product/card/SKU |
| Sắp hết | `#F4E9D8` | `#8A6A4F` | Low stock |
| Hết hàng | `#EFE8DE` | `#8A6A4F` | Out of stock |
| Chờ xác nhận | `#F4E9D8` | `#8A6A4F` | QR payment pending |
| Đã thanh toán | `#E7F0E4` | `#4F6F52` | Payment confirmed |
| Đã hủy | `#FBEAE5` | `#B94A3A` | Cancelled order |

Badge style:

- Border-radius: 999px.
- Padding: 6px 10px.
- Font-size: 12–13px.
- Font-weight: 600.

---

## 6.8 Header navigation

### Desktop header

- Height: 72–80px.
- Background: white/cream with slight transparency.
- Sticky top.
- Left: logo NaHerbs.
- Center: navigation links.
- Right: search icon, cart icon, account icon, CTA “Tư vấn ngay” or “Chat với NaHerbs”.

Menu items:

- Trang chủ
- Sản phẩm
- Blog
- Về NaHerbs
- Liên hệ

### Mobile header

- Height: 64px.
- Left: hamburger.
- Center/left: logo.
- Right: cart icon.
- Drawer menu full height or 85% width.
- Drawer contains account/login entry, menu, hotline/Zalo CTA.

### Header visual style

```css
.header {
  background: rgba(247, 241, 229, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(221, 208, 188, 0.8);
}
```

---

## 6.9 Footer

Footer nền deep green.

Sections:

1. Brand column: logo, slogan, disclaimer ngắn.
2. Sản phẩm: danh mục chính.
3. Hỗ trợ: liên hệ, chính sách giao hàng, đổi trả, thanh toán.
4. Kết nối: Hotline, Zalo, Facebook, Email.

Footer mobile:

- Các cột xếp dọc.
- Có accordion nếu nhiều link.
- Hotline/Zalo nổi bật.

---

## 6.10 Chatbot widget

### Desktop

- Floating button bottom-right.
- Panel width: 380–420px.
- Panel height: 560–680px, max 80vh.
- Header xanh, có title “NaHerbs AI Tư vấn”.
- Body nền cream/white.
- Message bubbles.
- Product recommendation cards.
- Input pill dưới cùng.

### Mobile

- Floating button bottom-right, không che sticky add-to-cart.
- Khi mở: bottom sheet chiếm 85–90vh.
- Drag handle nhỏ ở trên.
- Input sticky bottom.

### Chat message styling

| Message | Style |
|---|---|
| User bubble | Nền primary green, chữ trắng, align right |
| Bot bubble | Nền trắng, border beige, chữ dark, align left |
| Product card | White card, image 56–72px, tên, giá, CTA nhỏ |
| Disclaimer | Text nhỏ màu muted, nền warning bg nhẹ |

### Suggested questions

Hiển thị dạng pill:

- “Tôi bị mỏi cổ vai gáy”
- “Tôi cần quà tặng sức khỏe”
- “Tôi muốn xông ngải tại nhà”
- “Tôi cần tinh dầu thư giãn”

---

## 7. Public Website Screen Design

## 7.1 Home Page `/`

### Goal

Giúp người dùng hiểu nhanh NaHerbs bán sản phẩm thảo dược chăm sóc sức khỏe tại nhà, xem sản phẩm nổi bật, mở chatbot hoặc đi đến catalog.

### Desktop layout

1. **Sticky Header**
   - Logo NaHerbs.
   - Menu.
   - Search icon.
   - Cart icon with count.
   - Account icon.
   - CTA “Tư vấn ngay”.

2. **Hero section**
   - Background: warm cream.
   - Left content:
     - Eyebrow: “Giải pháp chăm sóc sức khỏe từ thiên nhiên”.
     - H1: “Thư giãn mỗi ngày cùng thảo dược NaHerbs”.
     - Subtitle: mô tả ngắn về gối thảo dược, túi chườm, tinh dầu, xông ngải.
     - CTA primary: “Khám phá sản phẩm”.
     - CTA secondary: “Hỏi AI tư vấn”.
   - Right visual:
     - Ảnh nhóm sản phẩm trên nền beige/sage.
     - Có badge nhỏ: “100% thảo dược thiên nhiên”, “Tư vấn sản phẩm bằng AI”.

3. **Trust/benefit strip**
   - 4 item icon:
     - Thảo dược thiên nhiên.
     - Thiết kế tiện lợi.
     - Phù hợp chăm sóc tại nhà.
     - Tư vấn nhanh theo nhu cầu.

4. **Category section**
   - Title: “Chọn sản phẩm theo nhu cầu”.
   - Category cards:
     - Cổ vai gáy.
     - Chườm nóng.
     - Thư giãn mắt.
     - Xông ngải cứu.
     - Tinh dầu.
     - Quà tặng sức khỏe.

5. **Featured products**
   - Grid 4 products desktop.
   - Each card has image, name, price, variant summary, stock badge, CTA.

6. **AI advisor section**
   - Background sage/cream.
   - Copy: “Chưa biết chọn sản phẩm nào?”
   - CTA: “Hỏi NaHerbs AI”.
   - 3 suggested question pills.

7. **Brand story preview**
   - Image/illustration left.
   - Text right about NaHerbs and 4R values.
   - CTA “Về NaHerbs”.

8. **Blog preview**
   - 3 latest posts.
   - CTA “Xem tất cả bài viết”.

9. **Footer**

### Mobile layout

- Hero stack vertical.
- CTA buttons full width or stacked.
- Category cards horizontal scroll or 2 columns.
- Product grid 1–2 columns.
- Blog cards vertical.
- Sticky bottom mini bar optional: Cart + Chat/Zalo.

### Stitch prompt guidance

```text
Create a responsive homepage for NaHerbs, an herbal wellness e-commerce brand. Use warm cream background, deep herbal green headings, rounded product cards, soft natural shadows, and organic wellness visuals. Include sticky header, hero, category cards, featured product grid, AI advisor section, brand story preview, blog preview, footer, and floating chatbot button. Mobile layout should stack sections, use hamburger menu, and keep CTA buttons large and touch-friendly.
```

---

## 7.2 Product Listing Page `/products`

### Goal

Cho phép người dùng tìm sản phẩm theo nhu cầu, danh mục, search, sort, và đi đến chi tiết.

### Desktop layout

1. Header.
2. Page hero compact:
   - Title: “Sản phẩm NaHerbs”.
   - Subtitle: “Gối thảo dược, túi chườm, tinh dầu, xông ngải và sản phẩm thư giãn tại nhà”.
3. Filter/search row:
   - Search input.
   - Category dropdown.
   - Need filter chips.
   - Sort dropdown.
4. Layout:
   - Sidebar filters left 260px.
   - Product grid right 3 columns.
5. Sidebar filters:
   - Nhu cầu sử dụng.
   - Danh mục.
   - Khoảng giá.
   - Trạng thái còn hàng.
6. Product grid.
7. Pagination/load more.

### Mobile layout

- Search full width.
- Filter button opens bottom sheet.
- Product grid 1–2 columns.
- Sort dropdown inline.

### Empty state

Nếu không tìm thấy sản phẩm:

- Illustration nhẹ.
- Text: “Chưa tìm thấy sản phẩm phù hợp”.
- CTA: “Hỏi AI tư vấn” và “Xem tất cả sản phẩm”.

---

## 7.3 Product Detail Page `/product/{slug}`

### Goal

Giúp người dùng hiểu sản phẩm, chọn đúng SKU, thêm vào giỏ hàng hoặc mua ngay.

### Desktop layout

1. Breadcrumb:
   - Trang chủ / Sản phẩm / Tên sản phẩm.
2. Main product area two columns:
   - Left: Gallery.
     - Main image large.
     - Thumbnail list.
   - Right: Product info.
     - Stock badge.
     - Product name.
     - Short description.
     - Price sale + original price.
     - Variant selectors:
       - Phiên bản.
       - Màu/Mùi/Loại.
     - SKU availability message.
     - Quantity stepper.
     - Buttons:
       - “Thêm vào giỏ hàng”.
       - “Mua ngay”.
     - Secondary links:
       - “Hỏi AI về sản phẩm này”.
       - “Liên hệ Zalo”.
3. Trust note cards:
   - Thảo dược thiên nhiên.
   - Dễ sử dụng tại nhà.
   - Lưu ý không thay thế điều trị y tế.
4. Tabs/accordion:
   - Mô tả chi tiết.
   - Công dụng/lợi ích.
   - Hướng dẫn sử dụng.
   - Bảo quản.
   - Lưu ý an toàn.
5. Related products.
6. Related blog posts.

### Mobile layout

- Gallery top full width.
- Product info below.
- Variant selectors as horizontal scroll pills.
- Sticky bottom add-to-cart bar:
  - Price left.
  - “Thêm giỏ” button right.
- Tabs become accordions.

### Variant UX

- User must choose a valid SKU before add-to-cart.
- If SKU out of stock, disable add-to-cart and show alternatives.
- When selecting variant, update price/image/stock.

### Login gate behavior

- User can view detail without login.
- If user clicks “Thêm vào giỏ hàng” while not logged in:
  - Open login/register modal or redirect to `/login?redirect=/product/{slug}`.
  - After login success, add selected SKU to cart automatically if possible.

---

## 7.4 Cart Page `/cart`

### Goal

Cho khách hàng xem sản phẩm đã thêm, chỉnh số lượng, chọn lại hoặc xóa trước checkout.

### Desktop layout

1. Header.
2. Page title: “Giỏ hàng của bạn”.
3. Cart item list left.
4. Order summary right sticky.

### Cart item card

Includes:

- Product thumbnail.
- Product name.
- SKU details: phiên bản + màu/mùi/loại.
- Sale price.
- Original price if any.
- Quantity stepper.
- Subtotal.
- Remove button.
- Stock warning if low/out.

### Order summary

- Tạm tính.
- Phí vận chuyển: “Sẽ được xác nhận khi xử lý đơn” hoặc nếu có rule thì hiển thị.
- Tổng cộng.
- CTA: “Tiến hành thanh toán”.

### Mobile layout

- Cart items stacked.
- Summary sticky bottom or separate card after items.
- Button full width.

### Empty state

- Text: “Giỏ hàng của bạn đang trống”.
- CTA: “Khám phá sản phẩm”.
- CTA secondary: “Hỏi AI tư vấn”.

---

## 7.5 Login/Register Screen `/login`, `/register`

### Goal

Khách chỉ cần login/register khi thêm vào giỏ hàng hoặc checkout.

### Layout

- Centered auth card on warm cream background.
- Left/right visual optional on desktop.
- Tabs or separate links: Đăng nhập / Đăng ký.
- Fields:
  - Email hoặc số điện thoại.
  - Password.
  - Full name for register.
  - Phone for register.
- CTA primary.
- Link forgot password if supported later.

### UX rules

- Keep auth minimal.
- Explain why login is needed: “Đăng nhập để lưu giỏ hàng và theo dõi đơn hàng”.
- After auth, redirect to previous action.

---

## 7.6 Checkout Page `/checkout`

### Goal

Cho khách nhập thông tin nhận hàng, chọn COD hoặc QR, đặt đơn rõ ràng.

### Desktop layout

Two columns:

- Left: Checkout form.
- Right: Order summary sticky.

### Sections

#### Section 1: Thông tin người nhận

Fields:

- Họ và tên.
- Số điện thoại.
- Email optional.
- Tỉnh/thành.
- Quận/huyện.
- Phường/xã.
- Địa chỉ chi tiết.
- Ghi chú cho NaHerbs.

#### Section 2: Phương thức thanh toán

Radio cards:

1. **Thanh toán khi nhận hàng (COD)**
   - “Bạn thanh toán khi nhận sản phẩm.”

2. **Chuyển khoản QR**
   - “Quét mã QR cố định của NaHerbs. Nhân sự NaHerbs sẽ kiểm tra tài khoản ngân hàng và xác nhận thủ công.”

#### Section 3: QR instruction box

Hiển thị khi chọn QR:

- QR code image.
- Tên ngân hàng.
- Chủ tài khoản.
- Số tài khoản.
- Số tiền cần chuyển.
- Nội dung chuyển khoản đề xuất:

```text
NH-{orderCode}-{phone}
```

- Warning note:

```text
Sau khi chuyển khoản, đơn hàng sẽ ở trạng thái “Chờ xác nhận thanh toán”. NaHerbs sẽ kiểm tra giao dịch và cập nhật trạng thái thủ công.
```

#### Section 4: Review and place order

- Checkbox đồng ý chính sách.
- Button “Đặt hàng”.

### Mobile layout

- Sections stacked.
- Order summary collapsible.
- Payment method cards full width.
- QR code centered.
- CTA sticky bottom optional.

---

## 7.7 Order Success Page `/orders/{orderCode}/success`

### Goal

Xác nhận đơn đã tạo, hướng dẫn bước tiếp theo theo payment method.

### Content

- Success icon.
- Title: “Đặt hàng thành công”.
- Order code.
- Payment status.
- Order status.
- Summary products.
- Delivery info.
- CTA:
  - “Theo dõi đơn hàng”.
  - “Tiếp tục mua sắm”.
  - “Liên hệ Zalo”.

### QR-specific content

If QR:

- Nếu chưa xác nhận: badge “Chờ xác nhận thanh toán”.
- Show transfer instruction again.
- Explain manual confirmation.

### COD-specific content

If COD:

- Badge “Thanh toán khi nhận hàng”.
- Text: “NaHerbs sẽ liên hệ xác nhận đơn trước khi giao”.

---

## 7.8 My Orders Page `/account/orders`

### Goal

Cho khách đã đăng nhập xem lịch sử đơn và trạng thái.

### Layout

- Account sidebar desktop:
  - Hồ sơ.
  - Đơn hàng của tôi.
  - Đăng xuất.
- Orders list.

### Order card

- Order code.
- Date.
- Total.
- Payment method.
- Payment status.
- Order status.
- Product thumbnails.
- CTA: “Xem chi tiết”.

### Order statuses

- `PENDING_CONFIRMATION`: Chờ xác nhận.
- `CONFIRMED`: Đã xác nhận.
- `PREPARING`: Đang chuẩn bị.
- `SHIPPING`: Đang giao.
- `COMPLETED`: Hoàn tất.
- `CANCELLED`: Đã hủy.

### Payment statuses

- `UNPAID`.
- `PENDING_MANUAL_CONFIRMATION`.
- `PAID`.
- `FAILED`.
- `REFUNDED`.

---

## 7.9 Blog List Page `/blog`

### Goal

Hỗ trợ SEO, giáo dục khách hàng, dẫn về sản phẩm.

### Desktop layout

- Page hero.
- Featured article large card.
- Category chips.
- Search input.
- Blog grid 3 columns.
- Sidebar optional: popular posts, products suggestion.

### Mobile layout

- Blog cards stacked.
- Category chips horizontal scroll.
- Search full width.

---

## 7.10 Blog Detail Page `/blog/{slug}`

### Goal

Đọc nội dung dễ, SEO tốt, liên kết về sản phẩm và chatbot.

### Layout

- Breadcrumb.
- Title.
- Excerpt.
- Author/date.
- Thumbnail.
- Content body.
- Table of contents optional.
- Disclaimer box for health content.
- Related products.
- Related articles.
- CTA: “Hỏi AI tư vấn sản phẩm phù hợp”.

### Blog content styling

- Max width content: 760–820px.
- Body font: 17–18px desktop.
- Line-height: 1.7.
- H2: 28px, deep green.
- H3: 22px.
- Links: primary green.
- Quote/callout: cream/sage box.

---

## 7.11 About Page `/about`

### Goal

Xây dựng niềm tin thương hiệu.

### Sections

1. Hero: “Về NaHerbs”.
2. Brand story.
3. Mission/vision.
4. 4R values:
   - Responsibility.
   - Respectability.
   - Renovation.
   - Reliability.
5. Product philosophy.
6. CTA: “Khám phá sản phẩm”, “Liên hệ NaHerbs”.

### Visual style

- Warm cream background.
- Cards with sage/beige.
- Natural leaf/herbal pattern subtle.

---

## 7.12 Contact Page `/contact`

### Goal

Cho người dùng liên hệ tư vấn, đặt mua, hỏi quà tặng doanh nghiệp.

### Layout

Desktop two columns:

- Left: Contact form.
- Right: Contact info cards.

Fields:

- Họ tên.
- Số điện thoại.
- Email optional.
- Nhu cầu.
- Sản phẩm quan tâm optional.
- Nội dung.

Contact cards:

- Hotline.
- Zalo.
- Facebook.
- Email.
- Địa chỉ nếu có.

Mobile:

- Contact cards first or after form depending priority.
- Zalo/hotline buttons full width.

---

## 8. Admin CMS Screen Design

## 8.1 Admin Login `/admin/login`

### Layout

- Center card on warm cream background.
- Logo NaHerbs.
- Title: “Đăng nhập quản trị”.
- Fields: Email, password.
- Button: “Đăng nhập”.
- Error message under form.

### Style

- Admin card white, radius 24px.
- Use Inter only.
- No decorative excessive visuals.

---

## 8.2 Admin Layout

### Desktop

- Sidebar fixed left 260px.
- Top bar with page title/user/logout.
- Content area background `#F7F1E5`.
- Cards white.

Sidebar items:

- Dashboard.
- Sản phẩm.
- Danh mục.
- Đơn hàng.
- Thanh toán QR.
- Blog.
- Chatbot.
- Khách hàng.
- Cấu hình website.

### Mobile/tablet

- Sidebar becomes drawer.
- Top bar has hamburger.
- Tables become horizontal scroll or card list.

---

## 8.3 Admin Dashboard `/admin/dashboard`

### Widgets

- Tổng sản phẩm.
- Đơn hàng mới.
- Đơn chờ xác nhận thanh toán QR.
- Doanh thu đơn đã xác nhận.
- Lead/chatbot conversations.
- Sản phẩm sắp hết hàng.

### Layout

- 4 stat cards top.
- Recent orders table.
- QR payment pending list.
- Low stock products.

---

## 8.4 Product Management `/admin/products`

### Product list

- Header: title + button “Thêm sản phẩm”.
- Search input.
- Filters: status, category, stock.
- Table columns:
  - Image.
  - Product name.
  - Category.
  - SKU count.
  - Price range.
  - Stock summary.
  - Status.
  - Updated at.
  - Actions.

### Mobile admin

- Product rows become cards.
- Actions in kebab menu.

---

## 8.5 Product Create/Edit `/admin/products/create`, `/admin/products/{id}/edit`

### Form sections

1. Basic information.
   - Name.
   - Slug.
   - Category.
   - Status.
   - Featured toggle.
2. Descriptions.
   - Short description.
   - Detail description rich text.
   - Benefits.
   - Usage instruction.
   - Preservation instruction.
   - Safety note.
3. SEO.
   - SEO title.
   - SEO description.
   - Keyword.
4. Media.
   - Upload gallery.
   - Thumbnail selection.
5. Versions and SKUs.
   - See next section.
6. Related products.

### UX rules

- Slug auto-generate from name but editable.
- Warn if missing thumbnail.
- Warn if trying to publish without active SKU.
- Save draft and publish buttons separated.

---

## 8.6 Version/SKU Management

Because inventory is per combination of version + color/mùi/loại, admin should manage SKU clearly.

### Recommended model UI

- Product has one or more **Versions**.
- Each version has one or more **SKU variants**.

Example:

```text
Product: Gối Công Thái Học Thảo Dược
Version: Có Nhiệt
  SKU: Có Nhiệt - Màu Be
Version: Không Nhiệt
  SKU: Không Nhiệt - Màu Nâu Chùa
```

### SKU table columns

- SKU code.
- Version.
- Color.
- Scent/Type/Size.
- Original price.
- Sale price.
- Stock quantity.
- Stock status.
- Image.
- Active/Hidden.
- Actions.

### UX rules

- Sale price required for sellable SKU.
- Stock quantity required if inventory tracking enabled.
- Cannot publish SKU if price missing.
- If SKU hidden, it should not appear in public variant selector or chatbot product card.

---

## 8.7 Order Management `/admin/orders`

### Order list

Columns:

- Order code.
- Customer.
- Phone.
- Total.
- Payment method.
- Payment status.
- Order status.
- Created at.
- Actions.

Filters:

- Order status.
- Payment method.
- Payment status.
- Date range.
- Search by phone/order code.

### Order detail

Sections:

1. Order summary.
2. Customer/delivery info.
3. Items.
4. Payment info.
5. Admin notes.
6. Status timeline.

Actions:

- Confirm order.
- Confirm payment.
- Mark preparing.
- Mark shipping.
- Mark completed.
- Cancel order.

---

## 8.8 Manual QR Payment Confirmation

### Goal

Support workflow where QR is fixed and payment is manually checked by website owner/admin.

### Screen `/admin/payments/manual`

- List orders with payment method QR and status `PENDING_MANUAL_CONFIRMATION`.
- Columns:
  - Order code.
  - Customer phone.
  - Amount.
  - Transfer content suggestion.
  - Created at.
  - Payment status.
  - Action: “Xác nhận đã thanh toán”.

### Confirm modal

Fields:

- Confirmed amount.
- Bank transaction note/reference optional.
- Admin note.
- Checkbox: “Tôi đã kiểm tra giao dịch trong tài khoản ngân hàng”.

CTA:

- “Xác nhận thanh toán”.

### UX warning

Use warning note:

```text
Chỉ xác nhận sau khi đã kiểm tra giao dịch thực tế trong tài khoản ngân hàng của chủ website.
```

---

## 8.9 Blog Management

### Blog list

- Search.
- Filter status/category.
- Table columns:
  - Thumbnail.
  - Title.
  - Category.
  - Status.
  - Published at.
  - SEO status.
  - Actions.

### Blog editor

- Title.
- Slug.
- Excerpt.
- Content rich text/markdown.
- Thumbnail.
- Category/tags.
- Related products.
- SEO title.
- SEO description.
- Health disclaimer toggle.
- Draft/publish.

---

## 8.10 Chatbot Admin

### Config screen

Fields:

- Enabled toggle.
- Welcome message.
- Suggested questions list.
- Fallback message.
- Disclaimer.
- Max product recommendations.
- AI provider/model display if needed.

### Conversation screen

List:

- Time.
- Session/customer.
- Detected need.
- Recommended products.
- Lead created?
- Safety flag.

Detail:

- Chat transcript.
- Product cards recommended.
- Lead link if created.
- Admin note.

### UX rule

Admin should clearly see that chatbot uses DB products/blogs, not free-form product invention.

---

## 8.11 Site Settings

Sections:

- Brand:
  - Logo.
  - Site name.
  - Slogan.
- Contact:
  - Hotline.
  - Zalo.
  - Facebook.
  - Email.
  - Address.
- Payment QR:
  - QR image.
  - Bank name.
  - Account holder.
  - Account number.
  - Transfer content format.
- SEO default:
  - Default title.
  - Default description.
- Policies:
  - Shipping.
  - Return/exchange.
  - Privacy.
  - Payment instructions.

---

## 9. E-commerce UX Flow

## 9.1 Browse to checkout flow

```text
Home / Product listing / Chatbot
        ↓
Product detail
        ↓
Select version + color/mùi/loại SKU
        ↓
Click “Thêm vào giỏ hàng”
        ↓
If not logged in → Login/Register → Return and add item
        ↓
Cart
        ↓
Checkout
        ↓
Choose COD or QR
        ↓
Place order
        ↓
Order success
        ↓
Admin confirms order/payment manually when needed
```

## 9.2 Add to cart login behavior

- Viewing product does not require login.
- Chatbot does not require login.
- Adding to cart requires login.
- If user is not logged in:
  - Show auth modal or redirect login.
  - Preserve selected SKU and quantity.
  - After login/register, automatically continue add-to-cart.

## 9.3 QR payment UX

QR payment must be transparent:

- The QR is fixed.
- User transfers manually.
- User sees suggested transfer content.
- Payment is not automatically verified.
- Order payment status remains “Chờ xác nhận thanh toán”.
- Admin confirms after checking bank account.

Suggested text:

```text
NaHerbs sử dụng mã QR chuyển khoản cố định. Sau khi bạn chuyển khoản, nhân sự NaHerbs sẽ kiểm tra giao dịch trong tài khoản ngân hàng và xác nhận thanh toán thủ công.
```

---

## 10. Accessibility Guidelines

### 10.1 Color contrast

- Body text on cream/white must meet readable contrast.
- Do not use sage text on cream for important content if contrast is low.
- Error text should be clearly visible.

### 10.2 Keyboard navigation

- Buttons, links, inputs, variant options, cart actions must be keyboard focusable.
- Focus ring should be visible and use primary green shadow.

### 10.3 Form accessibility

- Every input has label.
- Error message associated with field.
- Required fields marked visually and semantically.
- Placeholder is not a replacement for label.

### 10.4 Image alt text

- Product images: describe product and variant.
- Blog images: describe topic.
- Decorative shapes/patterns: empty alt.

### 10.5 Chatbot accessibility

- Floating button has aria-label: “Mở chatbot tư vấn NaHerbs”.
- Chat window can be closed by keyboard.
- Message input has label.
- Loading state announced visually.

---

## 11. Microcopy Guidelines

### 11.1 Brand voice

- Thân thiện.
- Dịu nhẹ.
- Tư vấn như người bán hàng hiểu sản phẩm.
- Không hù dọa bệnh lý.
- Không cam kết quá mức.

### 11.2 Product copy

Use safe wording:

- “Hỗ trợ thư giãn”.
- “Mang lại cảm giác dễ chịu”.
- “Phù hợp chăm sóc tại nhà”.
- “Làm ấm vùng cơ thể”.
- “Gợi ý cho người thường xuyên ngồi lâu”.

Avoid:

- “Chữa khỏi”.
- “Điều trị dứt điểm”.
- “Cam kết hết đau”.
- “Thay thế thuốc/bác sĩ”.

### 11.3 Checkout copy

Clear, reassuring:

- “NaHerbs sẽ liên hệ xác nhận đơn hàng trước khi giao.”
- “Bạn có thể thanh toán khi nhận hàng.”
- “Với chuyển khoản QR, đơn hàng sẽ được xác nhận thủ công sau khi NaHerbs kiểm tra giao dịch.”

### 11.4 Error copy

Use helpful messages:

- “Vui lòng nhập số điện thoại hợp lệ.”
- “Biến thể này hiện đã hết hàng. Bạn có thể chọn phiên bản khác.”
- “Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.”
- “Chưa tìm thấy sản phẩm phù hợp. Bạn có thể hỏi AI tư vấn hoặc liên hệ NaHerbs.”

---

## 12. Loading, Empty, Error States

### 12.1 Loading states

- Product grid: skeleton cards.
- Product detail: skeleton gallery + text blocks.
- Cart: skeleton item rows.
- Checkout submit: button loading with text “Đang đặt hàng...”.
- Chatbot: typing indicator.

### 12.2 Empty states

| Screen | Empty state |
|---|---|
| Product list | “Chưa có sản phẩm phù hợp” + CTA hỏi AI |
| Cart | “Giỏ hàng của bạn đang trống” + CTA khám phá sản phẩm |
| Orders | “Bạn chưa có đơn hàng nào” + CTA mua sắm |
| Blog | “Chưa có bài viết trong danh mục này” |
| Admin orders | “Chưa có đơn hàng mới” |
| Chatbot history | “Chưa có hội thoại nào” |

### 12.3 Error states

- Use soft red, not bright red.
- Explain action user can take.
- Do not expose technical stack traces.

---

## 13. SEO and Content UI Guidelines

### 13.1 Product page SEO UI

- H1 must be product name.
- Use structured sections with H2:
  - Mô tả sản phẩm.
  - Công dụng/lợi ích.
  - Hướng dẫn sử dụng.
  - Lưu ý an toàn.
- Related products visible.
- Related blog posts visible.

### 13.2 Blog SEO UI

- H1 once.
- Use readable content width.
- Include related products in article.
- Include disclaimer for health topics.
- CTA should not interrupt too aggressively.

### 13.3 Metadata input in admin

Admin form should preview Google snippet:

```text
SEO preview
[SEO title]
[URL slug]
[SEO description]
```

---

## 14. Motion and Interaction

Motion should be subtle.

Recommended:

- Button hover: slight shadow, darken.
- Product card hover: lift 2–3px.
- Drawer slide: 180–220ms.
- Chatbot open: scale/fade or slide up.
- Accordion: smooth height transition.

Avoid:

- Fast bouncing.
- Large flashy animation.
- Infinite moving background.
- Sale-style blinking badges.

---

## 15. Iconography and Imagery

### 15.1 Icon style

- Line icons, rounded stroke.
- Stroke width 1.75–2px.
- Use green/brown.
- Avoid filled medical icons like hospital cross unless necessary.

Suggested icons:

- Leaf.
- Herbal bowl.
- Warm heat waves.
- Pillow.
- Eye rest.
- Oil drop.
- Gift.
- Chat bubble.
- Cart.
- Check circle.

### 15.2 Image direction

Product photography should:

- Use warm natural light.
- Use cream/beige backgrounds.
- Show product texture.
- Include herbs subtly.
- Avoid overly clinical white background only.
- Use consistent crop ratios.

### 15.3 Decorative patterns

Can use subtle leaf/herb line patterns in background at low opacity 4–8%.

Do not overuse.

---

## 16. Screen Inventory Summary

### Public/customer screens

| Screen | Route | Priority |
|---|---|---|
| Home | `/` | P0 |
| Product list | `/products` | P0 |
| Product detail | `/product/{slug}` | P0 |
| Cart | `/cart` | P0 |
| Login/Register | `/login`, `/register` | P0 |
| Checkout | `/checkout` | P0 |
| Order success | `/orders/{orderCode}/success` | P0 |
| My orders | `/account/orders` | P1 |
| Blog list | `/blog` | P1 |
| Blog detail | `/blog/{slug}` | P1 |
| About | `/about` | P1 |
| Contact | `/contact` | P0 |
| Chatbot widget | Global | P0 |

### Admin screens

| Screen | Route | Priority |
|---|---|---|
| Admin login | `/admin/login` | P0 |
| Dashboard | `/admin/dashboard` | P0 |
| Product list | `/admin/products` | P0 |
| Product create/edit | `/admin/products/create`, `/admin/products/{id}/edit` | P0 |
| SKU management | Product edit section | P0 |
| Category management | `/admin/categories` | P1 |
| Order list/detail | `/admin/orders` | P0 |
| Manual payment confirmation | `/admin/payments/manual` | P0 |
| Blog list/editor | `/admin/blog` | P1 |
| Chatbot config/history | `/admin/chatbot` | P1 |
| Site settings | `/admin/settings` | P1 |

---

## 17. Ready-to-use Stitch Prompts

### 17.1 Global design prompt

```text
Design a responsive herbal wellness e-commerce website for NaHerbs. The brand sells herbal pillows, heating herbal compress bags, moxa/mugwort steaming products, essential oils, herbal eye masks, and travel neck pillows. The visual style should be Organic Wellness E-commerce: warm cream background, herbal green primary color, beige and earth brown supporting colors, terracotta accent for price and promotions, rounded cards, soft shadows, natural product imagery, clean typography using Inter and optional Lora for large headings. The UI should feel natural, warm, trustworthy, relaxing, and not like a hospital or flash-sale marketplace. Use mobile-first responsive layouts.
```

### 17.2 Home prompt

```text
Create a responsive NaHerbs homepage with sticky header, logo, navigation, cart/account icons, and CTA. Include a hero section with warm cream background, deep green heading, product group image, primary CTA “Khám phá sản phẩm”, secondary CTA “Hỏi AI tư vấn”. Add benefit strip, category cards by needs, featured product grid, AI product advisor section, brand story preview, blog preview, floating chatbot button, and deep green footer. Use rounded product cards, soft natural shadows, herbal green and beige palette.
```

### 17.3 Product detail prompt

```text
Create a responsive product detail page for NaHerbs. Desktop layout: breadcrumb, left product image gallery, right product information panel with stock badge, product name, price, variant selectors for version and color/scent/type, quantity stepper, add-to-cart and buy-now buttons, AI consultation link, and Zalo contact. Below include trust notes, accordion/tabs for description, benefits, usage instruction, storage, safety disclaimer, related products, and related blog posts. Mobile layout stacks gallery and info, with sticky bottom add-to-cart bar.
```

### 17.4 Cart and checkout prompt

```text
Create responsive cart and checkout screens for NaHerbs. Cart screen shows product item cards with thumbnail, product name, selected SKU details, price, quantity stepper, subtotal, remove action, and order summary. Checkout screen has recipient information form, payment method radio cards for COD and QR bank transfer, fixed QR instruction box, suggested transfer content, warning that payment confirmation is manual, order summary, and place order button. Use warm cream background, white rounded cards, herbal green CTA, terracotta price accent, and clear mobile stacking.
```

### 17.5 Admin prompt

```text
Create a responsive admin CMS dashboard for NaHerbs. Use clean Inter typography, warm cream page background, white cards, herbal green primary actions, compact inputs and tables. Include sidebar navigation, top bar, dashboard stat cards, product management table, SKU management section, order management with manual QR payment confirmation, blog management, chatbot config, and site settings. Desktop uses fixed sidebar; tablet/mobile uses drawer navigation and card-style tables.
```

---

## 18. Implementation Notes for React + Vite

### 18.1 Suggested CSS architecture

Options:

1. Tailwind CSS with custom theme tokens.
2. CSS Modules with design tokens.
3. SCSS variables.

For speed with AI-generated UI, Tailwind + theme config is convenient.

### 18.2 Tailwind theme mapping suggestion

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#4F6F52',
        'primary-dark': '#2F4F3A',
        sage: '#A8BFA3',
        cream: '#F7F1E5',
        beige: '#E8D8BD',
        brown: '#8A6A4F',
        terracotta: '#C7774D',
        text: '#2B2B2B',
        muted: '#6F6A61',
        border: '#DDD0BC'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif']
      },
      borderRadius: {
        xl: '24px',
        lg: '16px',
        md: '12px'
      },
      boxShadow: {
        soft: '0 12px 32px rgba(47, 79, 58, 0.08)',
        card: '0 8px 24px rgba(47, 79, 58, 0.06)'
      }
    }
  }
}
```

### 18.3 Component naming suggestion

```text
components/
├── layout/
│   ├── PublicHeader.tsx
│   ├── PublicFooter.tsx
│   ├── AdminLayout.tsx
│   └── MobileDrawer.tsx
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   └── Modal.tsx
├── product/
│   ├── ProductCard.tsx
│   ├── ProductGallery.tsx
│   ├── VariantSelector.tsx
│   └── QuantityStepper.tsx
├── checkout/
│   ├── PaymentMethodCard.tsx
│   ├── OrderSummary.tsx
│   └── QrPaymentInstruction.tsx
└── chatbot/
    ├── ChatbotWidget.tsx
    ├── ChatBubble.tsx
    └── ChatProductCard.tsx
```

---

## 19. Final UI/UX Checklist

Before accepting generated UI:

- [ ] Uses herbal green + warm cream + beige/brown palette.
- [ ] Does not look like hospital/pharmacy UI.
- [ ] Does not look like Shopee/Lazada flash-sale UI.
- [ ] Header is responsive and cart/account visible.
- [ ] Product detail has clear variant selection.
- [ ] Add-to-cart requires login behavior accounted for.
- [ ] Cart and checkout are included.
- [ ] COD and QR payment are clearly separated.
- [ ] QR payment explains manual confirmation.
- [ ] Chatbot widget is global and mobile-friendly.
- [ ] Admin screens use compact, clear, table/card layouts.
- [ ] Textfield has label, focus, error, helper states.
- [ ] All screens are responsive.
- [ ] Health content has safe wording/disclaimer.
- [ ] CTA copy is Vietnamese and action-oriented.
- [ ] Empty/loading/error states are designed.
- [ ] Accessibility basics are covered.

---

## 20. Recommended MVP visual direction summary

NaHerbs should look like:

```text
A warm, trustworthy herbal wellness e-commerce website for home self-care products, with natural colors, soft rounded cards, readable typography, calm shopping experience, clear variant selection, simple checkout, manually confirmed QR payment, and an AI advisor that helps users choose real products from the catalog.
```

Most important design decisions:

- Primary color: herbal green `#4F6F52`.
- Background: warm cream `#F7F1E5`.
- Accent: terracotta `#C7774D` for price/secondary highlights.
- Font: Inter for UI, optional Lora for public heading.
- Inputs: 48px height, 14px radius, beige border, green focus glow.
- Cards: white, 24px radius, soft green-tinted shadow.
- Product variant UI: pill/card selectors, not hidden dropdowns only.
- Checkout: transparent COD/QR choice, clear manual payment confirmation note.
- Chatbot: friendly, grounded in real products, always with product cards and CTA.
