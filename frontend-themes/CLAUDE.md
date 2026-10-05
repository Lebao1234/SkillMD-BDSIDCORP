# Multi-Theme Frontend Project — CLAUDE.md

## Project Overview
Build nhiều giao diện HTML/CSS/JS cho 3 chủ đề doanh nghiệp:
- **Giáo dục** (`giao-duc/`) — EdTech, trường học, khóa học, nền tảng học tập
- **Dịch vụ chuyên nghiệp** (`dich-vu-chuyen-nghiep/`) — Tư vấn, luật, tài chính, y tế
- **Công nghệ phần mềm** (`cong-nghe-phan-mem/`) — SaaS, agency, startup, developer tools

## Mục tiêu giao diện
- Bán hàng + giới thiệu doanh nghiệp (không phải dashboard)
- UI/UX chuẩn enterprise — KHÔNG trông giống AI generic
- Mỗi interface có phong cách thị giác riêng biệt
- SEO-ready ngay từ đầu
- Ảnh thực/gen AI — không dùng placeholder div giả

---

## PLANNING HARNESS (superpowers-inspired)
Trước khi viết bất kỳ dòng code nào, bắt buộc phải:

1. **Đọc DESIGN.md** của theme đang build
2. **Khai báo Design Read** theo format:
   > "Reading this as: [page kind] for [audience], with [vibe] language, leaning toward [aesthetic family]."
3. **Set 3 dials:**
   - `DESIGN_VARIANCE` (1-10)
   - `MOTION_INTENSITY` (1-10)
   - `VISUAL_DENSITY` (1-10)
4. **Liệt kê sections** sẽ có trong trang
5. **Khai báo palette** (max 1 accent, base neutral)
6. **Khai báo font** (KHÔNG dùng Inter, KHÔNG dùng Fraunces mặc định)
7. **Viết copywriting outline** trước khi code

---

## DESIGN ANTI-PATTERNS (BANNED)
> Những thứ này sẽ làm giao diện trông AI generic — TUYỆT ĐỐI KHÔNG DÙNG

- ❌ Fake monogram / letter-box avatar trong dropdown (`[T]`, `[X]`, `[G]` - `.drop-code`). Trông gượng gạo, giả tạo và phi thực tế.
- ❌ Dropdown rườm rà trên trang giới thiệu doanh nghiệp / dịch vụ / portfolio khi chỉ có 1-2 liên kết con (dùng Flat Clean Nav).
- ❌ Inter font làm font chính cho landing premium
- ❌ AI Purple / Blue glow gradient
- ❌ Centered hero với dark mesh background
- ❌ 3 equal feature cards ngang hàng
- ❌ Generic glassmorphism mọi nơi
- ❌ Eyebrow label trên MỌI section header
- ❌ Alternating left-right zigzag quá 2 lần
- ❌ Div-based fake screenshots / placeholder shapes
- ❌ "Elevate", "Seamless", "Unleash", "Next-Gen" trong copy
- ❌ Pure black `#000000`
- ❌ Emoji trong UI
- ❌ Fraunces / Instrument_Serif làm default display font
- ❌ Fake-precise numbers (92%, 4.1×, 48k không có data thật)
- ❌ Split-header pattern (big left headline + small right paragraph)
- ❌ h-screen (dùng min-h-[100dvh])

---

## TYPOGRAPHY RULES
```
Display: Geist Display | Satoshi | Cabinet Grotesk | Outfit | PP Neue Montreal
Body: Geist | Satoshi | DM Sans | Plus Jakarta Sans
Mono: Geist Mono | JetBrains Mono | IBM Plex Mono
```
- Heading: `text-4xl md:text-6xl tracking-tighter leading-none`
- Body: `text-base leading-relaxed max-w-[65ch] text-[neutral-600]`
- Hero headline: max 2 dòng ở desktop, max 6 chữ thì dùng `text-7xl`

---

## COLOR RULES
- Max 1 accent color, saturation < 80%
- Neutral base: Zinc / Slate / Stone (KHÔNG mix warm/cool gray)
- Accent rotation cho từng theme — KHÔNG trùng nhau:
  - **Giáo dục:** Deep Cobalt `#1B4FD8` trên Slate base
  - **Dịch vụ chuyên nghiệp:** Forest Green `#166534` trên Stone base
  - **Công nghệ phần mềm:** Electric Indigo `#4F46E5` trên Zinc base (với dark-mode default)
