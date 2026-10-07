# Design System: Công Nghệ Phần Mềm (Software Technology)

## 1. Visual Theme & Atmosphere

**Variance: 8 | Motion: 7 | Density: 5**

Giao diện của một **SaaS product / dev tool / software agency** hàng đầu. Cảm giác như Linear.app gặp Vercel nhưng với tính cách riêng — dark mode mặc định, technical confidence, clean motion. Developer-credible nhưng không geek-only.

Atmosphere: **Dark Tech Precision** — người dùng là technical buyers (CTOs, senior devs) và business decision-makers. Design phải truyền tải: speed, reliability, technical depth. KHÔNG playful startup-y, KHÔNG B2B generic với stock photos.

**Vibe words:** dark-tech, linear-clean, technical-confident, motion-forward, dense-but-breathable

---

## 2. Color Palette & Roles

| Token | Hex | Functional Role |
|---|---|---|
| **Void Black** | `#09090B` | Primary background — Zinc-950 |
| **Dark Surface** | `#18181B` | Card fill, sidebar — Zinc-900 |
| **Elevated Surface** | `#27272A` | Hover state, elevated card — Zinc-800 |
| **Zinc Border** | `rgba(63,63,70,0.8)` | Card borders, dividers — Zinc-700 |
| **Ghost Border** | `rgba(39,39,42,0.6)` | Subtle dividers |
| **Indigo Spark** | `#6366F1` | Primary accent — Indigo-500 (NOT blue glow) |
| **Indigo Hover** | `#4F46E5` | Hover — Indigo-600 |
| **Indigo Subtle** | `rgba(99,102,241,0.12)` | Background tint for code blocks, badges |
| **White Primary** | `#FAFAFA` | Primary text — Zinc-50 |
| **Grey Secondary** | `#A1A1AA` | Secondary text — Zinc-400 |
| **Ghost Text** | `#52525B` | Placeholder — Zinc-600 |
| **Success Green** | `#22C55E` | Status indicators only — Green-500 |

> **BANNED trong theme này:** AI purple glow (khác với Indigo precision), neon green, warm beige, cobalt blue (quá Enterprise IT 2015). Indigo được dùng nhưng KHÔNG có outer glow shadow — precision, không decoration.

---

## 3. Typography Rules

```
Display Font: Geist (700, 800) — tối ưu cho dark tech
Body Font: Geist (400, 500)
Mono Font: Geist Mono — code snippets, terminal, metrics
```

- **Hero Display:** `font-size: clamp(2.75rem, 6vw, 5rem)` | `font-weight: 800` | `letter-spacing: -0.04em` | `line-height: 1.0`
- **Section Headline:** `font-size: clamp(1.5rem, 3vw, 2.5rem)` | `font-weight: 700` | `letter-spacing: -0.025em`
- **Body Text:** `font-size: 0.9375rem` | `line-height: 1.65` | `max-width: 60ch` | `color: #A1A1AA`
- **Code/Mono:** `font-family: Geist Mono` | `font-size: 0.875rem` | `background: rgba(99,102,241,0.1)` | `padding: 0.125rem 0.375rem` | `border-radius: 4px`
- **Eyebrow:** `font-family: Geist Mono` | `font-size: 0.625rem` | `letter-spacing: 0.1em` | `color: #6366F1`

> BANNED: Inter (mặc dù cũng dùng trên Linear — Geist là lựa chọn riêng), serif fonts hoàn toàn, Plus Jakarta Sans (dành cho Education theme).

---

## 4. Component Stylings

### Buttons
- **Primary:** `background: #6366F1` | `color: white` | `padding: 0.625rem 1.375rem` | `border-radius: 8px` | `font-weight: 500` | `font-size: 0.875rem`
- **Hover:** `background: #4F46E5` | NO outer glow (inner shadow OK: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.1)`)
- **Active:** `scale: 0.98`
- **Ghost:** `border: 1px solid rgba(63,63,70,0.8)` | `color: #FAFAFA` | `background: transparent`
- **Ghost Hover:** `background: #27272A`

