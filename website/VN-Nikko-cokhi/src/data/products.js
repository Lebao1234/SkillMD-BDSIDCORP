// Sản phẩm tiêu biểu theo nhóm (ảnh minh họa, thông số là DỮ LIỆU MẪU).
// seg: nhóm sản phẩm (khóa của SEG). mat: inox | sat
module.exports = [
  { code: "SP-01", name: "Chậu rửa, bồn rửa inox", seg: "gia-dung", mat: "inox", spec: "SUS304 dày 1,0 - 1,2 mm", img: "chau-rua-inox.jpg", note: "Chấn, hàn kín góc, đánh xước hairline; làm theo kích thước tủ bếp." },
  { code: "SP-02", name: "Giá treo, kệ đồ bếp inox", seg: "gia-dung", mat: "inox", spec: "SUS304, SUS201 · ống, la, thanh", img: "gia-treo-inox.jpg", note: "Thanh treo dụng cụ, kệ úp bát, giá gia vị; hàn TIG, đánh bóng." },
  { code: "SP-03", name: "Bàn sơ chế, bàn chậu inox", seg: "gia-dung", mat: "inox", spec: "SUS304 · giá dưới, chân tăng chỉnh", img: "bep-inox-2.jpg", note: "Bàn sơ chế, bàn chậu, tủ bếp cho bếp ăn tập thể và nhà hàng." },
  { code: "SP-04", name: "Hạng mục inox bếp công nghiệp", seg: "gia-dung", mat: "inox", spec: "SUS304 · chụp hút, bàn, kệ, xe đẩy", img: "bep-inox.jpg", note: "Làm trọn hạng mục inox cho bếp trường học, bếp nhà máy, nhà hàng." },
  { code: "SP-05", name: "Lan can, tay vịn inox", seg: "dan-dung", mat: "inox", spec: "Ống SUS304 Ø42 - Ø76 · hàn TIG", img: "lan-can-inox.jpg", note: "Lan can cầu thang, ban công, hành lang; đo đạc tại công trình." },
  { code: "SP-06", name: "Cầu thang sắt, khung kết cấu", seg: "dan-dung", mat: "sat", spec: "Thép hộp, thép tấm · sơn tĩnh điện", img: "cau-thang-sat.jpg", note: "Cầu thang thoát hiểm, cầu thang ngoài trời, khung mái, khung biển." },
  { code: "SP-07", name: "Cổng, hàng rào, cửa sắt", seg: "dan-dung", mat: "sat", spec: "Thép hộp, thép tấm · cắt laser hoa văn", img: "cong-sat.jpg", note: "Cổng nhà, hàng rào, cửa sổ bảo vệ; hoa văn cắt laser theo mẫu." },
  { code: "SP-08", name: "Tay vịn uốn cong, phụ kiện inox", seg: "dan-dung", mat: "inox", spec: "Ống uốn · SUS304 bóng gương", img: "tay-vin-inox.jpg", note: "Tay vịn uốn theo cung cầu thang, trụ lan can, bát liên kết theo mẫu." },
  { code: "SP-09", name: "Khung bàn, khung ghế sắt", seg: "noi-that", mat: "sat", spec: "Thép hộp 20x40 - 40x80 · sơn tĩnh điện", img: "ban-khung-sat.jpg", note: "Khung bàn ăn, bàn cafe, chân bàn văn phòng cho xưởng gỗ nội thất." },
  { code: "SP-10", name: "Khung tủ, kệ trang trí", seg: "noi-that", mat: "sat", spec: "Thép, inox mạ màu · theo bản vẽ", img: "tu-khung-sat.jpg", note: "Khung tủ, kệ sách, vách ngăn cho công trình và showroom." },
  { code: "SP-11", name: "Bảng treo dụng cụ 5S", seg: "5s", mat: "sat", spec: "Thép tấm đục lỗ · sơn tĩnh điện", img: "bang-dung-cu.jpg", note: "Bảng treo, giá để dụng cụ theo vị trí cố định, kèm nhãn 5S." },
  { code: "SP-12", name: "Tủ locker, tủ dụng cụ", seg: "5s", mat: "sat", spec: "Thép tấm 0,6 - 1,0 mm · nhiều ngăn", img: "tu-locker.jpg", note: "Tủ locker công nhân, tủ hồ sơ, tủ đựng dụng cụ có khóa." },
  { code: "SP-13", name: "Giá, kệ dụng cụ khu sản xuất", seg: "5s", mat: "sat", spec: "Thép hộp, gỗ ép · theo vị trí", img: "gia-dung-cu.jpg", note: "Giá dụng cụ, giá để khuôn, bàn thao tác cho từng trạm làm việc." },
  { code: "SP-14", name: "Kệ kho, kệ trung tải", seg: "kcn", mat: "sat", spec: "Thép V lỗ, thép hộp · 200 - 1.000 kg/tầng", img: "ke-sat-cn.jpg", note: "Kệ kho, kệ linh kiện, kệ pallet cho nhà máy trong khu công nghiệp." },
  { code: "SP-15", name: "Khung máy, đồ gá, xe đẩy", seg: "kcn", mat: "sat", spec: "Thép hộp, thép tấm · theo bản vẽ", img: "han-khung.jpg", note: "Khung máy, bàn thao tác, đồ gá hàn, xe đẩy vật tư theo bản vẽ nhà máy." },
  { code: "SP-16", name: "Bồn, thùng, máng inox", seg: "kcn", mat: "inox", spec: "SUS304, SUS316 · dày 1,5 - 3 mm", img: "bon-inox.jpg", note: "Bồn chứa, thùng, máng dẫn cho xưởng thực phẩm và đồ uống." },
  { code: "SP-17", name: "Chi tiết cắt laser, chấn gấp", seg: "theo-don", mat: "sat", spec: "Thép đến 12 mm, inox đến 6 mm", img: "cat-laser.jpg", note: "Cắt laser theo file CAD, chấn gấp; giao chi tiết rời hoặc lắp cụm." },
  { code: "SP-18", name: "Chi tiết tiện, phay theo mẫu", seg: "theo-don", mat: "inox", spec: "Inox, thép, đồng · đơn chiếc đến hàng loạt", img: "tien-chi-tiet.jpg", note: "Không có bản vẽ vẫn làm được: đo mẫu cũ, vẽ lại, gia công." },
];
module.exports.SEG = { "gia-dung": "Gia dụng", "dan-dung": "Dân dụng", "noi-that": "Nội thất", "5s": "Hàng 5S", kcn: "Hàng khu công nghiệp", "theo-don": "Chi tiết theo đơn" };
module.exports.MAT = { inox: "Inox", sat: "Sắt, thép" };
