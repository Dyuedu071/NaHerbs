-- Seed sản phẩm NaHerbs từ file Excel: Thông tin Website.xlsx
-- Mapping chính: GIÁ GẠCH -> original_price; GIÁ BÁN -> sale_price; KHO -> stock_quantity.
-- Ghi chú: Các dòng biến thể thiếu giá/kho được kế thừa giá/kho từ dòng sản phẩm/biến thể trước đó trong cùng sản phẩm.
-- Ghi chú: product_images/media_assets được insert bằng URL ảnh tạm do người dùng cung cấp.
BEGIN;

SET search_path TO naherb, public;

-- 1) Đảm bảo danh mục sản phẩm tồn tại
INSERT INTO naherb.product_categories (name, slug, description, display_order, status)
VALUES
  ('Gối & cổ vai gáy', 'goi-co-vai-gay', 'Gối và sản phẩm hỗ trợ thư giãn vùng cổ vai gáy.', 1, 'PUBLISHED'),
  ('Túi/gối chườm thảo dược', 'tui-goi-chuom-thao-duoc', 'Sản phẩm chườm nóng/thảo dược cho lưng, bụng, vai gáy.', 2, 'PUBLISHED'),
  ('Xông ngải cứu', 'xong-ngai-cuu', 'Cốc xông, bộ xông và điếu ngải cứu.', 3, 'PUBLISHED'),
  ('Tinh dầu thiên nhiên', 'tinh-dau-thien-nhien', 'Tinh dầu thảo dược cho không gian thư giãn.', 4, 'PUBLISHED'),
  ('Phụ kiện thư giãn/du lịch', 'phu-kien-thu-gian-du-lich', 'Gối chữ U, bịt mắt và sản phẩm tiện mang theo.', 5, 'PUBLISHED')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  updated_at = now();

