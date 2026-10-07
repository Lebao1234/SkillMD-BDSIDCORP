# SkillMD-BDSIDCORP

Skill library + static marketing sites (Vietnamese). Design rules: see `frontend-themes/CLAUDE.md`
(applies to every site in `website/`, not only `frontend-themes/`).

## Layout
- `.agents/skills/` is the source of truth. `.claude`, `.codeartsdoer`, `.codestudio`, `.continue`, `.forge`,
  `.mcpjam` each have a `skills/` mirror: symlinks on this machine, but git stores them as plain copies
  (`core.symlinks=false`), so a fresh clone gets 7 independent copies. Before committing a skill edit, check
  all mirrors match: `for d in .claude .codeartsdoer .codestudio .continue .forge .mcpjam; do diff -rq .agents/skills $d/skills; done`.
- 2 skills are locally modified vs upstream Leonxlnx/taste-skill (design-taste-frontend, high-end-visual-design:
  hero archetypes, header/footer geometry, dual-mode nav, monogram ban). Re-syncing from upstream erases these.
- `website/<Brand>-<nganh>/` = one finished site (nganh: giaoduc, congnghe, dichvu, cokhi).

## Sites with a build step (most of website/)
- Edit `src/` (pages/, partials/, data/, templates/), never the root `.html` (generated).
- `node tools/build.js` then `node tools/check.js` (leftover `{{tokens}}`, missing files, `#anchors`, img alt,
  duplicate ids; root HTML only). Node only, no npm install. build.js differs per site (own tokens/data);
  VN-Nikko's check.js also scans `en/`, `ja/`, `ko/`.
- First line of each `src/pages/*.html` is `<!--meta {JSON}-->` (title, description, nav, crumbs, cta, ...).
- Build fails on – or — (use `-`), and it fails mid-write: pages before the error are already rewritten and
  sitemap.xml is not, so fix and rebuild immediately.
- AttackK-congnghe and CongthongtinNeu have no build step: edit the HTML directly.
  EnSchool-giaoduc and Phusong-congnghe are empty placeholders.

## Global UI bans (in addition to frontend-themes/CLAUDE.md)
- No small colored dot decorations before eyebrow labels.
- No giant decorative brand-name wordmark at the bottom of the footer.

## Secrets
- `.mcp.json` files hold real tokens: never commit them.