### Code Blocks / Terminal
- `background: #18181B` | `border: 1px solid rgba(63,63,70,0.8)` | `border-radius: 12px`
- Syntax highlighting: tối giản — comment `#52525B`, string `#86EFAC`, keyword `#818CF8`
- Terminal prompt: `color: #6366F1` → `color: #FAFAFA`
- Copy button: top-right, icon only, hover reveal

### Feature Cards (dark)
- `background: #18181B` | `border: 1px solid rgba(63,63,70,0.8)` | `border-radius: 12px`
- `padding: 1.5rem`
- Hover: `border-color: rgba(99,102,241,0.4)` | `background: #1c1c1f`
- KHÔNG gradient background mỗi card — flat dark với border glow chỉ khi hover

### Pricing Cards
- Free tier: standard dark card
- Pro/Growth: `border: 1px solid rgba(99,102,241,0.5)` + subtle indigo glow `box-shadow: 0 0 0 1px rgba(99,102,241,0.1)`
- Enterprise: glass variant với `backdrop-filter: blur(12px)` + bright border

### Status Indicators
- Live/Active: `#22C55E` dot với `animation: pulse 2s infinite`
- Processing: Indigo spinner
- Error: `#EF4444` — Red-500

---

## 5. Layout Principles

- **Hero:** Left-aligned content (50%) + animated product UI / code demo bên phải (50%)
  Hoặc: Full-width statement hero với animated background (particle grid, dot matrix — subtle)
- **Feature Grid:** KHÔNG 3 equal cards. Dùng:
  - Bento grid (2 col lớn + 4 col nhỏ)
  - Alternating full-width feature rows
  - Horizontal scroll-snap
- **Integrations / Tech Stack:** Logo grid với Simple Icons — monochrome trắng trên dark
- **Pricing:** 3-column trên desktop là OK vì pricing là so sánh — exception rule
- **Code Demo Section:** Full-width, dark surface, với live code animation
- **Max-width:** `1400px` với padding rộng hơn

### Section Order (Landing Page)
```
1. Navigation (logo + nav items + CTA button bên phải)
2. Hero (left-aligned + product visual bên phải)
3. Social Proof Strip (logo wall, grayscale white)
4. Core Feature (1 large showcase, full-width)
5. Feature Grid (bento — 6 features asymmetric)
6. Code/API Demo (dark, syntax highlighted)
7. Integration Logos (horizontal scroll-snap)
8. Performance Stats (4 numbers với Geist Mono)
9. Testimonials (3 cards với company + role)
10. Pricing (3-tier comparison)
11. Final CTA (simple, "Get started free" + secondary)
12. Footer (developer-friendly: docs, API, GitHub links)
```

---

## 6. Motion & Interaction

- **Hero background:** subtle animated dot grid (`CSS animation`) hoặc gradient mesh — SUBTLE
- **Hero product visual:** slow float `translateY(0 → -8px → 0)` 4s infinite ease-in-out
- **Code Demo:** typewriter effect cho terminal commands
- **Feature cards:** `translateY(-6px) + border glow` on hover, `transition: 200ms ease`
- **Scroll reveal:** `opacity + translateY(16px)` với stagger cho grid items
- **Number counters:** count up animation khi enter viewport
- **CTA button:** subtle shimmer `background-position` animation
- **GSAP:** dùng cho bento grid reveal stagger và code demo sequence
- **KHÔNG:** full-page scroll hijack, heavy parallax, rotation effects, confetti

---

## 7. Anti-Patterns (BANNED)

- Không Inter font (dù là dark tech default)
- Không AI purple outer glow (Indigo precision ≠ AI glow)
- Không light mode sections sandwiched trong dark page
- Không stock photo người làm việc trong văn phòng
- Không "Disrupting the industry" / "Next-generation" copy
- Không fake terminal với output giả tạo
- Không rocket/launch emoji trong tech product
- Không "Our platform leverages cutting-edge AI/ML" (generic)
- Không 3 equal white cards với icon trên đầu trên nền dark
- Không gradient text cho toàn bộ headline (chỉ OK cho từ khóa ngắn)
- Không dot leaders, no blur vignette decorative, no fake depth-of-field

