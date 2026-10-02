/*
 * Bộ sưu tập theo dịp. Mỗi phần tử sinh trang <slug>.html qua src/templates/collection.js.
 * Cấu trúc danh mục tham khảo aodainhaann.com: cưới, bà sui, bê quả, đi tiệc/chụp ảnh, Việt phục, nam, phụ kiện.
 */
module.exports = [
  {
    key: "cuoi", slug: "ao-dai-cuoi", name: "Áo dài cưới", short: "Cưới", no: "01",
    title: "Áo dài cưới", titleEm: "cho ngày về chung một nhà",
    image: "cuoi-co-dau-do.jpg", cover: "cuoi-le.jpg",
    lead: "Áo dài cô dâu, chú rể và áo dài cặp cho lễ gia tiên, rước dâu và tiệc cưới. Có sẵn đỏ truyền thống, trắng tinh khôi, kem và hồng pastel.",
    price: "Từ 500.000đ/bộ",
    subs: ["Cô dâu", "Áo dài cặp"],
    notes: [
      ["Thử miễn phí", "Hẹn thử trước ngày cưới 2-4 tuần, thử bao nhiêu mẫu cũng được."],
      ["Chỉnh form theo dáng", "Lên lai, bóp eo nhẹ để áo ôm vừa người, trả lại form sau khi nhận áo."],
      ["Giữ áo đến ngày cưới", "Đặt cọc 30% là áo được giữ riêng, không cho người khác thuê trùng ngày."],
    ],
    faq: [
      { q: "Nên thử áo trước ngày cưới bao lâu?", a: "Khoảng 2-4 tuần để còn thời gian chỉnh form. Mùa cưới tháng 10 đến tháng 1 nên hẹn sớm hơn vì mẫu đẹp hay bị giữ trước." },
      { q: "Thuê áo cưới được mấy ngày?", a: "Giá thuê tính 3 ngày: nhận áo trước lễ 1 ngày, trả sau lễ 1 ngày. Thêm ngày tính 20% giá thuê mỗi ngày." },
      { q: "Có thuê trọn bộ cho cả nhà không?", a: "Có combo gia đình gồm cô dâu, chú rể, hai bà sui và đội bê quả, giảm 10-15% so với thuê lẻ." },
    ],
  },
  {
    key: "sui", slug: "ao-dai-ba-sui", name: "Áo dài bà sui", short: "Bà sui", no: "02",
    title: "Áo dài bà sui", titleEm: "kín đáo, sang, đúng lễ",
    image: "sui-xanh.jpg", cover: "sui-den.jpg",
    lead: "Áo dài cho mẹ cô dâu và mẹ chú rể bằng gấm, lụa thêu, nhung. Màu trầm quý phái như đỏ đô, vàng đồng, xanh lam, tím than. Có size đến 3XL.",
    price: "Từ 350.000đ/bộ",
    subs: ["Gấm", "Lụa thêu", "Nhung", "Bigsize"],
    notes: [
      ["Size đến 3XL", "Form rộng vai, tay dài, không bó bụng. Mẹ ngồi đứng cả buổi lễ vẫn thoải mái."],
      ["Phối đồng màu hai họ", "Tư vấn màu để hai bà sui không trùng áo nhưng vẫn hài hòa khi đứng cạnh nhau."],
      ["Kèm khăn vấn, bông tai", "Mượn miễn phí khăn vấn, bông tai ngọc trai khi thuê áo bà sui."],
    ],
    faq: [
      { q: "Mẹ tôi hơi đậm người, có áo vừa không?", a: "Có. Tiệm có đủ size S đến 3XL, riêng áo bà sui nhiều mẫu may rộng vai, rộng bắp tay. Gửi số đo để tiệm lọc trước." },
      { q: "Không đến tiệm thử được thì sao?", a: "Gửi chiều cao, cân nặng, vòng ngực, vòng eo qua Zalo. Tiệm gửi video áo thật và giao tận nhà, đổi size miễn phí một lần." },
      { q: "Màu nào hợp cho bà sui?", a: "Đỏ đô, vàng đồng, xanh lam, tím than là các màu trang trọng. Tránh trắng và đen trơn trong lễ cưới." },
    ],
  },
  {
    key: "bequa", slug: "ao-dai-be-qua", name: "Áo dài bê quả", short: "Bê quả", no: "03",
    title: "Áo dài bê quả", titleEm: "đồng bộ cả đội",
    image: "bq-le.jpg", cover: "bq-nhom.jpg",
    lead: "Áo dài đồng phục cho đội bê quả nam và nữ trong lễ ăn hỏi. Mỗi mẫu có sẵn 10-16 bộ đủ size, cùng màu, cùng hoa văn.",
    price: "Từ 80.000đ/bộ",
    subs: ["Bê quả nữ", "Bê quả nam", "Trọn đội"],
    notes: [
      ["Đủ số lượng, đủ size", "Mỗi mẫu có 10-16 bộ từ S đến XXL, cả đội mặc đồng bộ không phải ghép màu."],
      ["Giặt hấp sau mỗi lượt", "Áo được giặt, hấp và treo túi riêng từng bộ, nhận về là mặc được."],
      ["Giao tận nhà", "Đơn từ 10 bộ giao và nhận tận nhà trong nội thành TP.HCM miễn phí."],
    ],
    faq: [
      { q: "Đội bê quả bao nhiêu người thì đủ?", a: "Thường là 5, 7, 9 hoặc 11 cặp tùy số tráp. Tiệm tư vấn số bộ theo số tráp bạn đặt." },
      { q: "Có áo cho nam bê quả không?", a: "Có áo dài nam cùng tông màu hoặc trơn để phối với đội nữ, kèm khăn đóng nếu cần." },
      { q: "Trả áo trễ thì tính thế nào?", a: "Trễ mỗi ngày tính 20% giá thuê mỗi bộ. Báo trước qua Zalo để tiệm sắp xếp lịch cho khách sau." },
    ],
  },
  {
    key: "tiec", slug: "ao-dai-di-tiec", name: "Áo dài đi tiệc, chụp ảnh", short: "Tiệc, chụp ảnh", no: "04",
    title: "Áo dài đi tiệc", titleEm: "và những buổi chụp ảnh",
    image: "tiec-cam-hoa.jpg", cover: "tiec-non-la.jpg",
    lead: "Áo dài suông, cách tân, truyền thống cho tiệc Tết, chụp kỷ yếu, chụp phố cổ hay dạo hồ sen. Hơn 120 mẫu, cập nhật mỗi tuần.",
    price: "Từ 120.000đ/bộ",
    subs: ["Suông", "Cách tân", "Truyền thống", "Yếm"],
    notes: [
      ["Hơn 120 mẫu", "Từ trơn tối giản đến gấm thêu, có cả mẫu đôi bạn thân và mẫu mẹ con."],
      ["Mượn phụ kiện", "Nón lá, quạt, túi cói, hoa giả được mượn miễn phí theo bộ áo."],
      ["Thuê theo nhóm", "Nhóm từ 5 người giảm 10%, có gợi ý phối màu cho cả nhóm khi lên hình."],
    ],
    faq: [
      { q: "Chụp ảnh nên chọn áo màu gì?", a: "Phố cổ tường vàng hợp áo xanh, trắng, đỏ. Hồ sen hợp trắng, hồng nhạt. Gửi địa điểm chụp, tiệm gợi ý 3-4 mẫu." },
      { q: "Có thuê theo buổi không?", a: "Áo đi tiệc tính giá 2 ngày. Không có gói theo buổi vì cần thời gian giặt hấp trước khi cho thuê tiếp." },
      { q: "Có mẫu cho trẻ em không?", a: "Có áo dài bé gái và bé trai 3-12 tuổi, nhiều mẫu đồng bộ với áo của mẹ." },
    ],
  },
  {
    key: "vietphuc", slug: "viet-phuc", name: "Việt phục", short: "Việt phục", no: "05",
    title: "Việt phục", titleEm: "nhật bình, ngũ thân, áo tấc",
    image: "vp-nhat-binh.jpg", cover: "vp-nhom.jpg",
    lead: "Áo nhật bình, áo ngũ thân tay chẽn, áo tấc cho chụp ảnh cổ phục, lễ cưới truyền thống và sự kiện văn hóa. Kèm mấn, khăn vấn, quạt.",
    price: "Từ 250.000đ/bộ",
    subs: ["Nhật bình", "Ngũ thân", "Áo tấc"],
    notes: [
      ["Mặc đúng cách", "Nhân viên hướng dẫn mặc áo tấc, vấn khăn, đội mấn ngay tại tiệm."],
      ["Đủ bộ phụ kiện", "Mấn, khăn vấn, quạt, trâm cài đi kèm theo từng mẫu, không tính thêm tiền."],
      ["Chụp nhóm, gia đình", "Có sẵn bộ đồng màu cho nhóm 4-8 người, cả nam và nữ."],
    ],
    faq: [
      { q: "Việt phục có khó mặc không?", a: "Áo tấc và nhật bình nhiều lớp nên lần đầu cần người hướng dẫn. Tiệm quay video hướng dẫn gửi kèm khi bạn nhận áo ở nhà." },
      { q: "Có thuê Việt phục cho chú rể không?", a: "Có áo tấc, áo ngũ thân nam kèm khăn đóng, phối được với nhật bình của cô dâu." },
      { q: "Thuê Việt phục đi Hội An, Huế được không?", a: "Được, thuê tối đa 5 ngày cho chuyến đi, gửi áo qua đường bưu điện có bảo hiểm." },
    ],
  },
  {
    key: "nam", slug: "ao-dai-nam", name: "Áo dài nam", short: "Nam", no: "06",
    title: "Áo dài nam", titleEm: "cách tân và cổ phục",
    image: "nam-quat.jpg", cover: "nam-xanh-la.jpg",
    lead: "Áo dài nam cho chú rể, bê quả, chụp ảnh và tiệc Tết. Gấm, lụa, đũi trơn, từ form cổ phục có khăn đóng đến cách tân cổ đứng.",
    price: "Từ 150.000đ/bộ",
    subs: ["Cách tân", "Cổ phục", "Chú rể"],
    notes: [
      ["Kèm quần, khăn đóng", "Mỗi bộ có quần ống suông cùng tông, khăn đóng cho mẫu cổ phục."],
      ["Size đến XXL", "Có form vai rộng cho người vóc dáng to, tay áo dài đủ không bị hụt."],
      ["Phối cặp", "Nhiều mẫu nam đi cặp với mẫu nữ cùng hoa văn cho cặp đôi và vợ chồng."],
    ],
    faq: [
      { q: "Mặc áo dài nam với giày gì?", a: "Giày tây da đen, nâu hoặc giày hài vải. Tiệm có giày hài cho mượn size 39-43." },
      { q: "Có áo dài cho bé trai không?", a: "Có size 3-12 tuổi, nhiều mẫu đồng bộ với áo của ba." },
      { q: "Tôi cao 1m85, có áo vừa không?", a: "Có form dài cho người cao, gửi số đo để tiệm chọn trước mẫu vừa." },
    ],
  },
  {
    key: "phukien", slug: "phu-kien", name: "Phụ kiện", short: "Phụ kiện", no: "07",
    title: "Phụ kiện", titleEm: "cho trọn một bộ",
    image: "pk-quat-vang.jpg", cover: "pk-quat-hoa.jpg",
    lead: "Quạt xếp, nón lá, mấn, khăn vấn, trâm cài, túi xách ngọc trai và hoa giả. Nhiều món mượn miễn phí khi thuê áo, số còn lại thuê riêng.",
    price: "Từ 20.000đ/món",
    subs: ["Quạt", "Nón, mấn", "Trâm, bông tai", "Túi, hoa"],
    notes: [
      ["Mượn miễn phí", "Nón lá, quạt tre, túi cói, hoa giả đi kèm áo không tính tiền."],
      ["Thuê riêng", "Mấn nhung, trâm vàng, túi ngọc trai thuê riêng từ 20.000đ."],
      ["Gợi ý phối", "Nhân viên gợi ý phụ kiện hợp màu áo ngay khi bạn thử đồ."],
    ],
    faq: [
      { q: "Làm mất phụ kiện thì sao?", a: "Phụ kiện mượn miễn phí làm mất bồi thường theo giá niêm yết, từ 30.000đ đến 150.000đ." },
      { q: "Có bán phụ kiện không?", a: "Có bán quạt xếp và hoa giả. Các món còn lại chỉ cho thuê." },
      { q: "Có thuê riêng phụ kiện không cần thuê áo?", a: "Có, giá thuê riêng cộng thêm 20% và cần đặt cọc bằng giá trị món đồ." },
    ],
  },
];
