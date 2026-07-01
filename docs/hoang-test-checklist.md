# Huong dan test checklist cua Hoang

**Du an:** NaHerbs  
**Nguoi phu trach:** Hoang  
**Ngay tao:** 2026-07-01  
**Pham vi:** Cart, Checkout, Customer Orders, Admin Orders

## 1. Nguon tham chieu

- API checklist tong: `api_endpoints_checklist.md`
- API contract: `docs/openapi.yml`
- Test tu dong hien co: `naherb-api/src/test/java/vn/io/naherb/OrderFlowIntegrationTests.java`
- Huong dan chay local: `README.md`

## 2. Pham vi endpoint cua Hoang

| Module | Method | Endpoint | Muc tieu test |
|---|---:|---|---|
| Cart | GET | `/api/cart` | Lay gio hang hien tai cua customer |
| Cart | DELETE | `/api/cart` | Xoa toan bo gio hang |
| Cart | POST | `/api/cart/items` | Them SKU vao gio hang |
| Cart | PATCH | `/api/cart/items/{itemId}` | Cap nhat so luong item |
| Cart | DELETE | `/api/cart/items/{itemId}` | Xoa mot item khoi gio hang |
| Checkout | POST | `/api/checkout` | Tao don hang tu gio hang |
| Customer Orders | GET | `/api/orders/my` | Customer xem danh sach don cua minh |
| Customer Orders | GET | `/api/orders/my/{orderId}` | Customer xem chi tiet don cua minh |
| Admin Orders | GET | `/api/admin/orders` | Admin xem danh sach don hang |
| Admin Orders | GET | `/api/admin/orders/{orderId}` | Admin xem chi tiet don hang |
| Admin Orders | PATCH | `/api/admin/orders/{orderId}/status` | Admin cap nhat trang thai don |
| Admin Orders | PATCH | `/api/admin/orders/{orderId}/payment-status` | Admin cap nhat trang thai thanh toan |

## 3. Chuan bi moi truong

- [ ] Tao file `.env` tu `.env.example` neu chua co.
- [ ] Chay PostgreSQL va Redis:

```powershell
docker compose up -d
docker compose ps
```

- [ ] Chay backend:

```powershell
cd naherb-api
mvn spring-boot:run
```

- [ ] Chay frontend neu can test UI:

```powershell
cd naherb-web
npm.cmd install
npm.cmd run dev
```

- [ ] Kiem tra Swagger UI tai `http://localhost:8080/swagger-ui.html`.
- [ ] Moi request thay doi du lieu phai co CSRF:
  - Goi `GET /api/auth/csrf`
  - Gui header `X-XSRF-TOKEN` bang gia tri cookie `XSRF-TOKEN`
  - Gui kem HttpOnly cookies sau khi login

## 4. Chay test tu dong

### 4.1 Chay rieng flow cua Hoang

```powershell
cd naherb-api
mvn test -Dtest=OrderFlowIntegrationTests
```

Checklist ket qua:

- [ ] `cartCheckoutAndMyOrdersFlow` pass.
- [ ] `orderOwnershipAndAdminOrderManagement` pass.
- [ ] Khong co test bi skip.
- [ ] Khong co loi validation, security, CSRF hoac database cleanup.

### 4.2 Chay toan bo backend regression

```powershell
cd naherb-api
mvn test
```

Checklist ket qua:

- [ ] Tat ca backend tests pass.
- [ ] Khong lam hong auth, profile, address, chatbot hoac health tests.
- [ ] Neu fail do dependency local, ghi ro dependency nao fail va log loi.

## 5. Test data toi thieu

Can co:

- [ ] 1 customer account da login.
- [ ] 1 admin account da login.
- [ ] It nhat 1 product published/active.
- [ ] It nhat 1 SKU co `stockQuantity > 0`.
- [ ] 1 dia chi giao hang hop le voi cac truong:
  - `receiverName`
  - `receiverPhone`
  - `provinceCity`
  - `wardCommune`
  - `addressDetail`

Luu y contract dia chi:

- [ ] Khong dung field `district`.
- [ ] Dia chi don hang la snapshot, sau checkout khong duoc bi thay doi nguoc khi customer sua address profile.

## 6. Checklist Cart

### GET `/api/cart`

- [ ] Customer chua co item van tra `200 OK`.
- [ ] Response co `data.items` la array.
- [ ] Gio hang rong co `items = []` va `subtotal = 0` hoac gia tri tuong duong.
- [ ] Request chua login bi chan theo cau hinh security.

### POST `/api/cart/items`

Body mau:

