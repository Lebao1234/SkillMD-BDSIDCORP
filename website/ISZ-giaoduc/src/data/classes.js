// Lịch khai giảng. Cập nhật tay mỗi tuần. Lớp đã khai giảng tự ẩn khi build.
// days: 246 = Thứ 2-4-6, 357 = Thứ 3-5-7, cuoi-tuan = Thứ 7 và Chủ nhật, cn = Chủ nhật
// seats: số chỗ còn lại (0 = đã đủ, vẫn nhận đăng ký chờ)
module.exports = [
  { code: "BT-HSK1-1012", program: "hsk", level: "HSK 1", branch: "ben-thanh", days: "246", time: "18:00 - 19:30", start: "2026-10-12", seats: 3, promo: "Giảm 300.000đ khi đóng trọn khóa" },
  { code: "BT-HSK4-1013", program: "hsk", level: "HSK 4", branch: "ben-thanh", days: "357", time: "19:45 - 21:15", start: "2026-10-13", seats: 5, promo: "" },
  { code: "XH-GT1-1005", program: "giao-tiep", level: "Giao tiếp 1", branch: "xuan-hoa", days: "246", time: "19:45 - 21:15", start: "2026-10-05", seats: 2, promo: "Tặng bộ giáo trình" },
  { code: "XH-HSK3-1020", program: "hsk", level: "HSK 3", branch: "xuan-hoa", days: "357", time: "18:00 - 19:30", start: "2026-10-20", seats: 7, promo: "" },
  { code: "CL-GT2-1006", program: "giao-tiep", level: "Giao tiếp 2", branch: "cho-lon", days: "357", time: "18:15 - 19:45", start: "2026-10-06", seats: 0, promo: "" },
  { code: "CL-HSK2-1019", program: "hsk", level: "HSK 2", branch: "cho-lon", days: "246", time: "09:00 - 10:30", start: "2026-10-19", seats: 6, promo: "" },
  { code: "TSH-DN-1015", program: "doanh-nghiep", level: "Giao tiếp công sở", branch: "tan-son-hoa", days: "357", time: "12:00 - 13:30", start: "2026-10-15", seats: 4, promo: "Giảm 15% khi đăng ký nhóm 3 người" },
  { code: "TSH-HSK1-1026", program: "hsk", level: "HSK 1", branch: "tan-son-hoa", days: "246", time: "19:45 - 21:15", start: "2026-10-26", seats: 9, promo: "Giảm 300.000đ khi đóng trọn khóa" },
  { code: "GD-TN1-1010", program: "thieu-nhi", level: "Mầm (6 - 8 tuổi)", branch: "gia-dinh", days: "cuoi-tuan", time: "08:30 - 09:45", start: "2026-10-10", seats: 2, promo: "Anh chị em học cùng giảm 10%" },
  { code: "GD-TN2-1017", program: "thieu-nhi", level: "Chồi (8 - 11 tuổi)", branch: "gia-dinh", days: "cuoi-tuan", time: "10:00 - 11:15", start: "2026-10-17", seats: 5, promo: "Anh chị em học cùng giảm 10%" },
  { code: "GD-GT1-1103", program: "giao-tiep", level: "Giao tiếp 1", branch: "gia-dinh", days: "357", time: "19:45 - 21:15", start: "2026-11-03", seats: 10, promo: "Tặng bộ giáo trình" },
  { code: "PMH-TN3-1011", program: "thieu-nhi", level: "Lá (11 - 15 tuổi)", branch: "phu-my-hung", days: "cuoi-tuan", time: "14:00 - 15:15", start: "2026-10-11", seats: 4, promo: "" },
  { code: "PMH-GT1-1007", program: "giao-tiep", level: "Giao tiếp 1", branch: "phu-my-hung", days: "246", time: "18:00 - 19:30", start: "2026-10-07", seats: 1, promo: "Tặng bộ giáo trình" },
  { code: "PMH-TP-1018", program: "thu-phap", level: "Thư pháp khóa 14", branch: "phu-my-hung", days: "cn", time: "08:30 - 11:00", start: "2026-10-18", seats: 3, promo: "" },
  { code: "TD-HSK1-1006", program: "hsk", level: "HSK 1", branch: "thu-duc", days: "357", time: "17:45 - 19:15", start: "2026-10-06", seats: 0, promo: "Sinh viên giảm 10%" },
  { code: "TD-HSK1-1027", program: "hsk", level: "HSK 1", branch: "thu-duc", days: "357", time: "17:45 - 19:15", start: "2026-10-27", seats: 12, promo: "Sinh viên giảm 10%" },
  { code: "TD-HSK5-1102", program: "hsk", level: "HSK 5", branch: "thu-duc", days: "246", time: "19:30 - 21:00", start: "2026-11-02", seats: 8, promo: "Sinh viên giảm 10%" },
  { code: "BT-TP-1025", program: "thu-phap", level: "Thư pháp khóa 15", branch: "ben-thanh", days: "cn", time: "08:30 - 11:00", start: "2026-10-25", seats: 6, promo: "" },
  { code: "ON-GT1-1006", program: "online", level: "Giao tiếp 1 (live)", branch: "online", days: "357", time: "21:30 - 23:00", start: "2026-10-06", seats: 2, promo: "Giảm 200.000đ cho học viên ngoài TP.HCM" },
  { code: "ON-HSK2-1012", program: "online", level: "HSK 2 (live)", branch: "online", days: "246", time: "06:00 - 07:30", start: "2026-10-12", seats: 4, promo: "" },
  { code: "ON-HSK4-1015", program: "online", level: "Luyện đề HSK 4", branch: "online", days: "357", time: "20:00 - 21:30", start: "2026-10-15", seats: 6, promo: "" },
  { code: "ON-HSK1-1109", program: "online", level: "HSK 1 (live)", branch: "online", days: "246", time: "12:00 - 13:30", start: "2026-11-09", seats: 8, promo: "Giảm 200.000đ cho học viên ngoài TP.HCM" },
];