- Shadow phải được tint theo màu background — KHÔNG pure black shadow

---

## LAYOUT & HERO DIVERSIFICATION (LUÂN PHIÊN BỐ CỤC HERO)
- **KHÔNG lặp lại kiểu 2 cột (Left text / Right collage) cho mọi website.** Bắt buộc luân phiên áp dụng 5 Archetypes Hero phù hợp với từng ngành:
  1. **Archetype 1 - Full-width Carousel / Image Slider Hero:**
     - *Phù hợp nhất:* Thời trang, cho thuê đồ (như áo dài, váy cưới), studio nhiếp ảnh, bất động sản, resort/khách sạn, showroom ô tô/xe máy, e-commerce bán lẻ.
     - *Đặc điểm:* Tràn viền (Full-width), 2–4 slide chuyển động mượt mà (smooth cross-fade hoặc drag), ảnh lớn tỉ lệ 16:9 hoặc 21:9, typography đè lên ảnh kèm lớp phủ gradient vignette mềm, thanh điều hướng dạng progress bar hoặc mũi tên tối giản (KHÔNG dùng chấm tròn to thô).
  2. **Archetype 2 - Centered Immersive / Cinematic Hero (Đè nền điện ảnh):**
     - *Phù hợp nhất:* Công nghệ, SaaS, giải pháp giáo dục EdTech, sự kiện, phim ảnh.
     - *Đặc điểm:* Tiêu đề căn giữa uy lực (max 2 dòng), subtext cô đọng, nút CTA pill nổi bật, nền là ảnh hoặc video chất lượng cao với lớp phủ tối dần (cinematic overlay).
  3. **Archetype 3 - Bento Grid Hero (Bố cục Bento đa chức năng mở đầu):**
     - *Phù hợp nhất:* Công nghệ phần mềm, startup, app tiện ích, agency số.
     - *Đặc điểm:* Khối chính chứa tiêu đề + CTA, bao quanh bởi 2-3 ô bento phụ hiển thị tính năng độc đáo, video demo nhỏ, hoặc con số ấn tượng.
  4. **Archetype 4 - Editorial Manifesto / Minimalist Hero:**
     - *Phù hợp nhất:* Doanh nghiệp tư vấn cấp cao, luật, kiến trúc, tài chính.
     - *Đặc điểm:* Tiêu đề cực lớn mang tính tuyên ngôn (Manifesto), typography sắc sảo, bố cục thoáng đãng giàu khoảng trắng.
  5. **Archetype 5 - Asymmetric Split Hero (2 cột bất đối xứng):**
     - *Phù hợp nhất:* Giới thiệu dịch vụ kỹ thuật, cơ khí, y tế khi cần đặt text song song với 1 hình ảnh minh họa duy nhất.
- Grid > Flexbox math (KHÔNG `calc(33% - 1rem)`)
- Max-width: `max-w-[1400px] mx-auto` hoặc `max-w-7xl`
- Hero top padding: max `pt-24` (6rem)
- Hero: tối đa 4 text elements (eyebrow + headline + subtext + CTA)
- Bento: ĐÚNG số cell với nội dung, không cell trống

---

## NAVIGATION ARCHITECTURE (DUAL-MODE STRATEGY)
> Tuân thủ nghiêm ngặt 2 phong cách điều hướng thực tế tùy theo loại trang, tuyệt đối không tạo dropdown giả lập chữ cái `[T]`, `[X]`, `[G]`:

### HEADER GEOMETRY (LUÂN PHIÊN SONG SONG GIỮA BO TRÒN VÀ KHÔNG BO TRÒN)
- **Kiểu A - Header Bo Tròn (Floating Rounded Pill / Island Header):**
  - *Đặc điểm:* Thanh navbar độc lập, nổi lơ lửng cách mép trên màn hình (`mt-4` đến `mt-6`, `mx-auto`, `w-max` hoặc `max-w-6xl`), bo góc viên thuốc mềm mại (`rounded-full` hoặc `rounded-2xl`), nền kính mờ (`backdrop-blur-md bg-white/80` hoặc `bg-neutral-900/80`), viền mỏng hairline (`ring-1 ring-black/5` hoặc `border border-white/10`).
  - *Phù hợp nhất:* Ứng dụng công nghệ, AI, Startup hiện đại, Mobile-first, Sản phẩm sáng tạo, Portfolio cá nhân.
