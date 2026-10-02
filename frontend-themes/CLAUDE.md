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

## LAYOUT RULES
- ANTI-CENTER: `DESIGN_VARIANCE > 4` → dùng Split Screen, Left-aligned, Asymmetric
- Grid > Flexbox math (KHÔNG `calc(33% - 1rem)`)
- Max-width: `max-w-[1400px] mx-auto` hoặc `max-w-7xl`
- Hero top padding: max `pt-24` (6rem)
- Hero: tối đa 4 text elements (eyebrow + headline + subtext + CTA)
- Nav: single line desktop, max 80px height
- Bento: ĐÚNG số cell với nội dung, không cell trống

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

