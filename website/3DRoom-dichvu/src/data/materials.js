/*
 * Vật liệu in. price = [thấp, cao] đồng/gram (giá tham khảo, chưa VAT). null = báo giá theo file.
 * Điểm 1-5: strength (độ bền), detail (độ chi tiết), heat (chịu nhiệt). Dùng cho trang vật liệu và công cụ ước tính giá.
 */
module.exports = [
  { key: "pla", name: "PLA", tech: "FDM", swatch: "#e9e4d8", price: [700, 800], strength: 2, detail: 3, heat: 1, temp: "55 độ C", use: "Mô hình trưng bày, mẫu thử hình dáng, quà tặng", note: "Dễ in, ít mùi, 14 màu có sẵn" },
  { key: "petg", name: "PETG", tech: "FDM", swatch: "#6fb3c8", price: [900, 1200], strength: 3, detail: 3, heat: 2, temp: "75 độ C", use: "Đồ gá, vỏ thiết bị, chi tiết chịu ẩm", note: "Dai hơn PLA, không giòn" },
  { key: "abs", name: "ABS", tech: "FDM", swatch: "#3b3f45", price: [900, 1200], strength: 3, detail: 3, heat: 3, temp: "95 độ C", use: "Chi tiết ô tô, vỏ máy, chi tiết cần chà sơn", note: "Chịu nhiệt tốt, xử lý hơi aceton được" },
  { key: "asa", name: "ASA", tech: "FDM", swatch: "#d8d2c4", price: [1000, 1300], strength: 3, detail: 3, heat: 3, temp: "95 độ C", use: "Linh vật, biển hiệu đặt ngoài trời", note: "Chống tia UV, không ố vàng" },
  { key: "tpu", name: "TPU 95A", tech: "FDM", swatch: "#1f2a30", price: [1100, 1300], strength: 3, detail: 2, heat: 2, temp: "80 độ C", use: "Gioăng, đế lót, vỏ bảo vệ", note: "Dẻo như cao su, đàn hồi" },
  { key: "pacf", name: "PA-CF", tech: "FDM", swatch: "#2a2d31", price: [1800, 2400], strength: 5, detail: 3, heat: 4, temp: "150 độ C", use: "Chi tiết chịu lực, tay kẹp robot", note: "Nylon trộn sợi carbon, cứng và nhẹ" },
  { key: "resin", name: "Resin tiêu chuẩn", tech: "SLA", swatch: "#b9bec2", price: [3500, 4000], strength: 2, detail: 5, heat: 2, temp: "60 độ C", use: "Figure, mô hình chi tiết, trang sức mẫu", note: "Bề mặt mịn nhất, hơi giòn" },
  { key: "tough", name: "Resin Tough", tech: "SLA", swatch: "#4d5a60", price: [4200, 4800], strength: 4, detail: 5, heat: 2, temp: "65 độ C", use: "Nguyên mẫu lắp ghép, khớp bấm", note: "Dai như ABS, chịu va đập" },
  { key: "clear", name: "Resin trong", tech: "SLA", swatch: "#dfeef2", price: [4500, 5200], strength: 2, detail: 5, heat: 2, temp: "60 độ C", use: "Ống dẫn chất lỏng, đèn, mẫu quang học", note: "Chà và phủ bóng để trong như kính" },
  { key: "cast", name: "Resin đúc", tech: "SLA", swatch: "#6e8f7c", price: [6000, 7500], strength: 1, detail: 5, heat: 1, temp: "Cháy sạch khi đúc", use: "Khuôn đúc trang sức vàng bạc", note: "Cháy không để lại tro" },
  { key: "pa12", name: "Nylon PA12", tech: "SLS", swatch: "#e6e6e3", price: [2600, 3200], strength: 4, detail: 4, heat: 3, temp: "130 độ C", use: "Chi tiết dùng thật, bản lề, loạt nhỏ", note: "Không cần đỡ, nhuộm đen được" },
  { key: "pa12gf", name: "PA12 thủy tinh", tech: "SLS", swatch: "#c9ccc7", price: [3000, 3600], strength: 5, detail: 4, heat: 4, temp: "160 độ C", use: "Chi tiết cứng, chịu nhiệt gần động cơ", note: "Pha bi thủy tinh, ít biến dạng" },
  { key: "ss316", name: "Thép 316L", tech: "SLM", swatch: "#9aa3a8", price: null, strength: 5, detail: 4, heat: 5, temp: "trên 800 độ C", use: "Dụng cụ y tế, chi tiết chống ăn mòn", note: "Không gỉ, gia công tinh được" },
  { key: "alsi", name: "Nhôm AlSi10Mg", tech: "SLM", swatch: "#c3c8cb", price: null, strength: 4, detail: 4, heat: 4, temp: "trên 300 độ C", use: "Vỏ tản nhiệt, chi tiết nhẹ", note: "Nhẹ, dẫn nhiệt tốt" },
  { key: "ti", name: "Titan Ti6Al4V", tech: "SLM", swatch: "#7f878c", price: null, strength: 5, detail: 4, heat: 5, temp: "trên 400 độ C", use: "Hàng không, cấy ghép y tế", note: "Bền nhất trên mỗi gram" },
];