- **Kiểu B - Header Không Bo Tròn (Full-width Edge-to-Edge Straight Header):**
  - *Đặc điểm:* Thanh navbar phẳng chạy suốt toàn bộ chiều ngang màn hình (`w-full`, `rounded-none`, `top-0`, sticky hoặc fixed), góc cạnh vuông vắn sắc nét (`border-b border-neutral-200 dark:border-neutral-800`), nội dung bên trong được căn theo khung lưới chuẩn (`max-w-7xl mx-auto px-6` hoặc `1400px`).
  - *Phù hợp nhất:* Công nghiệp, Cơ khí, Bán lẻ / E-commerce quy mô lớn, Doanh nghiệp truyền thống, Tập đoàn tài chính, Tạp chí thời trang cao cấp (Editorial Luxury), Kiến trúc & Xây dựng.

### CHẾ ĐỘ 1: Trang Giới thiệu Doanh nghiệp / Dịch vụ / Portfolio (FLAT CLEAN NAV - KHÔNG DÙNG DROPDOWN)
- **Bản chất:** Các trang giới thiệu, tư vấn, dịch vụ thường chỉ có vài trang con. Không dùng dropdown để giấu link.
- **Cấu trúc:** Thanh điều hướng phẳng 1 dòng duy nhất trên desktop (chiều cao 64–72px, max 80px).
  ```text
  [Logo Thương Hiệu] -------- [Trang chủ] [Về chúng tôi] [Dịch vụ / Giải pháp] [Dự án] [Tin tức] [Liên hệ] -------- [CTA: Nhận tư vấn / Báo giá]
  ```
- **Hành vi:**
  - Mỗi liên kết là text link rõ ràng, click là chuyển trang đích hoặc cuộn mượt đến section tương ứng.
  - Active state: gạch chân tinh tế hoặc nền pill siêu nhẹ (`bg-neutral-100` / `bg-white/10`).
  - Mobile (< 1024px): Hamburger menu mở full-screen overlay với hiệu ứng stagger-fade cho các link lớn.

### CHẾ ĐỘ 2: Cửa hàng / Bán hàng / Catalog đa dạng sản phẩm (REALISTIC MEGA-DROPDOWN WIDTH 80%)
- **Bản chất:** Áp dụng khi có nhiều danh mục sản phẩm, biến thể hoặc bộ sưu tập (E-commerce, Tech Store, Thời trang, Thiết bị...).
- **Độ rộng:** Container dropdown chiếm **80% độ rộng màn hình** (`width: min(85vw, 1200px)` hoặc `w-[80vw]`), căn giữa theo viewport hoặc neo trực tiếp dưới header.
- **Bố cục bên trong (Layout 3-4 cột chuẩn thương mại điện tử thực tế):**
  1. **Cột 1 - Phân loại / Danh mục con (Category Column, 20-25%):**
     - Liệt kê các nhóm sản phẩm (VD: Máy ảnh Mirrorless, Ống kính góc rộng, Phụ kiện...).
     - Link chữ rõ ràng kèm hover highlight tinh tế, KHÔNG dùng badge ô vuông.
  2. **Cột 2 & 3 - Lưới Sản phẩm trực quan (Product Visual Grid, 50-55%):**
     - Hiển thị 3–4 sản phẩm tiêu biểu trực tiếp trong dropdown.
     - Mỗi sản phẩm gồm:
       - **Ảnh thumbnail thực tế (1:1 hoặc 4:3)**: Ảnh sản phẩm rõ nét trên nền trung tính, có bo góc nhẹ.
       - **Tên sản phẩm**: In đậm, chuẩn typography (VD: *Fujifilm X-T50*, *Sony A7C II*).
       - **Giá hoặc nhãn phân khúc**: VD: *28.990.000₫* hoặc nhãn nhỏ `New` / `Best-seller`.
  3. **Cột 4 - Featured Promo Card / Dòng chủ lực (20-25%):**
     - 1 card ảnh banner nổi bật quảng bá dòng sản phẩm mới nhất hoặc chương trình mùa lễ.
     - Kèm 1 CTA ngắn: *"Khám phá ngay →"*.
  4. **Footer Strip (Dải đáy menu):**
     - Thanh viền mảnh 1px ngăn cách ở đáy: *"Xem toàn bộ [N] sản phẩm trong bộ sưu tập →"*.