-- 2) Insert/Update products
WITH product_rows(name, slug, category_slug, short_description, detail_description, seo_title, seo_description, primary_keyword, display_order) AS (
  VALUES
  ('GỐI CÔNG THÁI HỌC THẢO DƯỢC ( CÓ NHIỆT ) VÀ LOẠI KHÔNG CÓ NHIỆT', 'goi-cong-thai-hoc-thao-duoc-co-nhiet-va-loai-khong-co-nhiet', 'goi-co-vai-gay', 'Gối Công Thái Học Thảo Dược NaHerbs được thiết kế theo cấu trúc công thái học giúp nâng đỡ vùng cổ và vai gáy, kết hợp 100% thảo dược thiên nhiên mang đến cảm giác thư giãn và dễ chịu trong quá trình sử dụng. Sản phẩm có 02 phiên bản: Có Nhiệt với 3 mức điều chỉnh nhiệt tiện lợi và Không Có Nhiệt có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo. Lõi thảo dược có thể tháo rời để vệ sinh và thay thế, phù hợp cho nhân viên văn phòng, người làm việc với máy tính nhiều giờ và những ai thường xuyên đau mỏi cổ vai gáy.', 'Gối Công Thái Học Thảo Dược NaHerbs được thiết kế theo cấu trúc công thái học giúp nâng đỡ vùng cổ và vai gáy, kết hợp 100% thảo dược thiên nhiên mang đến cảm giác thư giãn và dễ chịu trong quá trình sử dụng. Sản phẩm có 02 phiên bản: Có Nhiệt với 3 mức điều chỉnh nhiệt tiện lợi và Không Có Nhiệt có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo. Lõi thảo dược có thể tháo rời để vệ sinh và thay thế, phù hợp cho nhân viên văn phòng, người làm việc với máy tính nhiều giờ và những ai thường xuyên đau mỏi cổ vai gáy.', 'GỐI CÔNG THÁI HỌC THẢO DƯỢC ( CÓ NHIỆT ) VÀ LOẠI KHÔNG CÓ NHIỆT', 'Gối Công Thái Học Thảo Dược NaHerbs được thiết kế theo cấu trúc công thái học giúp nâng đỡ vùng cổ và vai gáy, kết hợp 100% thảo dược thiên nhiên mang đến cảm giác thư giãn và dễ chịu trong quá trình sử dụng. Sản phẩm có 02 phiên bản: Có Nhiệt với 3 mức điều chỉnh nhiệt tiện lợi và Không Có Nhiệt có', 'GỐI CÔNG THÁI HỌC THẢO DƯỢC ( CÓ NHIỆT ) VÀ LOẠI KHÔNG CÓ NHIỆT', 1),
  ('Túi Chườm Đa Năng Thảo Dược NaHerbs – Có Nhiệt & Không Nhiệt', 'tui-chuom-da-nang-thao-duoc-naherbs-co-nhiet-khong-nhiet', 'tui-goi-chuom-thao-duoc', 'Túi Chườm Đa Năng Thảo Dược NaHerbs Size Bé là giải pháp chăm sóc sức khỏe tiện lợi, phù hợp để chườm vùng cổ, vai, gáy, lưng, bụng, tay hoặc chân. Sản phẩm sử dụng 100% thảo dược thiên nhiên, mang lại hương thơm dịu nhẹ và cảm giác thư giãn khi sử dụng. NaHerbs cung cấp 02 phiên bản: Có Nhiệt với 3 mức điều chỉnh nhiệt linh hoạt và Không Có Nhiệt có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo. Thiết kế nhỏ gọn, lõi thảo dược tháo rời giúp dễ dàng vệ sinh và thay thế, phù hợp sử dụng tại nhà, văn phòng hoặc mang theo khi di chuyển.', 'Túi Chườm Đa Năng Thảo Dược NaHerbs Size Bé là giải pháp chăm sóc sức khỏe tiện lợi, phù hợp để chườm vùng cổ, vai, gáy, lưng, bụng, tay hoặc chân. Sản phẩm sử dụng 100% thảo dược thiên nhiên, mang lại hương thơm dịu nhẹ và cảm giác thư giãn khi sử dụng. NaHerbs cung cấp 02 phiên bản: Có Nhiệt với 3 mức điều chỉnh nhiệt linh hoạt và Không Có Nhiệt có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo. Thiết kế nhỏ gọn, lõi thảo dược tháo rời giúp dễ dàng vệ sinh và thay thế, phù hợp sử dụng tại nhà, văn phòng hoặc mang theo khi di chuyển.', 'Túi Chườm Đa Năng Thảo Dược NaHerbs – Có Nhiệt & Không Nhiệt', 'Túi Chườm Đa Năng Thảo Dược NaHerbs Size Bé là giải pháp chăm sóc sức khỏe tiện lợi, phù hợp để chườm vùng cổ, vai, gáy, lưng, bụng, tay hoặc chân. Sản phẩm sử dụng 100% thảo dược thiên nhiên, mang lại hương thơm dịu nhẹ và cảm giác thư giãn khi sử dụng. NaHerbs cung cấp 02 phiên bản: Có Nhiệt với 3', 'Túi Chườm Đa Năng Thảo Dược NaHerbs', 2),
  ('Gối chườm đa năng thảo dược size to có bông', 'goi-chuom-da-nang-thao-duoc-size-to-co-bong', 'tui-goi-chuom-thao-duoc', 'Gối Chườm Đa Năng Thảo Dược NaHerbs Size Lớn được thiết kế với kích thước lớn, kết hợp 40% lõi thảo dược thiên nhiên và 60% bông mềm mại, mang lại cảm giác êm ái và ôm sát cơ thể khi sử dụng. Sản phẩm phù hợp để chườm vùng lưng, bụng, vai, gáy hoặc làm gối tựa thư giãn hằng ngày. Lõi thảo dược có thể tháo rời để vệ sinh và thay thế dễ dàng. Người dùng có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo để giúp thảo dược lan tỏa hương thơm và mang lại cảm giác thư giãn, thoải mái sau một ngày làm việc.', 'Gối Chườm Đa Năng Thảo Dược NaHerbs Size Lớn được thiết kế với kích thước lớn, kết hợp 40% lõi thảo dược thiên nhiên và 60% bông mềm mại, mang lại cảm giác êm ái và ôm sát cơ thể khi sử dụng. Sản phẩm phù hợp để chườm vùng lưng, bụng, vai, gáy hoặc làm gối tựa thư giãn hằng ngày. Lõi thảo dược có thể tháo rời để vệ sinh và thay thế dễ dàng. Người dùng có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo để giúp thảo dược lan tỏa hương thơm và mang lại cảm giác thư giãn, thoải mái sau một ngày làm việc.', 'Gối chườm đa năng thảo dược size to có bông', 'Gối Chườm Đa Năng Thảo Dược NaHerbs Size Lớn được thiết kế với kích thước lớn, kết hợp 40% lõi thảo dược thiên nhiên và 60% bông mềm mại, mang lại cảm giác êm ái và ôm sát cơ thể khi sử dụng. Sản phẩm phù hợp để chườm vùng lưng, bụng, vai, gáy hoặc làm gối tựa thư giãn hằng ngày. Lõi thảo dược có th', 'Gối chườm đa năng thảo dược size to có bông', 3),
  ('Cốc Xông Hơi Ngải Cứu NaHerbs – Bộ Cốc Cứu Ngải Chăm Sóc Sức Khỏe Tại Nhà', 'coc-xong-hoi-ngai-cuu-naherbs-bo-coc-cuu-ngai-cham-soc-suc-khoe-tai-nha', 'xong-ngai-cuu', 'Cốc Xông Hơi Ngải Cứu NaHerbs là dụng cụ hỗ trợ xông ngải theo phương pháp Đông y, được thiết kế nhỏ gọn và tiện lợi để sử dụng tại nhà. Khi kết hợp với điếu ngải cứu NaHerbs, sản phẩm tạo nguồn nhiệt ổn định cùng hương thơm thảo dược tự nhiên, mang lại cảm giác thư giãn và dễ chịu. Cốc được làm từ gốm sứ chịu nhiệt, đi kèm vỏ bọc chống nóng và chặn tàn Inox, giúp sử dụng an toàn và thuận tiện trong quá trình chăm sóc sức khỏe hằng ngày.', 'Cốc Xông Hơi Ngải Cứu NaHerbs là dụng cụ hỗ trợ xông ngải theo phương pháp Đông y, được thiết kế nhỏ gọn và tiện lợi để sử dụng tại nhà. Khi kết hợp với điếu ngải cứu NaHerbs, sản phẩm tạo nguồn nhiệt ổn định cùng hương thơm thảo dược tự nhiên, mang lại cảm giác thư giãn và dễ chịu. Cốc được làm từ gốm sứ chịu nhiệt, đi kèm vỏ bọc chống nóng và chặn tàn Inox, giúp sử dụng an toàn và thuận tiện trong quá trình chăm sóc sức khỏe hằng ngày.', 'Cốc Xông Hơi Ngải Cứu NaHerbs – Bộ Cốc Cứu Ngải Chăm Sóc Sức Khỏe Tại Nhà', 'Cốc Xông Hơi Ngải Cứu NaHerbs là dụng cụ hỗ trợ xông ngải theo phương pháp Đông y, được thiết kế nhỏ gọn và tiện lợi để sử dụng tại nhà. Khi kết hợp với điếu ngải cứu NaHerbs, sản phẩm tạo nguồn nhiệt ổn định cùng hương thơm thảo dược tự nhiên, mang lại cảm giác thư giãn và dễ chịu. Cốc được làm từ ', 'Cốc Xông Hơi Ngải Cứu NaHerbs', 4),
  ('Bộ Xông Ngải Cứu Cầm Tay Tiện Lợi - Chăm Sóc Sức Khỏe Tại Nhà', 'bo-xong-ngai-cuu-cam-tay-tien-loi-cham-soc-suc-khoe-tai-nha', 'xong-ngai-cuu', 'Bộ Xông Ngải Cứu Cầm Tay NaHerbs được thiết kế với tay cầm dài tiện lợi, giúp dễ dàng thao tác và chăm sóc nhiều vùng trên cơ thể như cổ, vai, gáy, lưng và chân. Sản phẩm sử dụng kết hợp với điếu ngải cứu thảo dược NaHerbs, tạo nguồn nhiệt cùng hương thơm tự nhiên từ ngải cứu, mang lại cảm giác thư giãn và dễ chịu. Thiết kế nhỏ gọn, an toàn và linh hoạt, phù hợp sử dụng tại nhà, spa hoặc các cơ sở chăm sóc sức khỏe theo phương pháp Đông y.', 'Bộ Xông Ngải Cứu Cầm Tay NaHerbs được thiết kế với tay cầm dài tiện lợi, giúp dễ dàng thao tác và chăm sóc nhiều vùng trên cơ thể như cổ, vai, gáy, lưng và chân. Sản phẩm sử dụng kết hợp với điếu ngải cứu thảo dược NaHerbs, tạo nguồn nhiệt cùng hương thơm tự nhiên từ ngải cứu, mang lại cảm giác thư giãn và dễ chịu. Thiết kế nhỏ gọn, an toàn và linh hoạt, phù hợp sử dụng tại nhà, spa hoặc các cơ sở chăm sóc sức khỏe theo phương pháp Đông y.', 'Bộ Xông Ngải Cứu Cầm Tay Tiện Lợi - Chăm Sóc Sức Khỏe Tại Nhà', 'Bộ Xông Ngải Cứu Cầm Tay NaHerbs được thiết kế với tay cầm dài tiện lợi, giúp dễ dàng thao tác và chăm sóc nhiều vùng trên cơ thể như cổ, vai, gáy, lưng và chân. Sản phẩm sử dụng kết hợp với điếu ngải cứu thảo dược NaHerbs, tạo nguồn nhiệt cùng hương thơm tự nhiên từ ngải cứu, mang lại cảm giác thư ', 'Bộ Xông Ngải Cứu Cầm Tay Tiện Lợi', 5),
  ('Bịt Mắt Thảo Dược NaHerbs – Chườm Mắt Thảo Dược Thư Giãn & Chăm Sóc Giấc Ngủ', 'bit-mat-thao-duoc-naherbs-chuom-mat-thao-duoc-thu-gian-cham-soc-giac-ngu', 'phu-kien-thu-gian-du-lich', 'Bịt Mắt Thảo Dược NaHerbs được thiết kế với 100% lõi thảo dược thiên nhiên, mang đến hương thơm dịu nhẹ giúp thư giãn vùng mắt và tạo cảm giác dễ chịu sau thời gian làm việc, học tập hoặc sử dụng thiết bị điện tử. Sản phẩm có thể chườm nóng hoặc chườm lạnh tùy nhu cầu, phù hợp sử dụng trước khi ngủ, nghỉ trưa hoặc khi di chuyển. Thiết kế dây đeo co giãn cùng lõi thảo dược tháo rời giúp dễ dàng vệ sinh, thay thế và mang lại trải nghiệm sử dụng thoải mái mỗi ngày.', 'Bịt Mắt Thảo Dược NaHerbs được thiết kế với 100% lõi thảo dược thiên nhiên, mang đến hương thơm dịu nhẹ giúp thư giãn vùng mắt và tạo cảm giác dễ chịu sau thời gian làm việc, học tập hoặc sử dụng thiết bị điện tử. Sản phẩm có thể chườm nóng hoặc chườm lạnh tùy nhu cầu, phù hợp sử dụng trước khi ngủ, nghỉ trưa hoặc khi di chuyển. Thiết kế dây đeo co giãn cùng lõi thảo dược tháo rời giúp dễ dàng vệ sinh, thay thế và mang lại trải nghiệm sử dụng thoải mái mỗi ngày.', 'Bịt Mắt Thảo Dược NaHerbs – Chườm Mắt Thảo Dược Thư Giãn & Chăm Sóc Giấc Ngủ', 'Bịt Mắt Thảo Dược NaHerbs được thiết kế với 100% lõi thảo dược thiên nhiên, mang đến hương thơm dịu nhẹ giúp thư giãn vùng mắt và tạo cảm giác dễ chịu sau thời gian làm việc, học tập hoặc sử dụng thiết bị điện tử. Sản phẩm có thể chườm nóng hoặc chườm lạnh tùy nhu cầu, phù hợp sử dụng trước khi ngủ,', 'Bịt Mắt Thảo Dược NaHerbs', 6),
  ('Điếu Ngải Cứu NaHerbs – Thảo Dược Hỗ Trợ Chăm Sóc Sức Khỏe', 'dieu-ngai-cuu-naherbs-thao-duoc-ho-tro-cham-soc-suc-khoe', 'xong-ngai-cuu', 'Điếu Ngải Cứu NaHerbs được làm từ 100% lá ngải cứu thiên nhiên phơi khô và xay bột nén chặt theo phương pháp truyền thống, phù hợp sử dụng trong các liệu pháp chăm sóc sức khỏe theo Đông y. Khi kết hợp với Cốc Xông Hơi Ngải Cứu hoặc Bộ Xông Ngải Cứu Cầm Tay NaHerbs, điếu ngải tạo nguồn nhiệt ổn định cùng hương thơm tự nhiên, mang lại cảm giác thư giãn và làm ấm cơ thể. Thiết kế cháy đều, ít tàn, dễ sử dụng, phù hợp cho nhu cầu chăm sóc sức khỏe tại nhà hoặc tại các spa và cơ sở trị liệu.', 'Điếu Ngải Cứu NaHerbs được làm từ 100% lá ngải cứu thiên nhiên phơi khô và xay bột nén chặt theo phương pháp truyền thống, phù hợp sử dụng trong các liệu pháp chăm sóc sức khỏe theo Đông y. Khi kết hợp với Cốc Xông Hơi Ngải Cứu hoặc Bộ Xông Ngải Cứu Cầm Tay NaHerbs, điếu ngải tạo nguồn nhiệt ổn định cùng hương thơm tự nhiên, mang lại cảm giác thư giãn và làm ấm cơ thể. Thiết kế cháy đều, ít tàn, dễ sử dụng, phù hợp cho nhu cầu chăm sóc sức khỏe tại nhà hoặc tại các spa và cơ sở trị liệu.', 'Điếu Ngải Cứu NaHerbs – Thảo Dược Hỗ Trợ Chăm Sóc Sức Khỏe', 'Điếu Ngải Cứu NaHerbs được làm từ 100% lá ngải cứu thiên nhiên phơi khô và xay bột nén chặt theo phương pháp truyền thống, phù hợp sử dụng trong các liệu pháp chăm sóc sức khỏe theo Đông y. Khi kết hợp với Cốc Xông Hơi Ngải Cứu hoặc Bộ Xông Ngải Cứu Cầm Tay NaHerbs, điếu ngải tạo nguồn nhiệt ổn định', 'Điếu Ngải Cứu NaHerbs', 7),
  ('Áo Choàng Chữ U Thảo Dược NaHerbs 100% thảo dược từ thiên nhiên', 'ao-choang-chu-u-thao-duoc-naherbs-100-thao-duoc-tu-thien-nhien', 'phu-kien-thu-gian-du-lich', 'Áo Choàng Chữ U Thảo Dược NaHerbs được làm từ 100% thảo dược thiên nhiên, thiết kế ôm sát vùng cổ, vai và gáy giúp mang lại cảm giác ấm áp và thư giãn trong quá trình sử dụng. Sản phẩm có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo, giúp hương thơm thảo dược lan tỏa tốt hơn và tăng cảm giác dễ chịu. Với kích thước 37 × 52 cm, chất liệu mềm mại cùng hai màu Be và Nâu thanh lịch, đây là lựa chọn phù hợp cho người thường xuyên đau mỏi cổ vai gáy, nhân viên văn phòng và người lớn tuổi muốn chăm sóc sức khỏe tại nhà.', 'Áo Choàng Chữ U Thảo Dược NaHerbs được làm từ 100% thảo dược thiên nhiên, thiết kế ôm sát vùng cổ, vai và gáy giúp mang lại cảm giác ấm áp và thư giãn trong quá trình sử dụng. Sản phẩm có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo, giúp hương thơm thảo dược lan tỏa tốt hơn và tăng cảm giác dễ chịu. Với kích thước 37 × 52 cm, chất liệu mềm mại cùng hai màu Be và Nâu thanh lịch, đây là lựa chọn phù hợp cho người thường xuyên đau mỏi cổ vai gáy, nhân viên văn phòng và người lớn tuổi muốn chăm sóc sức khỏe tại nhà.', 'Áo Choàng Chữ U Thảo Dược NaHerbs 100% thảo dược từ thiên nhiên', 'Áo Choàng Chữ U Thảo Dược NaHerbs được làm từ 100% thảo dược thiên nhiên, thiết kế ôm sát vùng cổ, vai và gáy giúp mang lại cảm giác ấm áp và thư giãn trong quá trình sử dụng. Sản phẩm có thể làm nóng bằng lò vi sóng, nồi cơm hoặc chảo, giúp hương thơm thảo dược lan tỏa tốt hơn và tăng cảm giác dễ c', 'Áo Choàng Chữ U Thảo Dược NaHerbs 100% thảo dược từ thiên nhiên', 8),
  ('Gối Chữ U Thảo Dược NaHerbs – Gối Kê Cổ Du Lịch Thảo Dược 100% Thiên Nhiên', 'goi-chu-u-thao-duoc-naherbs-goi-ke-co-du-lich-thao-duoc-100-thien-nhien', 'phu-kien-thu-gian-du-lich', 'Gối Chữ U Thảo Dược NaHerbs được thiết kế theo dáng chữ U ôm sát vùng cổ, giúp nâng đỡ cổ và vai khi làm việc, nghỉ ngơi hoặc di chuyển. Bên trong là 100% thảo dược thiên nhiên kết hợp cùng lớp bông mềm mại, mang đến hương thơm dịu nhẹ và cảm giác thư giãn trong suốt quá trình sử dụng. Thiết kế dây cài cố định giúp gối không bị xê dịch, lõi thảo dược có thể tháo rời để vệ sinh và thay thế dễ dàng. Sản phẩm là lựa chọn lý tưởng cho nhân viên văn phòng, người thường xuyên đi công tác, du lịch hoặc cần nghỉ ngơi trong thời gian dài.', 'Gối Chữ U Thảo Dược NaHerbs được thiết kế theo dáng chữ U ôm sát vùng cổ, giúp nâng đỡ cổ và vai khi làm việc, nghỉ ngơi hoặc di chuyển. Bên trong là 100% thảo dược thiên nhiên kết hợp cùng lớp bông mềm mại, mang đến hương thơm dịu nhẹ và cảm giác thư giãn trong suốt quá trình sử dụng. Thiết kế dây cài cố định giúp gối không bị xê dịch, lõi thảo dược có thể tháo rời để vệ sinh và thay thế dễ dàng. Sản phẩm là lựa chọn lý tưởng cho nhân viên văn phòng, người thường xuyên đi công tác, du lịch hoặc cần nghỉ ngơi trong thời gian dài.', 'Gối Chữ U Thảo Dược NaHerbs – Gối Kê Cổ Du Lịch Thảo Dược 100% Thiên Nhiên', 'Gối Chữ U Thảo Dược NaHerbs được thiết kế theo dáng chữ U ôm sát vùng cổ, giúp nâng đỡ cổ và vai khi làm việc, nghỉ ngơi hoặc di chuyển. Bên trong là 100% thảo dược thiên nhiên kết hợp cùng lớp bông mềm mại, mang đến hương thơm dịu nhẹ và cảm giác thư giãn trong suốt quá trình sử dụng. Thiết kế dây ', 'Gối Chữ U Thảo Dược NaHerbs', 9),
  ('Tinh Dầu Thảo Dược NaHerbs – Tinh Dầu Thiên Nhiên Quế Hồi & Chanh Sả', 'tinh-dau-thao-duoc-naherbs-tinh-dau-thien-nhien-que-hoi-chanh-sa', 'tinh-dau-thien-nhien', 'Tinh Dầu Thảo Dược NaHerbs được chiết xuất từ các thành phần thiên nhiên với 02 mùi hương: Quế Hồi và Chanh Sả, mang đến không gian sống trong lành và cảm giác thư giãn mỗi ngày. Hương Quế Hồi ấm áp, dễ chịu, phù hợp cho những phút nghỉ ngơi, trong khi Chanh Sả mang đến sự tươi mát, giúp không gian thêm sảng khoái. Sản phẩm có thể sử dụng với máy khuếch tán, đèn xông tinh dầu hoặc nhỏ lên gối, khăn và túi thơm, phù hợp cho gia đình, văn phòng, spa và nhiều không gian khác.', 'Tinh Dầu Thảo Dược NaHerbs được chiết xuất từ các thành phần thiên nhiên với 02 mùi hương: Quế Hồi và Chanh Sả, mang đến không gian sống trong lành và cảm giác thư giãn mỗi ngày. Hương Quế Hồi ấm áp, dễ chịu, phù hợp cho những phút nghỉ ngơi, trong khi Chanh Sả mang đến sự tươi mát, giúp không gian thêm sảng khoái. Sản phẩm có thể sử dụng với máy khuếch tán, đèn xông tinh dầu hoặc nhỏ lên gối, khăn và túi thơm, phù hợp cho gia đình, văn phòng, spa và nhiều không gian khác.', 'Tinh Dầu Thảo Dược NaHerbs – Tinh Dầu Thiên Nhiên Quế Hồi & Chanh Sả', 'Tinh Dầu Thảo Dược NaHerbs được chiết xuất từ các thành phần thiên nhiên với 02 mùi hương: Quế Hồi và Chanh Sả, mang đến không gian sống trong lành và cảm giác thư giãn mỗi ngày. Hương Quế Hồi ấm áp, dễ chịu, phù hợp cho những phút nghỉ ngơi, trong khi Chanh Sả mang đến sự tươi mát, giúp không gian ', 'Tinh Dầu Thảo Dược NaHerbs', 10)
)
INSERT INTO naherb.products (category_id, name, slug, short_description, detail_description, seo_title, seo_description, primary_keyword, status, is_featured, display_order, created_at, updated_at)
SELECT c.id, r.name, r.slug, r.short_description, r.detail_description, r.seo_title, r.seo_description, r.primary_keyword, 'PUBLISHED', false, r.display_order, now(), now()
FROM product_rows r
JOIN naherb.product_categories c ON c.slug = r.category_slug
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  detail_description = EXCLUDED.detail_description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  primary_keyword = EXCLUDED.primary_keyword,
  status = EXCLUDED.status,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- 3) Insert/Update product_versions
