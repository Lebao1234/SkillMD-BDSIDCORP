# Design System: Giáo Dục (Education)

## 1. Visual Theme & Atmosphere

**Variance: 7 | Motion: 5 | Density: 4**

Giao diện tổ chức như một **học viện cao cấp** — không phải trường học màu sắc trẻ em, không phải corporate lạnh lùng. Cảm giác như MIT admissions page hoặc Coursera Pro nhưng được thiết kế bởi một agency European premium. Không gian thoáng, typography tự tin, ảnh học thuật thật.

Atmosphere: **Authoritative & Aspirational** — người dùng là học sinh/phụ huynh/doanh nghiệp đang đầu tư vào kiến thức. Design phải truyền tải sự tin tưởng và chuyên môn, không phải vui vẻ hay gamification.

**Vibe words:** scholarly, authoritative, open, aspirational, European-editorial

---

## 2. Color Palette & Roles

| Token | Hex | Functional Role |
|---|---|---|
| **Canvas White** | `#F8FAFC` | Primary background — Slate-50 |
| **Pure Surface** | `#FFFFFF` | Card fill, modal, input |
| **Deep Cobalt** | `#1B4FD8` | Primary accent — CTAs, links, active states, focus rings |
| **Cobalt Muted** | `#3B82F6` | Secondary accent — hover, badge, highlight |
| **Charcoal Ink** | `#0F172A` | Primary text — Slate-950 |
| **Steel Text** | `#475569` | Secondary text, descriptions — Slate-600 |
| **Ghost Text** | `#94A3B8` | Placeholder, metadata — Slate-400 |
| **Divider Line** | `rgba(226,232,240,0.8)` | Borders, section dividers — Slate-200 |
| **Surface Tint** | `#EFF6FF` | Subtle background tint for feature sections — Blue-50 |
| **Dark Section** | `#0F172A` | Hero alternate, dark CTA sections — Slate-950 |

> **BANNED trong theme này:** warm beige (#f5f1ea), AI purple (#8B5CF6), orange accent, warm brown tones. Theme này là COOL ACADEMIC, không phải warm-craft.

---

## 3. Typography Rules

```
Display Font: Plus Jakarta Sans (700, 800)
Body Font: DM Sans (400, 500)
Mono Font: JetBrains Mono (cho code examples, số liệu)
```

- **Hero Display:** `font-size: clamp(2.5rem, 5vw, 4.5rem)` | `font-weight: 800` | `letter-spacing: -0.03em` | `line-height: 1.05`
- **Section Headline:** `font-size: clamp(1.75rem, 3vw, 2.5rem)` | `font-weight: 700` | `letter-spacing: -0.02em`
- **Body Text:** `font-size: 1rem` | `font-weight: 400` | `line-height: 1.7` | `max-width: 65ch` | `color: #475569`
- **Eyebrow:** `font-size: 0.6875rem` | `font-weight: 600` | `letter-spacing: 0.15em` | `text-transform: uppercase` | `color: #1B4FD8`
- **CTA Label:** `font-size: 0.9375rem` | `font-weight: 600`

> BANNED: Inter, Playfair Display, Fraunces, any generic serif. Plus Jakarta Sans có character đủ premium mà không serif.

---

## 4. Component Stylings

### Buttons
- **Primary:** `background: #1B4FD8` | `color: white` | `padding: 0.75rem 1.75rem` | `border-radius: 8px` | `font-weight: 600`
- **Active state:** `-translate-y-[1px] brightness-110` (tactile push)
- **Hover:** `background: #1E40AF` (một shade tối hơn, không glow)
- **Ghost/Secondary:** `border: 1.5px solid #1B4FD8` | `color: #1B4FD8` | `background: transparent`
- **BANNED:** outer box-shadow glow, neon effects, gradient buttons

### Cards
- `border-radius: 12px`
- `border: 1px solid rgba(226,232,240,0.8)`
- `box-shadow: 0 1px 3px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)`
- Chỉ dùng card khi elevation thực sự tạo hierarchy — với danh sách thông thường dùng `border-top` divider

### Inputs / Forms
- Label TRÊN input, helper text optional, error text dưới
- `border-radius: 8px` | `border: 1.5px solid #CBD5E1`
- Focus: `border-color: #1B4FD8` | `box-shadow: 0 0 0 3px rgba(27,79,216,0.15)`
- KHÔNG floating labels

### Course/Program Cards
- Large image (16:9 aspect) ở top
- Eyebrow category tag: `background: #EFF6FF` | `color: #1B4FD8` | `font-size: 0.6875rem`
- Rating với star icons (Phosphor Icons)
- Price prominent, discount strikethrough nếu có

---

## 5. Layout Principles

- **Hero:** Split screen — text bên trái (60%), visual bên phải (40%). KHÔNG centered.
- **Feature Section:** Alternating 2-column split, nhưng max 2 lần. Lần 3 chuyển sang bento grid.
- **Course Grid:** `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- **Stats Section:** 4-column số liệu — dùng `display: grid; grid-template-columns: repeat(4, 1fr)`
- **Testimonials:** Horizontal scroll-snap trên mobile, 3-column grid trên desktop
- **Max-width:** `1280px` centered với `padding: 0 clamp(1.5rem, 5vw, 4rem)`

### Section Order (Landing Page)
```
1. Navigation (single line, transparent → solid on scroll)
2. Hero (split: text left, image right)
3. Trust Strip (logo wall — trường đối tác, chứng chỉ)
4. Value Proposition (3 feature cards — nhưng asymmetric, KHÔNG 3 equal columns)
5. Featured Courses/Programs (grid)
6. Stats / Outcomes (4 numbers)
7. Testimonials (scroll-snap)
8. Instructor/Team (bento grid)
9. CTA Section (dark background, centered allowed here)
10. Footer
```

---

## 6. Motion & Interaction

- **Scroll reveal:** `opacity: 0; transform: translateY(20px)` → animate khi vào viewport
- **Hero image:** subtle `scale: 1 → 1.02` parallax on scroll
- **Card hover:** `transform: translateY(-4px)` | `transition: 200ms ease`
- **Nav:** blur backdrop khi scroll qua hero, `transition: 300ms`
- **Spring physics:** stiffness 100, damping 20 (nếu dùng GSAP/Motion)
- **KHÔNG:** infinite spinning loaders, bouncing chevrons, particle effects

---

## 7. Anti-Patterns (BANNED)

- Không emoji trong UI
- Không Inter font
- Không purple/violet accent
- Không warm beige background
- Không "Khám phá hành trình học tập", "Mở ra cánh cửa tương lai" (generic edu copy)
- Không 3 equal cards với icon trên đầu
- Không fake student photos (chỉ dùng ảnh thật hoặc gen AI cụ thể)
- Không gamification elements (badges, XP bars) trừ khi brief yêu cầu
- Không gradient text trên headline lớn
- Không progress bars decorative (chỉ nếu có data thật)

