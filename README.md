# SkillMD-BDSIDCORP 🚀

> **Bộ sưu tập SkillMD & Design Systems cao cấp dành cho AI Coding Assistants (Claude Code, Antigravity, Cursor, Continue, CodeArts, Forge).**

Kho lưu trữ này cung cấp hệ thống các kỹ năng (**Skills**) chuyên sâu nhằm tối ưu hóa năng lực thiết kế giao diện (UI/UX), tạo ảnh concept, sinh mã frontend chất lượng cao (Anti-slop), và nâng cấp trải nghiệm người dùng cho các dự án web/mobile hiện đại.

---

## 📑 Danh mục Skills & Hướng dẫn sử dụng

Dưới đây là danh sách chi tiết các skill được tích hợp trong thư mục [`.agents/skills/`](.agents/skills):

| STT | Tên Skill | Phân loại | Mục đích & Trọng tâm sử dụng |
|:---:|:---|:---:|:---|
| 1 | **`design-taste-frontend`** | *Frontend UI/UX* | **Bộ quy chuẩn thiết kế chống generic (Anti-slop)** cho Landing Page, Portfolio và Redesign. Tự động xác định tone & mood phù hợp, tránh layout rập khuôn của AI. |
| 2 | **`high-end-visual-design`** | *Design System* | **Quy chuẩn giao diện đẳng cấp Agency.** Định nghĩa chính xác typography, khoảng cách (spacing), hiệu ứng đổ bóng mềm (diffused shadow), cấu trúc card và micro-interactions tinh tế. |
| 3 | **`gpt-taste`** | *Motion & GSAP* | **Kỹ sư chuyển động & bố cục nâng cao.** Ứng dụng GSAP ScrollTrigger (pinning, stacking, scrubbing), bố cục Bento Grid không khe hở (gapless), cấu trúc AIDA chuẩn chuyển đổi. |
| 4 | **`minimalist-ui`** | *Editorial UI* | **Phong cách tối giản chuẩn tạp chí (Editorial/Workspace).** Tông màu đơn sắc ấm (warm monochrome), tương phản kiểu chữ sắc nét, layout phẳng không gradient/đổ bóng nặng. |
| 5 | **`industrial-brutalist-ui`** | *Brutalist UI* | **Phong cách Industrial Brutalism & Tactical Telemetry.** Giao diện mô phỏng bản thiết kế quân sự / kỹ thuật cơ khí, lưới nghiêm ngặt, hiệu ứng analog (scanlines, halftone, dither). |
| 6 | **`image-to-code`** | *Workflow / Code* | **Quy trình chuyển đổi từ ảnh thiết kế sang code.** Tự động phân tích ảnh layout chi tiết từng section và chuyển dịch chính xác sang HTML/CSS/JS mà không làm mất chất lượng. |
| 7 | **`imagegen-frontend-web`** | *Image Prompting* | **Tạo ảnh concept giao diện Web theo từng section.** Quy tắc nghiêm ngặt: tạo 1 ảnh ngang độc lập cho từng section (hero, features, stats, cta...) giúp model code bám sát thực tế. |
| 8 | **`imagegen-frontend-mobile`** | *Image Prompting* | **Tạo ảnh concept ứng dụng Mobile (iOS/Android).** Trình bày mockup màn hình trong khung điện thoại sang trọng với hierarchy rõ ràng, typography dễ đọc, layout chuẩn native. |
| 9 | **`brandkit`** | *Branding* | **Bộ nhận diện thương hiệu & Logo System.** Thiết kế moodboard, logo concept, bảng màu, typography guide và visual presentation cho thương hiệu đa phong cách (dark-tech, luxury, developer tool...). |
| 10 | **`redesign-existing-projects`** | *Refactor UI* | **Quy trình nâng cấp giao diện dự án có sẵn.** Thực hiện 3 bước chuẩn: *Scan* (rà soát mã nguồn) -> *Diagnose* (chẩn đoán điểm yếu AI/generic) -> *Fix* (tối ưu hóa thẩm mỹ mà không phá vỡ logic). |
| 11 | **`stitch-design-taste`** | *Google Stitch* | **Chuẩn hóa Semantic Design System cho Google Stitch.** Tạo file `DESIGN.md` chuẩn ngữ nghĩa, giúp AI agent của Stitch đọc hiểu bảng màu, bố cục và sinh giao diện chuẩn xác. |
| 12 | **`full-output-enforcement`** | *Prompt Quality* | **Chống cắt ngắn mã (Anti-truncation).** Bắt buộc AI sinh mã hoàn chỉnh 100%, nghiêm cấm các placeholder (như `// TODO: implement later`, `/* ...rest of code */`), tự động phân chia token an toàn. |
| 13 | **`design-taste-frontend-v1`** | *Legacy Frontend* | Phiên bản gốc v1 của `design-taste-frontend`, giữ lại cho các dự án cần tính tương thích ngược tuyệt đối. |

---

## 🛠️ Chi tiết từng Skill & Khi nào nên dùng

### 1. `design-taste-frontend` & `high-end-visual-design`
- **Khi nào dùng:** Bắt đầu tạo mới trang web, Landing page bán hàng, trang dịch vụ doanh nghiệp hoặc Portfolio cá nhân.
- **Lợi ích:** Loại bỏ các phong cách "AI rập khuôn" (như background tím gradient mờ ảo, card bo góc màu xám nhạt đơn điệu, font Inter mặc định), thay bằng bảng màu bespoke và typo cá tính.