WITH version_rows(product_slug, name, code, description, display_order) AS (
  VALUES
  ('goi-cong-thai-hoc-thao-duoc-co-nhiet-va-loai-khong-co-nhiet', 'Có Nhiệt', 'V01', NULL, 1),
  ('goi-cong-thai-hoc-thao-duoc-co-nhiet-va-loai-khong-co-nhiet', 'Không Nhiệt', 'V02', NULL, 2),
  ('tui-chuom-da-nang-thao-duoc-naherbs-co-nhiet-khong-nhiet', 'Có Nhiệt', 'V01', NULL, 1),
  ('tui-chuom-da-nang-thao-duoc-naherbs-co-nhiet-khong-nhiet', 'Không Nhiệt', 'V02', NULL, 2),
  ('goi-chuom-da-nang-thao-duoc-size-to-co-bong', 'Có Nhiệt', 'V01', NULL, 1),
  ('goi-chuom-da-nang-thao-duoc-size-to-co-bong', 'Không Nhiệt', 'V02', NULL, 2),
  ('coc-xong-hoi-ngai-cuu-naherbs-bo-coc-cuu-ngai-cham-soc-suc-khoe-tai-nha', 'COMBO', 'V01', NULL, 1),
  ('bo-xong-ngai-cuu-cam-tay-tien-loi-cham-soc-suc-khoe-tai-nha', 'COMBO', 'V01', NULL, 1),
  ('bit-mat-thao-duoc-naherbs-chuom-mat-thao-duoc-thu-gian-cham-soc-giac-ngu', 'Mặc định', 'V01', NULL, 1),
  ('dieu-ngai-cuu-naherbs-thao-duoc-ho-tro-cham-soc-suc-khoe', 'Điếu Ngắn', 'V01', NULL, 1),
  ('dieu-ngai-cuu-naherbs-thao-duoc-ho-tro-cham-soc-suc-khoe', 'Điếu Dài', 'V02', NULL, 2),
  ('ao-choang-chu-u-thao-duoc-naherbs-100-thao-duoc-tu-thien-nhien', 'Mặc định', 'V01', NULL, 1),
  ('goi-chu-u-thao-duoc-naherbs-goi-ke-co-du-lich-thao-duoc-100-thien-nhien', 'Mặc định', 'V01', NULL, 1),
  ('tinh-dau-thao-duoc-naherbs-tinh-dau-thien-nhien-que-hoi-chanh-sa', 'Mùi Quế Hồi', 'V01', NULL, 1),
  ('tinh-dau-thao-duoc-naherbs-tinh-dau-thien-nhien-que-hoi-chanh-sa', 'Mùi Sả Chanh', 'V02', NULL, 2)
)
INSERT INTO naherb.product_versions (product_id, name, code, description, display_order, status, created_at, updated_at)
SELECT p.id, r.name, r.code, r.description, r.display_order, 'PUBLISHED', now(), now()
FROM version_rows r
JOIN naherb.products p ON p.slug = r.product_slug
ON CONFLICT (product_id, code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  status = EXCLUDED.status,
  updated_at = now();

-- 4) Insert/Update product_skus
WITH sku_rows(product_slug, version_code, sku_code, sku_name, color, scent, size, type, original_price, sale_price, stock_quantity, display_order) AS (
  VALUES
  ('goi-cong-thai-hoc-thao-duoc-co-nhiet-va-loai-khong-co-nhiet', 'V01', 'NH-P01-S01', 'GỐI CÔNG THÁI HỌC THẢO DƯỢC ( CÓ NHIỆT ) VÀ LOẠI KHÔNG CÓ NHIỆT - Có Nhiệt - Be', 'Be', NULL, NULL, 'Có Nhiệt', 789000, 399000, 50, 1),
  ('goi-cong-thai-hoc-thao-duoc-co-nhiet-va-loai-khong-co-nhiet', 'V02', 'NH-P01-S02', 'GỐI CÔNG THÁI HỌC THẢO DƯỢC ( CÓ NHIỆT ) VÀ LOẠI KHÔNG CÓ NHIỆT - Không Nhiệt - Nâu Chùa', 'Nâu Chùa', NULL, NULL, 'Không Nhiệt', 789000, 399000, 50, 2),
  ('tui-chuom-da-nang-thao-duoc-naherbs-co-nhiet-khong-nhiet', 'V01', 'NH-P02-S01', 'Túi Chườm Đa Năng Thảo Dược NaHerbs – Có Nhiệt & Không Nhiệt - Có Nhiệt - Be', 'Be', NULL, NULL, 'Có Nhiệt', 489000, 249000, 50, 1),
  ('tui-chuom-da-nang-thao-duoc-naherbs-co-nhiet-khong-nhiet', 'V02', 'NH-P02-S02', 'Túi Chườm Đa Năng Thảo Dược NaHerbs – Có Nhiệt & Không Nhiệt - Không Nhiệt - Nâu Chùa', 'Nâu Chùa', NULL, NULL, 'Không Nhiệt', 389000, 199000, 50, 2),
  ('goi-chuom-da-nang-thao-duoc-size-to-co-bong', 'V01', 'NH-P03-S01', 'Gối chườm đa năng thảo dược size to có bông - Có Nhiệt - Be', 'Be', NULL, NULL, 'Có Nhiệt', 489000, 249000, 50, 1),
  ('goi-chuom-da-nang-thao-duoc-size-to-co-bong', 'V02', 'NH-P03-S02', 'Gối chườm đa năng thảo dược size to có bông - Không Nhiệt - Nâu Chùa', 'Nâu Chùa', NULL, NULL, 'Không Nhiệt', 389000, 199000, 50, 2),
  ('coc-xong-hoi-ngai-cuu-naherbs-bo-coc-cuu-ngai-cham-soc-suc-khoe-tai-nha', 'V01', 'NH-P04-S01', 'Cốc Xông Hơi Ngải Cứu NaHerbs – Bộ Cốc Cứu Ngải Chăm Sóc Sức Khỏe Tại Nhà - COMBO - Be', 'Be', NULL, NULL, 'COMBO', 589000, 299000, 6, 1),
  ('coc-xong-hoi-ngai-cuu-naherbs-bo-coc-cuu-ngai-cham-soc-suc-khoe-tai-nha', 'V01', 'NH-P04-S02', 'Cốc Xông Hơi Ngải Cứu NaHerbs – Bộ Cốc Cứu Ngải Chăm Sóc Sức Khỏe Tại Nhà - COMBO - Nâu Chùa', 'Nâu Chùa', NULL, NULL, 'COMBO', 589000, 299000, 6, 2),
  ('bo-xong-ngai-cuu-cam-tay-tien-loi-cham-soc-suc-khoe-tai-nha', 'V01', 'NH-P05-S01', 'Bộ Xông Ngải Cứu Cầm Tay Tiện Lợi - Chăm Sóc Sức Khỏe Tại Nhà - COMBO', NULL, NULL, NULL, 'COMBO', 569000, 289000, 1, 1),
  ('bit-mat-thao-duoc-naherbs-chuom-mat-thao-duoc-thu-gian-cham-soc-giac-ngu', 'V01', 'NH-P06-S01', 'Bịt Mắt Thảo Dược NaHerbs – Chườm Mắt Thảo Dược Thư Giãn & Chăm Sóc Giấc Ngủ - Be', 'Be', NULL, NULL, NULL, 198000, 99000, 50, 1),
  ('bit-mat-thao-duoc-naherbs-chuom-mat-thao-duoc-thu-gian-cham-soc-giac-ngu', 'V01', 'NH-P06-S02', 'Bịt Mắt Thảo Dược NaHerbs – Chườm Mắt Thảo Dược Thư Giãn & Chăm Sóc Giấc Ngủ - Nâu Chùa', 'Nâu Chùa', NULL, NULL, NULL, 198000, 99000, 50, 2),
  ('dieu-ngai-cuu-naherbs-thao-duoc-ho-tro-cham-soc-suc-khoe', 'V01', 'NH-P07-S01', 'Điếu Ngải Cứu NaHerbs – Thảo Dược Hỗ Trợ Chăm Sóc Sức Khỏe - Điếu Ngắn', NULL, NULL, 'Điếu Ngắn', 'Điếu Ngắn', 309000, 159000, 10, 1),
  ('dieu-ngai-cuu-naherbs-thao-duoc-ho-tro-cham-soc-suc-khoe', 'V02', 'NH-P07-S02', 'Điếu Ngải Cứu NaHerbs – Thảo Dược Hỗ Trợ Chăm Sóc Sức Khỏe - Điếu Dài', NULL, NULL, 'Điếu Dài', 'Điếu Dài', 309000, 159000, 10, 2),
  ('ao-choang-chu-u-thao-duoc-naherbs-100-thao-duoc-tu-thien-nhien', 'V01', 'NH-P08-S01', 'Áo Choàng Chữ U Thảo Dược NaHerbs 100% thảo dược từ thiên nhiên - Be', 'Be', NULL, NULL, NULL, 589000, 299000, 50, 1),
  ('ao-choang-chu-u-thao-duoc-naherbs-100-thao-duoc-tu-thien-nhien', 'V01', 'NH-P08-S02', 'Áo Choàng Chữ U Thảo Dược NaHerbs 100% thảo dược từ thiên nhiên - Nâu Chùa', 'Nâu Chùa', NULL, NULL, NULL, 589000, 299000, 50, 2),
  ('goi-chu-u-thao-duoc-naherbs-goi-ke-co-du-lich-thao-duoc-100-thien-nhien', 'V01', 'NH-P09-S01', 'Gối Chữ U Thảo Dược NaHerbs – Gối Kê Cổ Du Lịch Thảo Dược 100% Thiên Nhiên - Be', 'Be', NULL, NULL, NULL, 178000, 89000, 10, 1),
  ('goi-chu-u-thao-duoc-naherbs-goi-ke-co-du-lich-thao-duoc-100-thien-nhien', 'V01', 'NH-P09-S02', 'Gối Chữ U Thảo Dược NaHerbs – Gối Kê Cổ Du Lịch Thảo Dược 100% Thiên Nhiên - Nâu Chùa', 'Nâu Chùa', NULL, NULL, NULL, 178000, 89000, 10, 2),
  ('tinh-dau-thao-duoc-naherbs-tinh-dau-thien-nhien-que-hoi-chanh-sa', 'V01', 'NH-P10-S01', 'Tinh Dầu Thảo Dược NaHerbs – Tinh Dầu Thiên Nhiên Quế Hồi & Chanh Sả - Mùi Quế Hồi - Quế Hồi', NULL, 'Quế Hồi', NULL, NULL, 112000, 49000, 100, 1),
  ('tinh-dau-thao-duoc-naherbs-tinh-dau-thien-nhien-que-hoi-chanh-sa', 'V02', 'NH-P10-S02', 'Tinh Dầu Thảo Dược NaHerbs – Tinh Dầu Thiên Nhiên Quế Hồi & Chanh Sả - Mùi Sả Chanh - Sả Chanh', NULL, 'Sả Chanh', NULL, NULL, 112000, 49000, 100, 2)
)
INSERT INTO naherb.product_skus (product_id, version_id, sku_code, sku_name, color, scent, size, type, original_price, sale_price, stock_quantity, low_stock_threshold, stock_status, status, display_order, created_at, updated_at)
SELECT
  p.id,
  v.id,
  r.sku_code,
  r.sku_name,
  r.color,
  r.scent,
  r.size,
  r.type,
  r.original_price,
  r.sale_price,
  r.stock_quantity,
  3,
  CASE
    WHEN r.stock_quantity <= 0 THEN 'OUT_OF_STOCK'
    WHEN r.stock_quantity <= 3 THEN 'LOW_STOCK'
    ELSE 'IN_STOCK'
  END,
  CASE WHEN r.stock_quantity <= 0 THEN 'OUT_OF_STOCK' ELSE 'ACTIVE' END,
  r.display_order,
  now(),
  now()
