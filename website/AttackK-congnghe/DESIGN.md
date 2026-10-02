# HADAL storefront, design system

The token authority for this build is `.claude/skills/design-system/SKILL.md`.
The brand identity layered on top of those tokens is defined in
`assets/js/brand.js`. Everything below either quotes a token from that
file verbatim or documents an extension and says why it was needed. Tokens live
in `assets/css/tokens.css`; component CSS consumes the variables and holds no
literal colour values. The one exception is the `rgba()` scrim gradients that
sit between photography and the copy on top of it, which are compositional
rather than palette.

---

## Design read

> Reading this as: an e-commerce storefront for gaming-hardware shoppers, with a
> dark precision-hardware language, leaning toward the supplied token set
> implemented in native CSS.

## Brand identity

**Name: HADAL.** The hadal zone is the deepest layer of the ocean, below 6000
metres. It keeps the marine lineage of the catalog this storefront was modelled
on, while reading as precision instrumentation rather than as a gamer mascot. It
is a real word, short, pronounceable in both Vietnamese and English, and not
already taken by a peripherals brand. Everything that names the store lives in
`assets/js/brand.js`, so renaming again is a one-file edit.

**Mark.** A machined octagonal aperture holding three bars that descend and
narrow toward a point: a depth gauge, or a sonar return. It is two paths, one
colour, no gradient, and it stays legible at the 20px it is actually drawn at in
the navigation bar, which a pictorial mascot would not.

**Lockup.** The mark carries the accent and the wordmark stays monochrome, so
the pair never competes with a page that is already spending the accent on its
primary call to action. The wordmark is the display face at 0.22em tracking with
a mono descriptor beneath it; the descriptor is dropped below 1120px, where the
bar needs the width more than the page needs the qualifier.

The palette is unchanged. The brand token `#6073f2` happens to suit a name
about deep water, so the rebrand touched identity and layout only.

The `tasteskill` rules are written for landing pages and portfolios, and its own
scope note pushes dense product UI elsewhere. So they are applied in full to the
marketing surfaces (home, collection headers, editorial) and applied with
judgement on the transactional surfaces (product detail, cart, checkout, compare)
where commerce conventions win. Every place that diverges is called out below.

### Dials

| Dial | Value | Reasoning |
| --- | --- | --- |
| `DESIGN_VARIANCE` | 6 | Premium consumer hardware wants asymmetry, but a storefront also has to be predictable enough to shop in. |
| `MOTION_INTENSITY` | 5 | The brand tokens only supply 200, 300 and 400ms durations, which is a deliberately restrained ceiling. |
| `VISUAL_DENSITY` | 5 | Commerce density, not gallery density: 12 products per page, spec clusters, a real filter rail. |

---

## Foundations

### Type

| Role | Stack | Why |
| --- | --- | --- |
| Primary and display | `Attackshark4, Space Grotesk, Segoe UI, system-ui, sans-serif` | `font.family.primary=Attackshark4` is a brand token. The face is proprietary and not redistributable, so it is declared first and picked up on machines that have it. Space Grotesk carries the same technical-grotesk character as a fallback. |
| Body and long form | same stack as primary (`--font-body` resolves to `--font-primary`) | Body copy ran in Archivo until the storefront read as two typefaces on one page. One face now carries hero, nav, spec row and returns policy alike. Space Grotesk ships a vietnamese subset, so the diacritics are in the same file rather than in a fallback. |
| Numerals, specs, metadata | `JetBrains Mono` | Every price, DPI figure, weight and polling rate is tabular. |

Inter is not used. No serif is used anywhere: the brief is technical hardware,
not editorial or luxury, so the serif exception never applies.

Scale is the brand scale verbatim (`9 / 12.8 / 14 / 16 / 17 / 20 / 24 / 32px`).
**Extension:** the brand scale stops at 32px, which cannot carry a storefront
hero, so `--fs-5xl` through `--fs-7xl` continue the ratio as fluid `clamp()`
values.

### Spacing

`space.1` through `space.8` are the brand values verbatim
(`1.6 / 5 / 10 / 12 / 15 / 16 / 24 / 32px`).

**Extension:** section rhythm needs values above 32px, so `--space-9` through
`--space-14` continue the scale to 136px. Section padding is
`clamp(64px, 8vw, 104px)`.

### Shape: the consistency lock

The brand supplies exactly one radius, `radius.xs = 8px`. The locked rule for
this build:

- every surface, card, input, button, image frame and drawer is **8px**
- `--radius-pill` (999px) is permitted on **badges, chips, colour swatches,
  avatars and progress tracks only**
- no other radius value appears anywhere in the codebase

### Motion

