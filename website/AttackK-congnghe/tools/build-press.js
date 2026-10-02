const { init, call } = require('./mcp');

const STYLE_SETTINGS = [
  { type: 'header', label: 'Style' },
  { type: 'checkbox', id: 'visible', label: 'Visible', default: true },
  { type: 'color', id: 'bg_color', label: 'Background color' },
  { type: 'color', id: 'text_color', label: 'Text color' },
  { type: 'color', id: 'heading_color', label: 'Heading color' },
  { type: 'text', id: 'padding_top', label: 'Padding top (CSS)' },
  { type: 'text', id: 'padding_bottom', label: 'Padding bottom (CSS)' },
  { type: 'color', id: 'border_color', label: 'Border color' },
  { type: 'range', id: 'border_width', label: 'Border width', min: 0, max: 8, step: 1, unit: 'px', default: 0 },
  { type: 'range', id: 'border_radius', label: 'Border radius', min: 0, max: 48, step: 1, unit: 'px', default: 0 }
];

async function main() {
  await init();

  const pressBody = `<section class="section--tight" aria-labelledby="press-h" style="border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--cream);padding:36px 0;">
  <div class="wrap" style="padding-bottom: 20px; text-align: center;">
    <h2 class="section-head__title" id="press-h" style="font-size: 20px; font-weight: 600; letter-spacing: -0.01em; color: var(--mute);">{% if request.locale.iso_code == 'en' %}Recognized by Technology Publications{% else %}Đã được nhắc đến trên các tạp chí công nghệ{% endif %}</h2>
  </div>
  <div class="marquee" style="overflow:hidden;white-space:nowrap;display:flex;">
    <div class="marquee__track" style="display:flex;gap:48px;align-items:center;">
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.04em;color:var(--ink-2);opacity:0.75;">AP NEWS</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:700;letter-spacing:-0.02em;color:var(--ink-2);opacity:0.75;">YAHOO! FINANCE</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">KITGURU</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:-0.01em;color:var(--ink-2);opacity:0.75;">TECHPOWERUP</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">GAGADGET</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:-0.02em;color:var(--ink-2);opacity:0.75;">eTEKNIX</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:700;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">MORNINGSTAR</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.06em;color:var(--ink-2);opacity:0.75;">AOL TECH</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">TREND HUNTER</span>
      <!-- Loop repeat -->
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.04em;color:var(--ink-2);opacity:0.75;">AP NEWS</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:700;letter-spacing:-0.02em;color:var(--ink-2);opacity:0.75;">YAHOO! FINANCE</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">KITGURU</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:-0.01em;color:var(--ink-2);opacity:0.75;">TECHPOWERUP</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">GAGADGET</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:-0.02em;color:var(--ink-2);opacity:0.75;">eTEKNIX</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:700;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">MORNINGSTAR</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.06em;color:var(--ink-2);opacity:0.75;">AOL TECH</span>
      <span style="font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:0.02em;color:var(--ink-2);opacity:0.75;">TREND HUNTER</span>
    </div>
  </div>
</section>`;

  const res = await call('build_section', {
    spec: {
      name: 'HADAL Press Marquee',
      handle: 'hadal-press',
      category: 'social',
      settings: STYLE_SETTINGS,
      body: pressBody
    },
    theme_id: '2898',
    overwrite: true
  });

  console.log('build hadal-press result:', JSON.stringify(res, null, 2));

  // Now place it at position 8
  const pl = await call('set_section_settings', {
    template: 'index',
    section_id: 'hadal-press',
    type: 'hadal-press',
    settings: {},
    position: 8,
    theme_id: '2898'
  });
  console.log('Placed hadal-press at position 8:', JSON.stringify(pl, null, 2));

  await call('clear_storefront_cache', {});
  console.log('Cache cleared!');
}

main().catch(console.error);