### 2. `imagegen-frontend-web` & `imagegen-frontend-mobile`
- **Khi nào dùng:** Cần tạo visual concept trước khi bắt tay vào code.
- **Điểm đặc biệt:** Hướng dẫn AI tạo ảnh chia từng section riêng biệt theo tỉ lệ ngang (thay vì dồn tất cả vào một ảnh dài gây mất chi tiết), giúp lập trình viên tái hiện lại giao diện chuẩn xác 1:1.

### 3. `gpt-taste` (GSAP Motion Specialist)
- **Khi nào dùng:** Cần trang web có hiệu ứng cuộn mượt mà (smooth scrolling), hiệu ứng dính khung (pinning), cuộn lật trang (scrubbing animation), tạo cảm giác mượt mà và cao cấp như các trang của Apple hay Awwwards.

### 4. `redesign-existing-projects`
- **Khi nào dùng:** Bạn đã có sẵn một mã nguồn (Tailwind, Bootstrap, HTML/CSS thuần...) nhưng giao diện nhìn đơn điệu hoặc thiếu tính thẩm mỹ.
- **Nguyên tắc:** Nâng cấp lớp CSS và cấu trúc trình bày, tuyệt đối giữ nguyên logic JavaScript/API hiện hành.

### 5. `industrial-brutalist-ui` & `minimalist-ui`
- **Khi nào dùng:**
  - `industrial-brutalist-ui`: Các dự án kỹ thuật, cơ khí, telemetry, crypto terminal, dashboard mật độ dữ liệu cao.
  - `minimalist-ui`: Nền tảng quản lý tri thức, docs, ứng dụng ghi chú, trang blog tối giản mang phong cách editorial.

### 6. `stitch-design-taste`
- **Khi nào dùng:** Tích hợp với công cụ [Google Stitch](https://labs.google/stitch) để tạo tài liệu chuẩn `DESIGN.md`, giúp quy chuẩn hóa phong cách thiết kế xuyên suốt toàn bộ các màn hình.

---

## 📁 Cấu trúc Thư mục Repository

```text
SkillMD-BDSIDCORP/
├── .agents/
│   └── skills/                 # Thư mục gốc chứa 13 skills chuẩn
│       ├── brandkit/
│       ├── design-taste-frontend/
│       ├── full-output-enforcement/
│       ├── gpt-taste/
│       ├── high-end-visual-design/
│       ├── industrial-brutalist-ui/
│       ├── minimalist-ui/
│       ├── redesign-existing-projects/
│       └── ...
├── .claude/ .codeartsdoer/ .codestudio/ .continue/ .forge/ .mcpjam/
│                               # skills/ mirror cho từng công cụ AI (symlink tới .agents/skills
│                               # trên máy gốc; git lưu thành bản sao, sửa skill phải khớp cả 7)
├── frontend-themes/
│   ├── CLAUDE.md               # Quy chuẩn giao diện cho mọi site (ưu tiên hơn skill)
│   └── giao-duc/ dich-vu-chuyen-nghiep/ cong-nghe-phan-mem/   # DESIGN/PLAN nháp cũ, chỉ tham khảo
├── website/                    # 12 site hoàn chỉnh, xem website/README.md
│   ├── CLAUDE.md               # Nạp frontend-themes/CLAUDE.md khi làm việc trong website/
│   ├── 3DRoom-dichvu/  K-Lab's-dichvu/  Luimiere-dichvu/  Nhatanthoi-dichvu/
│   ├── AttackK-congnghe/  BeatBeat-congnghe/  Langkinh-congnghe/
│   ├── BBE-giaoduc/  ISZ-giaoduc/  Phimdan-giaoduc/  CongthongtinNeu/
│   └── VN-Nikko-cokhi/
├── CLAUDE.md                   # Ghi chú cho Claude Code ở cấp repo
├── skills-lock.json            # Nguồn upstream + hash của từng skill
└── README.md                   # Tài liệu hướng dẫn này
```

---

## 🚀 Cách kích hoạt Skill trong các môi trường AI

### 1. Claude Code / Antigravity / Cursor
Các skill được đặt trong `.agents/skills/<tên-skill>/SKILL.md`. Khi làm việc với Assistant, bạn chỉ cần yêu cầu:
- *"Hãy sử dụng skill `design-taste-frontend` để thiết kế lại trang chủ."*
- *"Áp dụng `gpt-taste` thêm animation cuộn GSAP cho các section."*
- *"Dùng skill `imagegen-frontend-web` để lên prompt sinh ảnh giao diện từng section."*

### 2. Tự động kích hoạt (Auto-invocation)
Mỗi skill đều có định dạng chuẩn YAML frontmatter:
```yaml
---
name: high-end-visual-design
description: Teaches the AI to design like a high-end agency...
---
```
AI Assistant sẽ tự động phát hiện và kích hoạt kỹ năng tương ứng khi gặp ngữ cảnh công việc liên quan.

Ngoại lệ: 7 skill có `disable-model-invocation: true` vì không hợp với dự án HTML thuần, không có công cụ sinh ảnh
(`image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`, `design-taste-frontend-v1`,
`gpt-taste`, `stitch-design-taste`). Chúng chỉ chạy khi gọi rõ tên, ví dụ `/gpt-taste`.

`design-taste-frontend` và `high-end-visual-design` đã được sửa so với bản gốc Leonxlnx/taste-skill (hero archetype,
header/footer, điều hướng 2 chế độ, cấm monogram). Đồng bộ lại từ upstream sẽ mất các chỉnh sửa này.

---

## 🤝 Đóng góp & Phát triển
Mọi đóng góp nhằm hoàn thiện các skill hoặc bổ sung template website mới đều được hoan nghênh. Vui lòng tạo Pull Request hoặc Issue trên [GitHub Repository](https://github.com/Lebao1234/SkillMD-BDSIDCORP).
