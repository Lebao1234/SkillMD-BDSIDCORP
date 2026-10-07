# Design System: Dịch Vụ Chuyên Nghiệp (Professional Services)

## 1. Visual Theme & Atmosphere

**Variance: 6 | Motion: 4 | Density: 5**

Giao diện của một **law firm / consulting firm / wealth management** hàng đầu. Cảm giác như McKinsey.com gặp một boutique agency châu Âu — restrained, authoritative, expensive-looking mà không lạnh lùng.

Atmosphere: **Trust First, Substance Over Style** — khách hàng là C-suite, doanh nhân, người cần chuyên gia thật sự. Design truyền tải: competence, discretion, track record. KHÔNG trendy, KHÔNG startup-y.

**Vibe words:** restrained, authoritative, substantial, European-corporate, editorial-precise

---

## 2. Color Palette & Roles

| Token | Hex | Functional Role |
|---|---|---|
| **Warm Stone** | `#FAFAF9` | Primary background — Stone-50 |
| **Pure Surface** | `#FFFFFF` | Cards, modals |
| **Forest Ink** | `#14532D` | Primary accent — CTAs, links, emphasis — Green-900 |
| **Forest Mid** | `#166534` | Hover state — Green-800 |
| **Forest Muted** | `#4ADE80` | KHÔNG dùng (quá saturated) |
| **Charcoal** | `#1C1917` | Primary text — Stone-900 |
| **Warm Grey** | `#57534E` | Secondary text — Stone-600 |
| **Ghost** | `#A8A29E` | Placeholder, metadata — Stone-400 |
| **Stone Border** | `rgba(214,211,209,0.8)` | Dividers, card borders — Stone-300 |
| **Tint Surface** | `#F0FDF4` | Subtle feature section tint — Green-50 |
| **Dark Slate** | `#1C1917` | Footer, dark hero variant |

> **BANNED trong theme này:** cobalt blue (quá startup), AI purple, warm beige+brass (quá artisan), neon. Theme này là WARM AUTHORITY — stone/warm neutral + deep forest green.

---

## 3. Typography Rules

```
Display Font: Satoshi (700, 800) — modern grotesk với character
Body Font: Satoshi (400, 500)
Accent Italic: Satoshi Italic — cho pull quotes và emphasis
Mono Font: IBM Plex Mono — cho số liệu, case study data
```

- **Hero Display:** `font-size: clamp(2.25rem, 4.5vw, 4rem)` | `font-weight: 800` | `letter-spacing: -0.025em` | `line-height: 1.08`
- **Section Headline:** `font-size: clamp(1.5rem, 2.5vw, 2.25rem)` | `font-weight: 700`
- **Body Text:** `font-size: 1rem` | `line-height: 1.75` | `max-width: 62ch` | `color: #57534E`
- **Eyebrow:** `font-size: 0.625rem` | `letter-spacing: 0.2em` | `text-transform: uppercase` | `color: #14532D`
- **Stat Number:** `font-family: IBM Plex Mono` | `font-size: clamp(2rem, 4vw, 3.5rem)` | `color: #1C1917`

> BANNED: Inter, serif fonts (kể cả Satoshi Serif). Chuyên nghiệp không cần serif để trông nghiêm túc.

---

## 4. Component Stylings

### Buttons
- **Primary:** `background: #14532D` | `color: white` | `padding: 0.8125rem 2rem` | `border-radius: 6px` | `font-weight: 600` | `letter-spacing: 0.01em`
- **Hover:** `background: #0F3D20` | NO glow
- **Active:** `-translate-y-[1px]`
- **Ghost:** `border: 1.5px solid #14532D` | `color: #14532D`
- KHÔNG pill-shaped buttons — `border-radius: 6px` max cho theme này

### Cards / Case Study Cards
- **Border:** `1px solid rgba(214,211,209,0.8)`
- **Radius:** `8px`
- **Shadow:** `0 1px 2px rgba(28,25,23,0.04)`
- **Hover:** `box-shadow: 0 4px 16px rgba(28,25,23,0.08)` + `translateY(-2px)`
- Case study: client logo + challenge snippet + outcome metric (số thật)

### Service Cards
- KHÔNG icon cartoon trên đầu — dùng số thứ tự (01, 02, 03) hoặc line art đơn giản
- Text-heavy hơn, density 5 — đây là dịch vụ cần giải thích

### Testimonials / Quotes
- Pull quote với `Satoshi Italic` | `font-size: 1.25rem`
- Attribution: Tên đầy đủ + Chức vụ + Công ty (KHÔNG chỉ "- Nguyễn Văn A")
- Max 3 dòng quote
- KHÔNG star ratings — chuyên nghiệp không dùng sao

---

## 5. Layout Principles

- **Hero:** Left-aligned, NOT centered. Headline bên trái, image hoặc abstract shape bên phải.
  Hoặc: Full-width dark hero với text trung tâm **chỉ khi** đó là manifesto/statement.
- **Services:** Vertical list với `border-top` divider — KHÔNG 3-column grid
- **Case Studies:** Alternating card layout, max 2 zigzag rồi chuyển sang grid
- **Stats:** 4-column trên desktop, 2×2 trên mobile
- **Team:** Bento grid không đều (featured partner lớn hơn, associates nhỏ hơn)
- **Max-width:** `1200px` — tighter than education, more editorial

### Section Order (Landing Page)
```
1. Navigation (minimal, text-only logo, max 5 nav items)
2. Hero (left-aligned statement + client outcome stat)
3. Services Overview (vertical list with descriptions)
4. Case Studies (3 featured)
5. By the Numbers (4 stats)
6. Thought Leadership / Insights (3 articles)
7. Team (partner bento)
8. Client Logos (grayscale, text-only acceptable)
9. Contact CTA (clean, no decorative elements)
10. Footer (detailed, includes office addresses)
```

---

## 6. Motion & Interaction

- **Minimal motion** — đây là Trust First theme
- Scroll reveal chỉ `opacity: 0 → 1`, KHÔNG translateY lớn
- Number counters animate khi vào viewport (stats section)
- Hover: chỉ subtle shadow/translate, KHÔNG spin/bounce/glow
- Nav: sticky, không transparent trick — solid từ đầu
- **KHÔNG:** parallax mạnh, GSAP pinned sections, scroll-hijack

---

## 7. Anti-Patterns (BANNED)

- Không emoji hoặc icon-heavy UI
- Không startup language ("Disrupting", "Game-changing", "Revolutionary")
- Không stock photo business handshake
- Không generic "4 pillar" icons với gradient circles
- Không testimonials với chỉ first name
- Không hero video autoplay
- Không floating WhatsApp chat button nhô ra ở góc (detracts from premium feel)
- Không gradient text
- Không dark/light mode toggle — pick one and lock it (theme này: Light)
- Không fake award logos nếu không có thật