Brand durations verbatim: `200ms` instant, `300ms` fast, `400ms` normal.
Easing is `cubic-bezier(0.16, 1, 0.3, 1)` with a softer
`cubic-bezier(0.32, 0.72, 0, 1)` for panels that travel a long distance.

Only `transform` and `opacity` are animated. Nothing in the build listens to the
`scroll` event; scroll-driven behaviour (reveals, sticky header styling, the
sticky purchase bar, back-to-top, the support-page section highlight) all runs
on `IntersectionObserver`. Every animation collapses under
`prefers-reduced-motion: reduce`, including the announcement rotator, the hero
slider and the press marquee.

---

## Colour

### Page theme lock

The page has one theme. Dark is the default and matches the brand token
`color.surface.base = #000000`. A light theme exists under
`[data-theme="light"]`, driven by `color.surface.muted = #e6f4ff` and
`color.surface.raised = #f0f0f0`, and the whole document flips together. No
section ever inverts mid-scroll. With no explicit choice stored, the page
follows `prefers-color-scheme`.

**Documented deviation:** the taste skill discourages `#000000` as a page
ground. The brand token names it explicitly, so it is honoured. Depth is rebuilt
with layered raised surfaces (`#0b0b0d`, `#131317`, `#18181d`) rather than by
tinting the ground.

### One accent, locked page-wide

`color.surface.strong = #6073f2` is the single accent. It is used identically on
every page: no section introduces a second hue.

The AI-purple rule is overridden here because the brand brief names this colour.
It is executed with intent rather than as a glow: flat fills, hairline borders
and a 12 percent wash, no neon bloom.

### The accent ramp, and why it has two steps

| Token | Value | Contrast | Use |
| --- | --- | --- | --- |
| `--accent` | `#6073f2` | 5.23:1 on `#000000` | Text, icons, borders, highlights on the dark ground |
| `--accent-solid` | `#4d60df` | 5.18:1 with white text | Solid button fills |

`#6073f2` with white text measures **4.01:1**, which fails the AA body threshold
of 4.5:1. Rather than ship a failing button, the ramp steps down one notch for
solid fills. On the light theme both roles use `#3f51c9` (6.46:1 against white),
because `#6073f2` on a light ground also lands at 4.01:1.

Every CTA, form input, placeholder, helper line, focus ring and error message was
checked against its own surface, in both themes.

---

## Layout discipline, home page

Ten sections, ten different layout families, so no two read the same:

1. Hero: indexed editorial split
2. Service commitments: inline divided row, deliberately not cards
3. Fresh finds: horizontal snap rail
4. Spotlight: asymmetric bento
5. Categories: tile wall
6. Best sellers: tabbed product grid
7. Giveaway: media plus panel split, the only split on the page
8. Community: masonry photo wall
9. Press: marquee, the only marquee on the page
10. Editorial: lead article plus stacked list

**Exact cell counts.** Three spotlight products fill three bento cells, seven
categories fill seven tiles. If a spotlight handle ever disappears from the
catalog, `home.js` backfills from best sellers so the grid can never render a
blank tile.

**Eyebrow budget.** Ten sections allow at most four eyebrows. The page uses
three: hero, spotlight, giveaway. The hero carries one, on the first slide only.
`tools/smoke-test.js` asserts the budget mechanically.

**Hero discipline.** Maximum four text elements per slide (eyebrow on the first
slide only, headline, subtext, calls to action), headline at two lines, subtext
under twenty words, both CTAs above the fold. There is no trust strip, no
tagline under the CTAs and no scroll cue. The press wall lives in its own
section far below.

---

## Second pass: header and hero

Both were rebuilt after seeing the first version render in a light-mode browser.

### What was wrong

**The hero lost its copy.** The first version laid white text over a full-bleed
product photograph behind a gradient scrim. The catalog photography is shot on
white, so a scrim dark enough to carry white copy fought the product, and in
light mode the composition collapsed into a grey wash with the headline lost
inside it.

**The announcement bar clipped its own text.** Centred flex with the arrows
absolutely positioned over the same box meant a long message wrapped to two
lines inside a 38px rail and had its first line cut off.

**The header cost too much for what it did.** Three tiers (announcement,
utility bar, navigation) ate about 140px before any content, and search, which
is the primary way people navigate a 175-product storefront, was hidden behind
an icon.

### What replaced them

**Hero: indexed editorial split.** The copy now sits on the page ground and
inherits the theme tokens, so its contrast is a guaranteed value in both themes
rather than something that depends on what the photograph is doing behind it.
The product gets its own framed stage with a tinted ground and an accent bloom,
which is what turns a white-background catalog shot from a liability into an
asset. Slides are chosen from a vertical numbered rail (01, 02, 03) instead of
dashes under the fold, and both columns cross-fade together. A three-figure spec
bar sits inside the stage, as part of the product presentation rather than as a
fifth block of hero copy.

