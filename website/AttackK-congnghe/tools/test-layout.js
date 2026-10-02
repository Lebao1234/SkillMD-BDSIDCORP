const { init, call } = require('./mcp');

async function main() {
  await init();
  const content = `<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    {%- if page_title and page_title != blank -%}
      {{ page_title }} — HADAL Peripherals
    {%- elsif request.locale.iso_code == 'en' -%}
      HADAL Peripherals — Precision Gaming Mice & Keyboards
    {%- else -%}
      HADAL Peripherals — Chuột và bàn phím chơi game
    {%- endif -%}
  </title>
  <meta name="description" content="{{ page_description | default: shop.description }}">
  
  {{ content_for_header }}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.1/src/light/style.css">

  <link rel="stylesheet" href="/assets/theme.css">
  <link rel="stylesheet" href="/assets/theme-skin.css">
  <link rel="stylesheet" href="/assets/tailwind.css">

  <style id="theme-settings-vars">:root{
    --accent:{{ settings.color_accent | default: '#6073f2' }};
    --accent-ink:#05060f;
    --accent-soft:#171c33;
    --ink:#f5f5f7;
    --ink-2:#c9c9d2;
    --mute:#a6a6b0;
    --mute-2:#74747f;
    --paper:#000000;
    --cream:#0b0b0d;
    --cream-2:#131317;
    --white:#ffffff;
    --line:#1f1f26;
    --line-2:#2b2b33;
    --sale:#ff6b6b;
    --font-display:var(--font-primary);
    --font-sans:var(--font-primary);
    --font-serif:var(--font-primary);
    --font-mono:"JetBrains Mono",ui-monospace,monospace;
    --section-y:96px;
    --gutter:24px;
    --radius:8px;
    --radius-sm:6px;
    --radius-lg:14px;
    --radius-pill:999px;
    --sh-1:0 1px 2px rgba(17,20,24,.06);
    --sh-2:0 8px 24px rgba(17,20,24,.08);
    --sh-3:0 16px 40px rgba(17,20,24,.10);
  }</style>
</head>
<body data-store-slug="{{ shop.permanent_domain | default: 'hadal-peripherals' }}" data-currency-code="{{ cart.currency.iso_code | default: 'VND' }}">
  {% section 'announcement-bar' %}
  {% section 'header' %}

  <main id="main">
    {{ content_for_layout }}
  </main>

  {% section 'footer' %}

  <script src="/assets/theme.js" defer></script>
</body>
</html>`;

  const res = await call('upsert_theme_file', {
    path: 'layout/theme.liquid',
    content: content
  });
  console.log('Result for layout/theme.liquid:', JSON.stringify(res, null, 2));

  await call('clear_storefront_cache', {});
  console.log('Cache cleared!');
}

main().catch(console.error);