FROM sku_rows r
JOIN naherb.products p ON p.slug = r.product_slug
JOIN naherb.product_versions v ON v.product_id = p.id AND v.code = r.version_code
ON CONFLICT (sku_code) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  version_id = EXCLUDED.version_id,
  sku_name = EXCLUDED.sku_name,
  color = EXCLUDED.color,
  scent = EXCLUDED.scent,
  size = EXCLUDED.size,
  type = EXCLUDED.type,
  original_price = EXCLUDED.original_price,
  sale_price = EXCLUDED.sale_price,
  stock_quantity = EXCLUDED.stock_quantity,
  low_stock_threshold = EXCLUDED.low_stock_threshold,
  stock_status = EXCLUDED.stock_status,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- 5) Insert/Update ảnh tạm cho từng sản phẩm
-- Ghi chú: đang dùng chung URL ảnh placeholder. Khi có ảnh thật, chỉ cần thay temp_image_url hoặc update media_assets/product_images.
WITH seed_products(slug, display_order) AS (
  VALUES
  ('goi-cong-thai-hoc-thao-duoc-co-nhiet-va-loai-khong-co-nhiet', 1),
  ('tui-chuom-da-nang-thao-duoc-naherbs-co-nhiet-khong-nhiet', 2),
  ('goi-chuom-da-nang-thao-duoc-size-to-co-bong', 3),
  ('coc-xong-hoi-ngai-cuu-naherbs-bo-coc-cuu-ngai-cham-soc-suc-khoe-tai-nha', 4),
  ('bo-xong-ngai-cuu-cam-tay-tien-loi-cham-soc-suc-khoe-tai-nha', 5),
  ('bit-mat-thao-duoc-naherbs-chuom-mat-thao-duoc-thu-gian-cham-soc-giac-ngu', 6),
  ('dieu-ngai-cuu-naherbs-thao-duoc-ho-tro-cham-soc-suc-khoe', 7),
  ('ao-choang-chu-u-thao-duoc-naherbs-100-thao-duoc-tu-thien-nhien', 8),
  ('goi-chu-u-thao-duoc-naherbs-goi-ke-co-du-lich-thao-duoc-100-thien-nhien', 9),
  ('tinh-dau-thao-duoc-naherbs-tinh-dau-thien-nhien-que-hoi-chanh-sa', 10)
), temp_image AS (
  SELECT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBB4LQTn0vRq4ydPLp-uTj_lEUHOHYWUU18JlCq5KuMw&s=10'::text AS url
), product_image_rows AS (
  SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.slug AS product_slug,
    sp.display_order,
    ti.url,
    (
      substr(md5('naherb-media-product-' || p.slug), 1, 8) || '-' ||
      substr(md5('naherb-media-product-' || p.slug), 9, 4) || '-' ||
      substr(md5('naherb-media-product-' || p.slug), 13, 4) || '-' ||
      substr(md5('naherb-media-product-' || p.slug), 17, 4) || '-' ||
      substr(md5('naherb-media-product-' || p.slug), 21, 12)
    )::uuid AS media_id,
    (
      substr(md5('naherb-product-image-' || p.slug), 1, 8) || '-' ||
      substr(md5('naherb-product-image-' || p.slug), 9, 4) || '-' ||
      substr(md5('naherb-product-image-' || p.slug), 13, 4) || '-' ||
      substr(md5('naherb-product-image-' || p.slug), 17, 4) || '-' ||
      substr(md5('naherb-product-image-' || p.slug), 21, 12)
    )::uuid AS product_image_id
  FROM seed_products sp
  JOIN naherb.products p ON p.slug = sp.slug
  CROSS JOIN temp_image ti
), upsert_media AS (
  INSERT INTO naherb.media_assets (id, type, url, storage_path, file_name, mime_type, file_size_bytes, alt_text, created_at, updated_at)
  SELECT
    media_id,
    'PRODUCT',
    url,
    NULL,
    product_slug || '-temp-image.jpg',
    'image/jpeg',
    NULL,
    product_name,
    now(),
    now()
  FROM product_image_rows
  ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type,
    url = EXCLUDED.url,
    file_name = EXCLUDED.file_name,
    mime_type = EXCLUDED.mime_type,
    alt_text = EXCLUDED.alt_text,
    updated_at = now()
  RETURNING id
)
INSERT INTO naherb.product_images (id, product_id, sku_id, media_id, url, alt_text, display_order, is_thumbnail, created_at, updated_at)
SELECT
  product_image_id,
  product_id,
  NULL,
  media_id,
  url,
  product_name,
  1,
  true,
  now(),
  now()
FROM product_image_rows
ON CONFLICT (id) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  sku_id = EXCLUDED.sku_id,
  media_id = EXCLUDED.media_id,
  url = EXCLUDED.url,
  alt_text = EXCLUDED.alt_text,
  display_order = EXCLUDED.display_order,
  is_thumbnail = EXCLUDED.is_thumbnail,
  updated_at = now();

COMMIT;
