/* Thực đơn tiệc cưới, giá cho 1 bàn 10 khách, đã gồm VAT. Dữ liệu mẫu. */
module.exports = [
  {
    key: "anh-nen", name: "Ánh Nến", price: 4390000, dishes: 7,
    note: "Thực đơn được đặt nhiều nhất cho tiệc trưa và tiệc ở sảnh Aube.",
    courses: [
      ["Khai vị", ["Súp cua gà xé, trứng cút", "Gỏi ngó sen tôm thịt, bánh phồng tôm"]],
      ["Món chính", ["Gà ta hấp lá chanh, muối tiêu chanh", "Tôm sú rang muối Hồng Kông", "Bò lúc lắc khoai tây, bánh bao chiên"]],
      ["Lẩu", ["Lẩu thái hải sản, bún tươi"]],
      ["Tráng miệng", ["Chè hạt sen long nhãn"]],
    ],
  },
  {
    key: "anh-trang", name: "Ánh Trăng", price: 5290000, dishes: 8, popular: true,
    note: "Cân bằng giữa món truyền thống và món Âu. Hai phần ba tiệc cưới tối chọn thực đơn này.",
    courses: [
      ["Khai vị", ["Súp bào ngư vi cá chay, nấm đông cô", "Gỏi bưởi tôm càng, mực một nắng"]],
      ["Món chính", ["Tôm càng nướng phô mai bơ tỏi", "Gà quay da giòn sốt me, xôi chiên phồng", "Bò Úc nướng tiêu xanh, rau củ nướng", "Cá chẽm hấp Hồng Kông"]],
      ["Lẩu", ["Lẩu nấm hải sản, mì trứng"]],
      ["Tráng miệng", ["Panna cotta chanh dây, trái cây theo mùa"]],
    ],
  },
  {
    key: "anh-duong", name: "Ánh Dương", price: 6490000, dishes: 9,
    note: "Nhiều hải sản hơn, có món bò Wagyu và tôm hùm baby.",
    courses: [
      ["Khai vị", ["Súp tóc tiên cua biển, trứng cá", "Salad cá hồi áp chảo sốt mè rang", "Chả giò hải sản sốt mayo"]],
      ["Món chính", ["Tôm hùm baby nướng bơ tỏi", "Bò Wagyu nướng đá, sốt nấm truffle", "Vịt quay Bắc Kinh cuốn bánh tráng", "Cá mú hấp xì dầu"]],
      ["Lẩu", ["Lẩu cua đồng hải sản, rau đồng"]],
      ["Tráng miệng", ["Bánh mousse xoài, chè khúc bạch"]],
    ],
  },
  {
    key: "hoang-kim", name: "Hoàng Kim", price: 7890000, dishes: 10,
    note: "Thực đơn của bếp trưởng, phục vụ từng phần cho khách, chỉ nhận ở sảnh Étoile và Soleil.",
    courses: [
      ["Khai vị", ["Súp bào ngư nguyên con", "Hàu Nhật nướng mỡ hành", "Gỏi cá hồi Na Uy, sốt cam"]],
      ["Món chính", ["Tôm hùm bông nướng phô mai", "Bò Wagyu A4 áp chảo, khoai nghiền", "Cua Cà Mau rang me", "Gà Đông Tảo hấp muối", "Cá tuyết Alaska sốt miso"]],
      ["Lẩu", ["Lẩu bào ngư sâm, nấm tuyết"]],
      ["Tráng miệng", ["Bánh tart dâu tây, sorbet vải"]],
    ],
  },
];
