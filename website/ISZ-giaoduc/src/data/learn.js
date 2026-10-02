// Dữ liệu cho công cụ học: ô chữ điền (trang chủ), thẻ từ và bộ thủ (thư viện), bài kiểm tra trình độ.
module.exports = {
  // Ô chữ điền ở trang chủ: chữ, pinyin, âm Hán Việt, nghĩa, số nét
  pad: [
    { c: "学", py: "xué", hv: "học", vi: "học", strokes: 8 },
    { c: "中", py: "zhōng", hv: "trung", vi: "giữa, Trung Quốc", strokes: 4 },
    { c: "你", py: "nǐ", hv: "nễ", vi: "bạn", strokes: 7 },
    { c: "好", py: "hǎo", hv: "hảo", vi: "tốt, khỏe", strokes: 6 },
    { c: "爱", py: "ài", hv: "ái", vi: "yêu", strokes: 10 },
    { c: "永", py: "yǒng", hv: "vĩnh", vi: "mãi mãi, đủ 8 nét cơ bản", strokes: 5 },
  ],
  tones: [
    { n: 1, name: "Thanh 1", c: "妈", py: "mā", vi: "mẹ", like: "Giống thanh ngang nhưng cao và giữ đều hơi", d: "M8 12 L92 12", pitch: "55" },
    { n: 2, name: "Thanh 2", c: "麻", py: "má", vi: "cây gai, tê", like: "Giống thanh sắc: đi lên từ giữa", d: "M8 52 L92 12", pitch: "35" },
    { n: 3, name: "Thanh 3", c: "马", py: "mǎ", vi: "con ngựa", like: "Giống thanh hỏi: xuống thấp rồi lên", d: "M8 62 Q40 98 92 30", pitch: "214" },
    { n: 4, name: "Thanh 4", c: "骂", py: "mà", vi: "mắng", like: "Như thanh huyền nhưng rơi nhanh, dứt khoát", d: "M8 12 L92 88", pitch: "51" },
  ],
  decks: [
    { key: "chao-hoi", name: "Chào hỏi", cards: [["你好", "nǐ hǎo", "xin chào"], ["谢谢", "xièxie", "cảm ơn"], ["不客气", "bú kèqi", "không có gì"], ["对不起", "duìbuqǐ", "xin lỗi"], ["没关系", "méi guānxi", "không sao"], ["再见", "zàijiàn", "tạm biệt"], ["请问", "qǐngwèn", "xin hỏi"], ["早上好", "zǎoshang hǎo", "chào buổi sáng"]] },
    { key: "so-dem", name: "Số đếm", cards: [["一", "yī", "một"], ["二", "èr", "hai"], ["三", "sān", "ba"], ["四", "sì", "bốn"], ["五", "wǔ", "năm"], ["十", "shí", "mười"], ["百", "bǎi", "trăm"], ["千", "qiān", "nghìn"]] },
    { key: "gia-dinh", name: "Gia đình", cards: [["爸爸", "bàba", "bố"], ["妈妈", "māma", "mẹ"], ["哥哥", "gēge", "anh trai"], ["姐姐", "jiějie", "chị gái"], ["弟弟", "dìdi", "em trai"], ["妹妹", "mèimei", "em gái"], ["爷爷", "yéye", "ông nội"], ["奶奶", "nǎinai", "bà nội"]] },
    { key: "an-uong", name: "Ăn uống", cards: [["米饭", "mǐfàn", "cơm"], ["面条", "miàntiáo", "mì sợi"], ["茶", "chá", "trà"], ["水", "shuǐ", "nước"], ["咖啡", "kāfēi", "cà phê"], ["好吃", "hǎochī", "ngon"], ["买单", "mǎidān", "tính tiền"], ["菜单", "càidān", "thực đơn"]] },
    { key: "cong-so", name: "Công sở", cards: [["公司", "gōngsī", "công ty"], ["开会", "kāihuì", "họp"], ["同事", "tóngshì", "đồng nghiệp"], ["老板", "lǎobǎn", "sếp, chủ"], ["合同", "hétong", "hợp đồng"], ["报价", "bàojià", "báo giá"], ["发邮件", "fā yóujiàn", "gửi email"], ["出差", "chūchāi", "đi công tác"]] },
  ],
  radicals: [
    ["氵", "thủy", "nước", "河 海 洗"], ["木", "mộc", "cây", "林 树 桌"], ["口", "khẩu", "miệng", "吃 喝 叫"], ["亻", "nhân", "người", "你 他 住"],
    ["女", "nữ", "phụ nữ", "妈 姐 好"], ["忄", "tâm", "tim, tình cảm", "忙 快 怕"], ["扌", "thủ", "tay", "打 拿 找"], ["讠", "ngôn", "lời nói", "说 话 语"],
    ["日", "nhật", "mặt trời", "明 早 时"], ["月", "nguyệt", "trăng, thịt", "朋 服 脸"], ["艹", "thảo", "cỏ", "花 茶 菜"], ["钅", "kim", "kim loại", "钱 银 铁"],
  ],
  // Bài kiểm tra: a = vị trí đáp án đúng (0 - 3)
  quiz: [
    { lv: "HSK 1", q: "“你好” nghĩa là gì?", o: ["Cảm ơn", "Xin chào", "Tạm biệt", "Xin lỗi"], a: 1 },
    { lv: "HSK 1", q: "Chữ nào nghĩa là “người”?", o: ["大", "入", "人", "天"], a: 2, zh: true },
    { lv: "HSK 1", q: "“我是越南人。” nghĩa là:", o: ["Tôi là người Việt Nam.", "Tôi sống ở Việt Nam.", "Tôi đi Việt Nam.", "Tôi yêu Việt Nam."], a: 0 },
    { lv: "HSK 2", q: "“三十八” là số nào?", o: ["83", "308", "3,8", "38"], a: 3 },
    { lv: "HSK 2", q: "Điền vào chỗ trống: 我很 ___ 喝咖啡。(Tôi rất thích uống cà phê)", o: ["喜欢", "欢迎", "高兴", "认识"], a: 0, zh: true },
    { lv: "HSK 2", q: "“他比我高。” nghĩa là:", o: ["Tôi cao hơn anh ấy.", "Anh ấy cao hơn tôi.", "Anh ấy cao bằng tôi.", "Anh ấy không cao."], a: 1 },
    { lv: "HSK 3", q: "Câu nào đúng ngữ pháp?", o: ["我昨天很忙了。", "我昨天了很忙。", "我昨天很忙。", "我了昨天很忙。"], a: 2, zh: true },
    { lv: "HSK 3", q: "“请你把门关上。” nghĩa là:", o: ["Bạn đóng cửa lại giúp nhé.", "Bạn mở cửa ra giúp nhé.", "Cửa đã đóng rồi.", "Bạn đứng ở cửa nhé."], a: 0 },
    { lv: "HSK 3", q: "Điền vào chỗ trống: 我学汉语学 ___ 两年了。", o: ["过", "着", "的", "了"], a: 3, zh: true },
    { lv: "HSK 4", q: "“尽管下雨，他还是来了。” nghĩa là:", o: ["Vì trời mưa nên anh ấy đến.", "Dù trời mưa, anh ấy vẫn đến.", "Nếu trời mưa, anh ấy sẽ đến.", "Trời mưa nên anh ấy không đến."], a: 1 },
    { lv: "HSK 4", q: "Từ nào gần nghĩa nhất với “马上”?", o: ["慢慢", "已经", "立刻", "以后"], a: 2, zh: true },
    { lv: "HSK 5", q: "“这个方案有待进一步完善。” nghĩa là:", o: ["Phương án này đã hoàn hảo.", "Phương án này bị hủy.", "Phương án này đang chờ ký duyệt.", "Phương án này cần được hoàn thiện thêm."], a: 3 },
  ],
};
