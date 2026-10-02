/* ============================================================================
   BRAND
   Every piece of brand identity lives here: the name, the wordmark, the logo
   geometry, contact addresses and social handles. Renaming the storefront again
   means editing this one file.

   NAME: HADAL
   The hadal zone is the deepest layer of the ocean, below 6000 metres. It keeps
   the marine lineage of the catalog this storefront was modelled on, but reads
   as precision instrumentation rather than as a gamer mascot. It is a real
   word, short, pronounceable in Vietnamese and English, and not already a
   peripherals brand.

   MARK: a machined octagonal aperture holding three descending bars that
   narrow toward a point. It reads as a depth gauge or a sonar return, and it
   survives being drawn at 20px in a navigation bar, which a pictorial mascot
   would not. Single path pair, one colour, no gradients.
   ========================================================================= */
(function (global) {
  'use strict';

  /* The mark is drawn once here and injected wherever it is needed, so header,
     footer, favicon and loading states can never drift apart. */
  function logoMark(size) {
    var s = size || 32;
    return '<svg class="mark" width="' + s + '" height="' + s + '" viewBox="0 0 32 32" ' +
      'fill="none" role="img" aria-hidden="true" focusable="false">' +
      /* Octagonal aperture: a square with all four corners machined off. */
      '<path d="M10.6 3h10.8L29 10.6v10.8L21.4 29H10.6L3 21.4V10.6z" ' +
        'stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      /* Three strata descending toward the floor of the trench. */
      '<path d="M10.5 12.6h11M12.6 17h6.8M15.2 21.4h1.6" ' +
        'stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  var BRAND = {
    name: 'HADAL',
    legalName: 'HADAL Peripherals',
    descriptor: 'Peripherals',
    /* One line, used in the footer and in meta descriptions. */
    line: 'Thiet bi ngoai vi do chinh xac cao cho nguoi choi doi hoi do tre thap nhat.',
    domain: 'hadal.gg',
    email: {
      support: 'support@hadal.gg',
      partnerships: 'partnerships@hadal.gg',
    },
    logoMark: logoMark,

    /* Wordmark lockup. The mark carries the accent, the word stays monochrome,
       so the pair never competes with a page that is already using the accent
       for its primary call to action. */
    lockup: function (opts) {
      opts = opts || {};
      return '<span class="brand__mark">' + logoMark(opts.size || 28) + '</span>' +
        '<span class="brand__word">' + BRAND.name +
          (opts.descriptor ? '<span class="brand__descriptor">' + BRAND.descriptor + '</span>' : '') +
        '</span>';
    },

    socials: [
      ['facebook-logo', 'https://www.facebook.com/', 'Facebook'],
      ['x-logo', 'https://x.com/', 'X'],
      ['instagram-logo', 'https://www.instagram.com/', 'Instagram'],
      ['youtube-logo', 'https://www.youtube.com/', 'YouTube'],
      ['tiktok-logo', 'https://www.tiktok.com/', 'TikTok'],
      ['discord-logo', 'https://discord.com/', 'Discord'],
      ['reddit-logo', 'https://www.reddit.com/', 'Reddit'],
      ['pinterest-logo', 'https://www.pinterest.com/', 'Pinterest'],
    ],
  };

  global.BRAND = BRAND;

})(window);