```json
{
  "skuId": "UUID_CUA_SKU",
  "quantity": 2
}
```

Checklist:

- [ ] Them SKU hop le tra `200 OK`.
- [ ] Response co item moi voi dung `skuId`, `productName`, `productSlug`, `skuName`.
- [ ] `quantity` bang so luong da gui.
- [ ] `lineTotal = unitPrice * quantity`.
- [ ] `subtotal` bang tong cac `lineTotal`.
- [ ] Them cung SKU lan nua thi tang/cap nhat so luong dung logic hien tai.
- [ ] `quantity < 1` bi reject.
- [ ] `skuId` khong ton tai bi reject.
- [ ] SKU het hang hoac vuot ton kho bi reject hoac tra loi loi phu hop.

### PATCH `/api/cart/items/{itemId}`

Body mau:

```json
{
  "quantity": 3
}
```

Checklist:

- [ ] Cap nhat item hop le tra `200 OK`.
- [ ] Response tra quantity moi.
- [ ] `lineTotal` va `subtotal` duoc tinh lai.
- [ ] `quantity < 1` bi reject.
- [ ] `itemId` khong thuoc customer hien tai khong duoc cap nhat.
- [ ] `itemId` khong ton tai tra loi loi phu hop.

### DELETE `/api/cart/items/{itemId}`

- [ ] Xoa item hop le tra `200 OK`.
- [ ] Item da xoa khong con trong `data.items`.
- [ ] `subtotal` duoc tinh lai.
- [ ] Xoa item khong thuoc customer hien tai bi chan.

### DELETE `/api/cart`

- [ ] Xoa gio hang tra `200 OK`.
- [ ] Goi lai `GET /api/cart` thay `items = []`.
- [ ] Xoa gio hang rong van khong gay loi server.

## 7. Checklist Checkout

### POST `/api/checkout`

Body BANK_QR mau:

```json
{
  "paymentMethod": "BANK_QR",
  "saveAddress": true,
  "note": "Call before delivery",
  "shippingAddress": {
    "receiverName": "Customer",
    "receiverPhone": "0901234567",
    "email": "ship@naherb.vn",
    "provinceCity": "Ho Chi Minh",
    "wardCommune": "Ben Nghe",
    "addressDetail": "123 Nguyen Hue"
  }
}
```

Body COD mau:

```json
{
  "paymentMethod": "COD",
  "shippingAddress": {
    "receiverName": "Customer",
    "receiverPhone": "0901234567",
    "provinceCity": "Da Nang",
    "wardCommune": "Hai Chau",
    "addressDetail": "1 Tran Phu"
  }
}
```

Checklist happy path:

- [ ] Gio hang co it nhat 1 item truoc khi checkout.
- [ ] Checkout BANK_QR tra `201 Created`.
- [ ] BANK_QR tao `orderStatus = PENDING_CONFIRMATION`.
- [ ] BANK_QR tao `paymentStatus = WAITING_BANK_TRANSFER`.
- [ ] BANK_QR co `qrInstruction.transferContent`.
- [ ] Checkout COD tra `201 Created`.
- [ ] COD tao `paymentStatus = COD_PENDING`.
- [ ] Response co `orderId`, `orderCode`, `totalAmount`.
- [ ] Sau checkout, gio hang duoc clear.
- [ ] Ton kho SKU bi tru dung so luong da mua.
- [ ] Note duoc luu vao order detail.
- [ ] Shipping address duoc luu thanh snapshot trong order detail.

Checklist validation va loi:

- [ ] Checkout gio hang rong bi reject.
- [ ] Thieu `paymentMethod` bi reject.
- [ ] `paymentMethod` ngoai `COD`, `BANK_QR` bi reject.
- [ ] Thieu shipping address va khong co `shippingAddressId` bi reject.
- [ ] Dia chi thieu truong bat buoc bi reject.
- [ ] Vuot ton kho bi reject va khong tao order.
- [ ] Khi checkout fail, gio hang va ton kho khong bi thay doi.

## 8. Checklist Customer Orders

### GET `/api/orders/my`

- [ ] Customer da checkout thay don moi trong danh sach.
- [ ] Response co `items`, `page`, `size`, `totalItems`, `totalPages`.
- [ ] Moi item co `id`, `orderCode`, `orderStatus`, `paymentMethod`, `paymentStatus`, `totalAmount`, `createdAt`.
- [ ] Pagination `page` va `size` hoat dong.
- [ ] Customer A khong thay don cua Customer B.

### GET `/api/orders/my/{orderId}`

