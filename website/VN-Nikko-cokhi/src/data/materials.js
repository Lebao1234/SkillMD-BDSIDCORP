// Bảng vật liệu tham khảo, tập trung vào inox và thép xưởng dùng nhiều nhất.
// Cơ tính là giá trị tối thiểu hoặc khoảng điển hình theo tiêu chuẩn, chỉ để tham khảo khi chọn vật liệu.
// rho: khối lượng riêng (g/cm³) dùng cho công cụ tính khối lượng phôi.
module.exports = [
  { key: "sus304", group: "Inox", name: "SUS304", std: "JIS G4304", alt: "AISI 304, 1.4301", ts: "≥ 520", el: "≥ 40", hb: "≤ 187", rho: 7.93, use: "Bếp, chậu rửa, bồn, lan can, thiết bị thực phẩm" },
  { key: "sus201", group: "Inox", name: "SUS201", std: "JIS G4304", alt: "AISI 201, 1.4372", ts: "≥ 520", el: "≥ 40", hb: "≤ 241", rho: 7.8, use: "Đồ gia dụng, nội thất trong nhà, nơi khô ráo" },
  { key: "sus316", group: "Inox", name: "SUS316", std: "JIS G4304", alt: "AISI 316, 1.4401", ts: "≥ 520", el: "≥ 40", hb: "≤ 187", rho: 7.98, use: "Ven biển, môi trường muối, hóa chất nhẹ" },
  { key: "sus430", group: "Inox", name: "SUS430", std: "JIS G4305", alt: "AISI 430, 1.4016", ts: "≥ 420", el: "≥ 22", hb: "≤ 183", rho: 7.7, use: "Mặt tủ, tấm ốp, chi tiết trang trí trong nhà" },
  { key: "ss400", group: "Thép carbon", name: "SS400", std: "JIS G3101", alt: "CT3, Q235", ts: "400 - 510", el: "≥ 21", hb: "≈ 120 - 160", rho: 7.85, use: "Khung, kết cấu, cầu thang, cổng, kệ kho" },
  { key: "spcc", group: "Thép cán nguội", name: "SPCC", std: "JIS G3141", alt: "Thép tấm đen cán nguội", ts: "≥ 270", el: "≥ 32", hb: "-", rho: 7.85, use: "Tủ locker, tủ điện, vỏ máy, chi tiết chấn" },
  { key: "sgcc", group: "Tôn mạ kẽm", name: "SGCC", std: "JIS G3302", alt: "Tôn kẽm, thép mạ kẽm", ts: "≥ 270", el: "-", hb: "-", rho: 7.85, use: "Máng, vỏ, kệ, chi tiết cần chống gỉ" },
  { key: "s45c", group: "Thép carbon", name: "S45C", std: "JIS G4051", alt: "C45, thép 45", ts: "≥ 570 (thường hóa)", el: "≥ 20", hb: "≈ 167 - 229", rho: 7.85, use: "Trục, chốt, chi tiết tiện cần nhiệt luyện" },
  { key: "al", group: "Nhôm", name: "A5052", std: "JIS H4000", alt: "AlMg2.5", ts: "≥ 215 (H32)", el: "≥ 7", hb: "≈ 60", rho: 2.68, use: "Tấm vỏ, hộp, chi tiết nhẹ chịu thời tiết" },
  { key: "cu", group: "Đồng thau", name: "C3604", std: "JIS H3250", alt: "CuZn39Pb3", ts: "≥ 335", el: "-", hb: "≈ 90 - 130", rho: 8.5, use: "Bạc lót, đầu nối, chi tiết tiện dễ cắt" },
];