- **Cấm kỵ:** Tuyệt đối KHÔNG dùng ô vuông chữ cái viết tắt (`.drop-code`) như `T`, `X`, `G`. Bắt buộc dùng hình ảnh sản phẩm thật hoặc icon SVG nét mảnh.

---

## IMAGE STRATEGY
**Priority order:**
1. `generate_image` tool — tạo ảnh AI theo brief của section
2. `firecrawl scrape` — lấy ảnh từ website tham khảo
3. `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` — placeholder có nghĩa
4. KHÔNG bao giờ dùng div-box làm "fake product screenshot"

**Workflow sinh ảnh:**
```
firecrawl search "[ngành] website design reference" → 
scrape top 3 URLs → 
extract visual style info → 
generate_image với brief từ data crawled
```

---

## COPYWRITING RULES
- Headline: max 8 chữ, action-oriented
- Subtext: max 20 chữ, max 4 dòng, rõ value prop
- CTA: max 3 chữ, một CTA per intent trên toàn trang
- KHÔNG: "Khám phá ngay", "Giải pháp toàn diện", "Đồng hành cùng bạn" (generic AI copy)
- MỖI section: viết copy real trước, rồi mới code layout

---

## SEO CHECKLIST (mandatory trước khi declare done)
```html
<!-- Mỗi trang phải có: -->
<title>[Từ khóa chính] | [Tên thương hiệu]</title>
<meta name="description" content="[150-160 ký tự, chứa từ khóa]">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">
<link rel="canonical" href="...">
<!-- Semantic HTML: h1 (1 cái), h2, h3, alt text cho ảnh -->
<!-- Schema.org: Organization / LocalBusiness / Course tùy loại -->
```

---

## WORKFLOW PER INTERFACE

```
STEP 1: Research
  → firecrawl search "[niche] landing page [country/region]"
  → scrape 2-3 trang tham khảo tốt nhất
  → extract: màu, font, layout pattern, copy tone

STEP 2: Design System
  → Đọc DESIGN.md của theme
  → Khai báo Design Read
  → Set dials VARIANCE/MOTION/DENSITY
  → Confirm palette + font stack

STEP 3: Copywriting
  → Viết outline: headline, subtext, section headers, CTAs
  → Tự audit: loại bỏ AI clichés, giữ lại specific & concrete

STEP 4: Generate Images
  → generate_image cho: hero visual, section background, product/service shots
  → Aspect ratio phù hợp từng section

STEP 5: Build HTML/CSS/JS
  → Semantic HTML first
  → CSS custom properties cho design tokens
  → JS chỉ khi cần animation/interaction thực sự

STEP 6: SEO Audit
  → Kiểm tra SEO checklist ở trên
  → Playwright screenshot desktop + mobile

STEP 7: Polish
  → Kiểm tra contrast ratio (WCAG AA)
  → Test mobile collapse
  → Kiểm tra CTA không wrap
```

---

## TECH STACK (thuần HTML/CSS/JS)
```
HTML: Semantic HTML5, KHÔNG framework
CSS:  Custom Properties (tokens), Grid + Flexbox
JS:   Vanilla JS, GSAP (nếu cần scroll animation)
Fonts: Google Fonts self-hosted hoặc CDN với display=swap
Icons: Phosphor Icons CDN
```

---

## TOOLS AVAILABLE
- `firecrawl` — web research, crawl reference sites
- `generate_image` — tạo ảnh AI theo mô tả
- `playwright-mcp` — screenshot, browser testing
- `github-mcp` — version control
- `design-taste-frontend` skill — anti-slop design rules
- `stitch-design-taste` skill — DESIGN.md generation

---

## FILE STRUCTURE PER THEME
```
[theme-name]/
├── DESIGN.md          ← Design system của theme này
├── PLAN.md            ← Kế hoạch build (persistent across sessions)
├── index.html         ← Landing page chính
├── assets/
│   ├── css/
│   │   ├── tokens.css       ← CSS custom properties
│   │   ├── base.css         ← Reset + typography
│   │   └── components.css   ← UI components
│   ├── js/
│   │   └── main.js
│   └── images/
│       └── [gen-ai-images]
└── pages/             ← Sub-pages nếu cần
```