- [ ] Chu don xem chi tiet tra `200 OK`.
- [ ] Response co `items` voi product snapshot dung luc checkout.
- [ ] Response co `shippingAddress` snapshot.
- [ ] Response co `note` neu checkout co note.
- [ ] Customer khac xem don khong thuoc minh bi chan, ky vong `404 Not Found` theo test hien co.
- [ ] `orderId` khong ton tai tra loi loi phu hop.

## 9. Checklist Admin Orders

### GET `/api/admin/orders`

- [ ] Customer thuong goi endpoint admin bi `403 Forbidden`.
- [ ] Admin goi thanh cong tra `200 OK`.
- [ ] Response co `items`, `page`, `size`, `totalItems`, `totalPages`.
- [ ] Filter `paymentStatus=COD_PENDING` tra dung don COD pending.
- [ ] Filter `orderStatus`, `paymentMethod`, `keyword` hoat dong dung contract.
- [ ] Pagination `page` va `size` hoat dong.

### GET `/api/admin/orders/{orderId}`

- [ ] Admin xem chi tiet don tra `200 OK`.
- [ ] Response co item snapshot, shipping address, order status, payment status.
- [ ] Customer thuong bi chan.
- [ ] `orderId` khong ton tai tra loi loi phu hop.

### PATCH `/api/admin/orders/{orderId}/status`

Body mau:

```json
{
  "orderStatus": "CONFIRMED",
  "note": "Confirmed by admin"
}
```

Checklist:

- [ ] Admin cap nhat status hop le tra `200 OK`.
- [ ] Goi lai detail thay `orderStatus` moi.
- [ ] Customer thuong bi `403 Forbidden`.
- [ ] Status ngoai enum bi reject.
- [ ] `orderId` khong ton tai tra loi loi phu hop.

Enum hop le:

- `PENDING_CONFIRMATION`
- `CONFIRMED`
- `PACKING`
- `SHIPPING`
- `COMPLETED`
- `CANCELLED`

### PATCH `/api/admin/orders/{orderId}/payment-status`

Body mau:

```json
{
  "paymentStatus": "PAID",
  "note": "Paid"
}
```

Checklist:

- [ ] Admin cap nhat payment status hop le tra `200 OK`.
- [ ] Goi lai detail thay `paymentStatus` moi.
- [ ] Customer thuong bi `403 Forbidden`.
- [ ] Payment status ngoai enum bi reject.
- [ ] `orderId` khong ton tai tra loi loi phu hop.

Enum hop le:

- `UNPAID`
- `COD_PENDING`
- `WAITING_BANK_TRANSFER`
- `PAID`
- `FAILED`
- `REFUNDED`

## 10. Checklist UI smoke test neu co frontend

Customer flow:

- [ ] Login customer thanh cong.
- [ ] Them san pham vao gio hang.
- [ ] Tang/giam so luong trong gio hang.
- [ ] Xoa item khoi gio hang.
- [ ] Checkout COD thanh cong.
- [ ] Checkout BANK_QR hien huong dan chuyen khoan/QR neu du lieu cau hinh co san.
- [ ] Trang tai khoan hien danh sach don cua customer.
- [ ] Customer xem duoc chi tiet don cua minh.
- [ ] Customer khong truy cap duoc trang admin orders.

Admin flow:

- [ ] Login admin thanh cong.
- [ ] Vao danh sach don hang.
- [ ] Loc theo order status/payment status/payment method.
- [ ] Mo chi tiet don hang.
- [ ] Cap nhat order status.
- [ ] Cap nhat payment status.
- [ ] UI hien loi ro rang khi request fail.

## 11. Tieu chi pass

- [ ] Tat ca endpoint trong pham vi Hoang da duoc test happy path.
- [ ] Da test it nhat 1 validation/error path cho moi module.
- [ ] Da test ownership: customer khong xem/sua duoc du lieu cua customer khac.
- [ ] Da test authorization: customer khong goi duoc admin endpoints.
- [ ] Da test CSRF cho request POST, PATCH, DELETE.
- [ ] `mvn test -Dtest=OrderFlowIntegrationTests` pass.
- [ ] Neu sua code backend, `mvn test` pass truoc khi merge.
- [ ] Bug neu co da ghi kem endpoint, request body, response, account role va log lien quan.

## 12. Mau ghi bug nhanh

```md
### Bug: [Module] - [Mo ta ngan]

- Endpoint:
- Role: Customer/Admin/Anonymous
- Steps:
- Request body:
- Expected:
- Actual:
- Status code:
- Response body:
- Anh/log lien quan:
- Muc do uu tien: P0/P1/P2/P3
```
