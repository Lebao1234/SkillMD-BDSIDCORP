/* ============================================================================
   BLOG AND ARTICLE CONTROLLERS
   One file, two entry points. Which one runs is decided by the markup present
   on the page.
   ========================================================================= */
(function (global) {
  'use strict';

  var doc = global.document;
  var Catalog = global.Catalog;
  var UI = global.UI;
  var $ = UI.$;
  var esc = Catalog.esc;
  var t = global.I18N.t;
  var icon = UI.icon;

  /* ------------------------------------------------------------------
     INDEX
     ------------------------------------------------------------------ */
  function bootIndex() {
    var posts = Catalog.posts();
    var topic = new URLSearchParams(global.location.search).get('topic') || 'all';

    var topics = ['all'].concat(posts.map(function (p) { return p.topic; })
      .filter(function (t, i, a) { return a.indexOf(t) === i; }));

    function renderFilters() {
      $('[data-blog-topics]').innerHTML = topics.map(function (slug) {
        var n = slug === 'all' ? posts.length : posts.filter(function (p) { return p.topic === slug; }).length;
        return '<button type="button" class="chip' + (topic === slug ? ' is-active' : '') + '" data-topic="' + esc(slug) + '">' +
          esc(t('bl.topic.' + slug)) + ' <span class="mono dim">' + n + '</span></button>';
      }).join('');
    }

    function renderList() {
      var list = topic === 'all' ? posts : posts.filter(function (p) { return p.topic === topic; });
      var lead = list[0];
      var rest = list.slice(1);

      $('[data-blog-lead]').innerHTML = lead
        ? '<a class="post-lead reveal" href="article.html?slug=' + esc(lead.slug) + '">' +
            '<span class="post-lead__media"><img src="' + esc(lead.cover) + '" alt="" loading="lazy" decoding="async" width="900" height="560"></span>' +
            '<span class="post-meta"><span>' + esc(t('bl.topic.' + lead.topic)) + '</span><span>' + esc(lead.date) + '</span><span>' + esc(t('g.minutes', { n: lead.minutes })) + '</span><span>' + esc(lead.author) + '</span></span>' +
            '<span class="post-lead__title">' + esc(Catalog.postTitle(lead)) + '</span>' +
            '<span class="muted">' + esc(Catalog.postExcerpt(lead)) + '</span>' +
          '</a>'
        : '';

      $('[data-blog-list]').innerHTML = rest.map(function (p) {
        return '<a class="post-row reveal" href="article.html?slug=' + esc(p.slug) + '">' +
          '<span class="post-row__media"><img src="' + esc(p.cover) + '" alt="" loading="lazy" decoding="async" width="112" height="112"></span>' +
          '<span class="stack stack-3">' +
            '<span class="post-meta"><span>' + esc(t('bl.topic.' + p.topic)) + '</span><span>' + esc(p.date) + '</span><span>' + esc(t('g.minutes', { n: p.minutes })) + '</span></span>' +
            '<span class="post-row__title">' + esc(Catalog.postTitle(p)) + '</span>' +
            '<span class="muted text-md clamp-2">' + esc(Catalog.postExcerpt(p)) + '</span>' +
          '</span></a>';
      }).join('');

      UI.observeReveal();
    }

    doc.addEventListener('click', function (e) {
      var t = e.target.closest('[data-topic]');
      if (!t) return;
      topic = t.getAttribute('data-topic');
      global.history.replaceState(null, '', topic === 'all' ? 'blog.html' : 'blog.html?topic=' + encodeURIComponent(topic));
      renderFilters();
      renderList();
    });

    renderFilters();
    renderList();
  }

  /* ------------------------------------------------------------------
     ARTICLE
     ------------------------------------------------------------------ */
  function bootArticle() {
    var slug = new URLSearchParams(global.location.search).get('slug');
    var post = slug ? Catalog.post(slug) : null;
    if (!post) post = Catalog.posts()[0];

    doc.title = Catalog.postTitle(post) + ' | ' + global.BRAND.name;
    var meta = doc.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', Catalog.postExcerpt(post));

    $('[data-art-title]').textContent = Catalog.postTitle(post);
    $('[data-art-crumb]').textContent = t('bl.topic.' + post.topic);
    $('[data-art-excerpt]').textContent = Catalog.postExcerpt(post);
    $('[data-art-meta]').innerHTML =
      '<span>' + esc(t('bl.topic.' + post.topic)) + '</span><span>' + esc(post.date) + '</span>' +
      '<span>' + esc(t('g.minutes', { n: post.minutes })) + '</span><span>' + esc(post.author) + '</span>';
    var cover = $('[data-art-cover]');
    cover.src = post.cover;
    cover.alt = Catalog.postTitle(post);

    $('[data-art-body]').innerHTML = Catalog.postBody(post).map(function (b, i) {
      return '<section id="h' + i + '"><h2>' + esc(b[0]) + '</h2><p>' + esc(b[1]) + '</p></section>';
    }).join('');

    $('[data-art-toc]').innerHTML =
      '<p class="spec-group__title">' + esc(t('bl.inThis')) + '</p>' +
      Catalog.postBody(post).map(function (b, i) {
        return '<a href="#h' + i + '">' + esc(b[0]) + '</a>';
      }).join('');

    /* Products that relate to the article topic, so the piece has an exit. */
    var blob = (post.title + ' ' + post.excerpt + ' ' + post.slug).toLowerCase();
    var pool = Catalog.all.filter(function (p) {
      if (/ban phim|keyboard|trigger|switch|actuation/.test(blob)) return p.group === 'keyboard';
      if (/chuot|mouse|grip|feet|polling|claw/.test(blob)) return p.group === 'mouse';
      return p.available;
    });
    var picks = Catalog.sortItems(pool, 'best').slice(0, 4);
    $('[data-art-products]').innerHTML = Catalog.cards(picks);

    var others = Catalog.posts().filter(function (p) { return p.slug !== post.slug; }).slice(0, 3);
    $('[data-art-more]').innerHTML = others.map(function (p) {
      return '<a class="post-row reveal" href="article.html?slug=' + esc(p.slug) + '">' +
        '<span class="post-row__media"><img src="' + esc(p.cover) + '" alt="" loading="lazy" width="112" height="112"></span>' +
        '<span class="stack stack-3">' +
          '<span class="post-meta"><span>' + esc(t('bl.topic.' + p.topic)) + '</span><span>' + esc(t('g.minutes', { n: p.minutes })) + '</span></span>' +
          '<span class="post-row__title">' + esc(Catalog.postTitle(p)) + '</span>' +
        '</span></a>';
    }).join('');

    UI.observeReveal();
    UI.syncCounts();
  }

  function boot() {
    if ($('[data-blog-list]')) bootIndex();
    if ($('[data-art-body]')) bootArticle();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
