/* Bài viết. catKey: huong-dan | cong-nghe | du-an. Sinh trang <slug>.html qua src/templates/post.js */
module.exports = [
  {
    slug: "gia-in-3d-tinh-the-nao",
    title: "Giá in 3D được tính thế nào và 5 cách giảm chi phí",
    cat: "Hướng dẫn", catKey: "huong-dan", date: "18/09/2026", read: 6,
    image: "blog-laptop.jpg", author: "Nguyễn Đức Minh, kỹ sư sản xuất",
    excerpt: "Cùng một file, báo giá có thể chênh nhau gấp ba. Hiểu 3 yếu tố quyết định giá giúp bạn tối ưu từ lúc thiết kế.",
    body: `
<p>Khách hay hỏi vì sao hai chiếc cốc cùng kích thước lại có giá chênh nhau gấp ba. Câu trả lời nằm ở công nghệ, vật liệu và lượng nhựa thực sự nằm trong chi tiết.</p>
<h2 id="ba-yeu-to">Ba yếu tố quyết định giá</h2>
<p><strong>Công nghệ:</strong> FDM rẻ nhất, SLA đắt hơn khoảng 4-5 lần mỗi gram vì resin và công đoạn rửa, sấy. SLM kim loại thường được báo giá theo từng file.</p>
<p><strong>Vật liệu:</strong> PLA rẻ nhất trong nhóm sợi nhựa. Nylon sợi carbon hay resin trong đắt gấp đôi, gấp ba.</p>
<p><strong>Khối lượng và thời gian máy:</strong> giá tính theo gram sau khi gỡ đỡ, nhưng chi tiết rất cao sẽ chiếm máy lâu hơn và có thể cộng thêm phí giờ máy.</p>
<h2 id="giam-chi-phi">5 cách giảm chi phí ngay từ file</h2>
<ul>
<li>Làm rỗng mô hình trưng bày với thành dày 2-3 mm thay vì in đặc.</li>
<li>Giảm độ đặc (infill) xuống 15-20% với chi tiết không chịu lực.</li>
<li>Xoay mô hình để giảm cấu trúc đỡ, vì đỡ cũng tốn nhựa và công gỡ.</li>
<li>Gộp nhiều chi tiết nhỏ vào một lần in để chia phí vận hành.</li>
<li>Chỉ dùng SLA cho phần cần độ mịn, phần còn lại in FDM rồi ghép.</li>
</ul>
<blockquote><p>Gửi file sớm để kỹ sư góp ý. Một chỉnh sửa nhỏ về độ dày thành có thể giảm 30% chi phí mà không ảnh hưởng hình dáng.</p></blockquote>
<h2 id="uoc-tinh">Tự ước tính trước khi gửi file</h2>
<p>Bạn có thể dùng công cụ ước tính trên trang Bảng giá: chọn công nghệ, vật liệu và khối lượng dự kiến để biết khoảng giá trước khi liên hệ.</p>`,
  },
  {
    slug: "chon-fdm-hay-sla",
    title: "FDM hay SLA: chọn công nghệ nào cho mẫu của bạn",
    cat: "Công nghệ", catKey: "cong-nghe", date: "09/09/2026", read: 5,
    image: "blog-cam.jpg", author: "Trần Thu Hương, kỹ sư ứng dụng",
    excerpt: "Một bảng so sánh ngắn và 4 câu hỏi giúp bạn chọn đúng công nghệ ngay lần đầu, không phải in lại.",
    body: `
<p>FDM và SLA là hai công nghệ được đặt nhiều nhất tại 3DRoom. Chúng khác nhau ở cách tạo lớp, nên cũng khác nhau ở độ mịn, độ bền và giá.</p>
<h2 id="khac-nhau">Khác nhau ở đâu</h2>
<p>FDM đùn sợi nhựa nóng chảy, lớp dày 0,1-0,3 mm, nhìn thấy vân. SLA dùng tia sáng làm đông resin lỏng, lớp chỉ 0,05 mm nên bề mặt gần như trơn láng.</p>
<h2 id="bon-cau-hoi">4 câu hỏi để chọn</h2>
<ul>
<li>Chi tiết có lớn hơn 30 cm không? Nếu có, chọn FDM.</li>
<li>Có chữ nổi, hoa văn nhỏ dưới 1 mm không? Nếu có, chọn SLA.</li>
<li>Chi tiết có chịu va đập hay lắp vào máy thật không? Ưu tiên FDM với PETG hoặc SLA Tough.</li>
<li>Ngân sách có giới hạn chặt không? FDM rẻ hơn nhiều lần.</li>
</ul>
<h2 id="ket-hop">Kết hợp cả hai</h2>
<p>Nhiều dự án dùng FDM cho thân lớn và SLA cho phần mặt, logo hoặc chi tiết tinh, sau đó ghép và sơn chung một lớp màu.</p>`,
  },
  {
    slug: "chuan-bi-file-stl",
    title: "Chuẩn bị file STL đúng chuẩn trước khi gửi in",
    cat: "Hướng dẫn", catKey: "huong-dan", date: "27/08/2026", read: 4,
    image: "blog-flatlay.jpg", author: "Nguyễn Đức Minh, kỹ sư sản xuất",
    excerpt: "Lưới hở, thành quá mỏng, sai đơn vị. Ba lỗi làm chậm đơn hàng nhiều nhất và cách kiểm tra trong 5 phút.",
    body: `
<p>Khoảng 1/3 file chúng tôi nhận được cần sửa trước khi in. Phần lớn chỉ là vài lỗi quen thuộc bạn tự kiểm tra được.</p>
<h2 id="don-vi">Kiểm tra đơn vị</h2>
<p>STL không lưu đơn vị. Nếu bạn thiết kế theo inch mà máy đọc theo mm, chi tiết sẽ nhỏ đi 25 lần. Ghi rõ kích thước tổng khi gửi file.</p>
<h2 id="luoi-kin">Lưới phải kín</h2>
<p>Mô hình phải là một khối kín, không có lỗ hở trên bề mặt hay mặt chồng lên nhau. Các phần mềm miễn phí như Meshmixer có chức năng kiểm tra và vá tự động.</p>
<h2 id="do-day">Độ dày thành tối thiểu</h2>
<ul>
<li>FDM: tối thiểu 1,2 mm.</li>
<li>SLA: tối thiểu 0,6 mm.</li>
<li>SLS: tối thiểu 0,8 mm, khe hở chuyển động 0,4 mm.</li>
</ul>
<blockquote><p>Nếu có file gốc STEP, hãy gửi kèm. Kỹ sư sửa file STEP nhanh và chính xác hơn sửa lưới STL.</p></blockquote>`,
  },
  {
    slug: "mo-hinh-sa-ban-du-an",
    title: "Sa bàn dự án tỷ lệ 1:200 hoàn thành trong 9 ngày",
    cat: "Dự án", catKey: "du-an", date: "12/08/2026", read: 5,
    image: "kt-nha-tho.jpg", author: "Phạm Quang Huy, trưởng xưởng",
    excerpt: "Hơn 300 chi tiết in SLA và FDM, sơn trắng mờ, lắp đèn LED. Nhìn lại cách xưởng chia việc để kịp ngày ra mắt.",
    body: `
<p>Một chủ đầu tư cần sa bàn khu nhà ở để trưng bày tại sự kiện mở bán, chỉ còn 9 ngày. Đây là cách xưởng chia việc để kịp tiến độ.</p>
<h2 id="chia-file">Chia file theo công nghệ</h2>
<p>Các tòa nhà có ban công và lan can nhỏ được in SLA. Nền địa hình, đường và mảng cây in FDM khổ lớn để tiết kiệm thời gian.</p>
<h2 id="chay-song-song">Chạy song song 22 máy</h2>
<p>File được xếp khay trong đêm đầu tiên. 22 máy chạy liên tục 4 ngày, mỗi sáng kỹ thuật viên kiểm tra và in bù chi tiết lỗi.</p>
<h2 id="hoan-thien">Hoàn thiện và lắp đèn</h2>
<p>Toàn bộ chi tiết được sơn trắng mờ để giữ phong cách mô hình kiến trúc, lắp đèn LED ấm bên trong các tòa nhà và giao lắp đặt tại sự kiện trước 1 ngày.</p>`,
  },
];