**Header: two tiers.** The announcement is now a three-column grid, so the
message can never run underneath the arrows and truncates with an ellipsis
instead of wrapping. The utility bar is gone: currency moved into the action
cluster, support links moved to the footer. The single 72px bar carries the
logo, one catalog trigger, four shortcuts, a persistent inline search field and
the actions, and it condenses to 58px on scroll.

**One catalog panel instead of five hover menus.** Four columns with live
counts pulled from the catalog, plus one featured product. It opens on click, so
the keyboard path is the same path, and it does not fire while the pointer is
merely travelling across the bar.

**Search moved into the bar.** The field is always visible above 1024px, grows
on focus, drops type-ahead results straight underneath, and takes `/` as a focus
shortcut. Below 1024px it collapses and the full-screen overlay takes over.

**Navigation.** One catalog trigger plus four shortcuts, one line at desktop,
bar height 68px against the 80px ceiling. Shortcuts shed one at a time at 1280px
and 1120px; below 1024px everything collapses into a drawer whose hamburger
morphs into a cross.

**Spec sheets.** Product specifications are grouped into three or four clusters
in separate cards, not a fourteen-row table with a hairline under every row.

---

## Component states

Every interactive family defines the seven required states: default, hover,
focus-visible, active, disabled, loading and error. Loading states are
shape-matched skeletons or in-place button spinners that preserve width, never a
bare centred spinner. Every list surface has a composed empty state that offers
a way forward: cart, wishlist, compare, search, filtered collection and order
history.

---

## Accessibility

Target is WCAG 2.2 AA, keyboard first.

- Skip link on every page, `main` landmark, one `h1` per document
- `:focus-visible` ring on everything interactive, offset so it clears its own
  surface
- Drawers and modals are `role="dialog" aria-modal="true"`, trap Tab, close on
  Escape and on backdrop click, and return focus to the trigger
- Mega menus open on click, not hover, so they are reachable by keyboard
- Tabs implement the roving-tabindex pattern with arrow-key navigation
- The product gallery is focusable and responds to the arrow keys
- Labels sit above inputs, helper text below the label, error text below the
  input, `aria-invalid` toggled per field. No placeholder is used as a label
- Result counts and toasts announce through `aria-live`
- Minimum 44px touch targets on buttons and steppers
- Decorative icons are `aria-hidden`; icon-only controls carry `aria-label`

---

## What was deliberately not done

- **No hand-rolled SVG icons.** Glyphs come from Phosphor Light
  (`@phosphor-icons/web`), one family at one weight across the whole build.
- **No div-based fake product screenshots.** Every image is a real photograph
  from the Attack Shark CDN.
- **No em-dash or en-dash** anywhere in shipped copy. The data build strips both
  from the source catalog, and the check is part of the release scan.
- **No section-number eyebrows, no scroll cues, no locale or weather strips, no
  version stamps, no decorative status dots, no photo-credit captions.**
- **No `window.addEventListener('scroll')`.**
- **No invented specifications.** Every number on a product page is derived from
  the real catalog. Ratings, review counts and sold counts are generated, and
  are marked as sample data in the README.

---

## Two languages

Vietnamese and English, switched from the header beside the currency control.
Vietnamese is the default; with no stored choice the site follows the browser
and only reaches for English when the browser clearly asks for it.

**The dictionary is the design artefact.** Each key holds a Vietnamese and an
English string on the same line, so the two sit side by side and a drifted or
missing translation is visible while reading rather than only at runtime. Markup
uses a data attribute for text and one per translatable attribute; scripts call
the translator directly. A missing key renders as the key itself, so a gap shows
up in the interface instead of silently deleting a label.

**Switching reloads the page.** That is the same route the currency switch
takes. It is blunt, and it is what guarantees every controller re-renders with
no chance of a stale string surviving inside a panel that happened to be closed
at the time.

**What is not translated.** Product names and supplier descriptions. They read
as model identifiers in both languages, and translating a sensor part number
would help nobody. Everything the storefront itself says is translated,
including the eight journal articles and the review copy, which carry English
twins in the dataset.

**Facet values stay ASCII.** A filter value travels in the query string, so it
has to survive a language switch. The internal identifier is stable and the
label is resolved at render time, which is why a filtered URL still works after
you change language.

**Diacritics.** The first pass shipped unaccented Vietnamese to sidestep
encoding risk. Standing next to English that reads as unfinished, so the whole
Vietnamese half was rewritten with proper diacritics while the dictionary was
being built.

**Numbers and dates follow the reading language,** not the currency, so a
Vietnamese reader paying in USD still gets familiar grouping.
