// 4 lĩnh vực, đúng ngành nghề đăng ký của công ty. Mỗi lĩnh vực sinh một trang qua src/templates/service.js.
// Thông số năng lực (cap), thiết bị là DỮ LIỆU MẪU cho bản demo, cần thay bằng số liệu thật của xưởng.
module.exports = [
  {
    slug: "san-xuat-gang-thep", no: "01", code: "NK-01", name: "Sản xuất sắt, thép và gang", short: "Nấu luyện gang xám, gang cầu, thép carbon theo mác yêu cầu",
    lead: "Nấu luyện gang và thép trong lò cảm ứng trung tần, kiểm soát thành phần hóa học bằng máy quang phổ trước mỗi mẻ rót. Cung cấp phôi thỏi, phôi đúc và kim loại lỏng cho dây chuyền đúc của xưởng.",
    image: "lo-nau.jpg", hero: "nha-may-thep.jpg", icon: "ph-fire",
    cap: [["Lò nấu", "Lò cảm ứng trung tần"], ["Mác vật liệu", "FC200 - FC300, FCD400 - FCD600, thép carbon, thép hợp kim thấp"], ["Kiểm tra thành phần", "Máy quang phổ phát xạ, trước và sau khi rót"], ["Nhiệt độ rót", "1.380 - 1.450 °C (gang), 1.550 - 1.620 °C (thép)"]],
    work: ["Lựa chọn và phân loại phế liệu, gang thỏi đầu vào", "Nấu chảy, tinh luyện, điều chỉnh thành phần theo mác", "Cầu hóa và biến tính cho gang cầu", "Lấy mẫu, phân tích quang phổ từng mẻ", "Rót phôi thỏi hoặc chuyển sang dây chuyền đúc"],
    apps: ["Phôi cho đúc chi tiết máy", "Phôi thép cho rèn, cán", "Gang hợp kim chịu mài mòn"],
    faq: [["Có nhận nấu theo mác vật liệu của khách hàng không?", "Có. Gửi mác vật liệu theo tiêu chuẩn JIS, ASTM, GOST hoặc TCVN, kỹ sư luyện kim đối chiếu và báo lại thành phần hóa học mục tiêu trước khi nấu."], ["Có cấp chứng chỉ vật liệu không?", "Mỗi lô hàng kèm phiếu kết quả phân tích thành phần hóa học của mẻ nấu. Cơ tính được thử trên mẫu đúc kèm khi khách hàng yêu cầu."]],
  },
  {
    slug: "duc-kim-loai", no: "02", code: "NK-02", name: "Đúc kim loại", short: "Đúc khuôn cát gang, thép theo bản vẽ hoặc mẫu",
    lead: "Đúc chi tiết gang xám, gang cầu và thép bằng khuôn cát tươi và khuôn cát nhựa. Làm mẫu gỗ, mẫu nhựa, mẫu kim loại tại xưởng; nhận từ một chiếc đúc thử đến loạt hàng nghìn chiếc.",
    image: "rot-gang.jpg", hero: "hero-rot-khuon.jpg", icon: "ph-drop-half-bottom",
    cap: [["Công nghệ", "Khuôn cát tươi, khuôn cát nhựa tự cứng"], ["Khối lượng chi tiết", "0,5 kg đến 1.500 kg mỗi chiếc"], ["Dung sai đúc", "Theo ISO 8062, cấp DCTG 9 - 11"], ["Làm sạch", "Phun bi, mài ba via, cắt đậu ngót"]],
    work: ["Thiết kế công nghệ đúc: mặt phân khuôn, hệ thống rót, đậu ngót", "Làm mẫu và hộp lõi theo bản vẽ", "Làm khuôn, làm lõi, sấy lõi", "Nấu, rót, dỡ khuôn", "Làm sạch, phun bi, kiểm tra khuyết tật đúc"],
    apps: ["Vỏ bơm, vỏ hộp số, thân van", "Puly, bánh đà, mặt bích", "Đế máy, gối đỡ, chi tiết máy nông nghiệp"],
    faq: [["Số lượng tối thiểu là bao nhiêu?", "Không đặt số lượng tối thiểu cứng. Với đơn ít, chi phí làm mẫu chiếm tỷ lệ lớn; kỹ sư sẽ tư vấn dùng mẫu gỗ cho số lượng nhỏ và mẫu kim loại cho loạt lớn."], ["Khách hàng có mẫu cũ, không có bản vẽ thì sao?", "Gửi mẫu thật, xưởng đo đạc, dựng lại bản vẽ, bù co ngót và lượng dư gia công, gửi khách duyệt trước khi làm mẫu đúc."]],
  },
  {
    slug: "bo-phan-kim-loai", no: "03", code: "NK-03", name: "Sản xuất bộ phận kim loại", short: "Sản phẩm inox, sắt theo đơn: gia dụng, nội thất, hàng 5S, hàng KCN",
    lead: "Sản xuất sản phẩm và bộ phận bằng inox, sắt theo đơn đặt hàng hoặc theo hàng mẫu: đồ gia dụng, hạng mục dân dụng, khung nội thất, hàng 5S và hàng cho nhà máy trong khu công nghiệp.",
    image: "han-khung.jpg", hero: "ke-sat-cn.jpg", icon: "ph-gear-six",
    cap: [["Sản phẩm", "Chậu rửa, bàn bếp, lan can, cầu thang, khung bàn ghế, tủ locker, kệ kho, khung máy"], ["Vật liệu", "Inox SUS304, SUS201, SUS316; thép hộp, thép tấm, tôn mạ kẽm"], ["Quy mô", "Từ 1 chiếc, làm mẫu, đến hàng loạt"], ["Đầu vào", "Bản vẽ, hàng mẫu, ảnh chụp hoặc bản phác tay"]],
    work: ["Tiếp nhận bản vẽ hoặc hàng mẫu, đo đạc, vẽ lại", "Bóc tách vật liệu, báo giá, chốt bản vẽ", "Làm sản phẩm mẫu để khách duyệt", "Sản xuất hàng loạt: cắt, chấn, hàn, hoàn thiện", "Kiểm tra, đóng gói, giao và lắp đặt"],
    apps: ["Đồ gia dụng và hạng mục inox bếp công nghiệp", "Bảng dụng cụ, tủ locker, giá kệ 5S cho nhà xưởng", "Kệ kho, khung máy, xe đẩy cho nhà máy trong khu công nghiệp"],
    faq: [["Không có bản vẽ có đặt làm được không?", "Được. Gửi ảnh hàng mẫu và vài kích thước chính, hoặc mang mẫu đến xưởng. Kỹ thuật viên đo mẫu, vẽ lại bản vẽ và gửi khách duyệt trước khi làm."], ["Đặt số lượng ít có nhận không?", "Có. Xưởng nhận từ 1 chiếc. Với hàng loạt, xưởng làm một sản phẩm mẫu để khách duyệt trước khi chạy số lượng."]],
  },
  {
    slug: "gia-cong-xu-ly", no: "04", code: "NK-04", name: "Gia công cơ khí và xử lý kim loại", short: "Cắt laser, chấn, hàn, tiện phay, đánh bóng, sơn tĩnh điện",
    lead: "Nhận gia công từng công đoạn hoặc trọn gói: cắt laser, chấn gấp, uốn ống, hàn TIG, MIG, tiện phay; hoàn thiện đánh xước, đánh bóng inox, sơn tĩnh điện và mạ kẽm hàng sắt.",
    image: "cat-laser.jpg", hero: "chan-ton.jpg", icon: "ph-wrench",
    cap: [["Cắt laser", "Thép đến 12 mm, inox đến 6 mm, bàn 1.500 x 3.000 mm"], ["Chấn CNC", "100 tấn, chiều dài chấn đến 3.200 mm"], ["Hàn", "TIG inox, MIG/CO2 khung sắt, hàn laser cầm tay"], ["Hoàn thiện", "Xước hairline, bóng gương, sơn tĩnh điện, mạ kẽm"]],
    work: ["Nhận file CAD hoặc bản vẽ, xếp hình cắt tiết kiệm vật liệu", "Cắt laser, cắt tôn, cắt ống theo kích thước", "Chấn gấp, uốn ống, lốc tôn", "Hàn, mài mối hàn, tẩy màu inox", "Đánh xước, đánh bóng hoặc sơn tĩnh điện"],
    apps: ["Gia công thuê từng công đoạn cho xưởng bạn", "Chi tiết tấm, hộp, vỏ tủ điện, vỏ máy", "Hoa văn cổng, vách trang trí cắt laser"],
    faq: [["Có nhận gia công trên vật liệu của khách không?", "Có. Khách gửi tấm, ống hoặc bán thành phẩm kèm bản vẽ; xưởng kiểm tra vật liệu trước khi nhận."], ["File cắt laser gửi định dạng nào?", "DXF hoặc DWG theo tỷ lệ 1:1 là tốt nhất. Có file PDF hoặc ảnh, kỹ thuật viên sẽ vẽ lại và gửi khách xác nhận."]],
  },
];
