/**
 * Build static site into ./site (same output as the former Python script).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE = path.join(ROOT, "site");

function readUtf8(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function writeUtf8(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, "utf8");
}

function rmrf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function transformStrategyHtml(src) {
  let t = src.replace(/<style>[\s\S]*?<\/style>\s*/, "");
  t = t.replace(
    '<h2 class="sr-only">',
    '<h2 class="sr-only" id="strategy-heading">'
  );
  t = t.replace(
    '<div class="nav">',
    '<div class="strategy-tabs" role="tablist" aria-label="Strategy sections">'
  );
  const buttons = [
    [
      "<button class=\"nav-btn active\" onclick=\"show('positioning')\">",
      '<button type="button" role="tab" aria-selected="true" aria-controls="positioning" class="strategy-tab" data-tab="positioning" id="tab-positioning">',
    ],
    [
      "<button class=\"nav-btn\" onclick=\"show('icp')\">",
      '<button type="button" role="tab" aria-selected="false" aria-controls="icp" class="strategy-tab" data-tab="icp" id="tab-icp">',
    ],
    [
      "<button class=\"nav-btn\" onclick=\"show('channels')\">",
      '<button type="button" role="tab" aria-selected="false" aria-controls="channels" class="strategy-tab" data-tab="channels" id="tab-channels">',
    ],
    [
      "<button class=\"nav-btn\" onclick=\"show('content')\">",
      '<button type="button" role="tab" aria-selected="false" aria-controls="content" class="strategy-tab" data-tab="content" id="tab-content">',
    ],
    [
      "<button class=\"nav-btn\" onclick=\"show('lead')\">",
      '<button type="button" role="tab" aria-selected="false" aria-controls="lead" class="strategy-tab" data-tab="lead" id="tab-lead">',
    ],
    [
      "<button class=\"nav-btn\" onclick=\"show('automation')\">",
      '<button type="button" role="tab" aria-selected="false" aria-controls="automation" class="strategy-tab" data-tab="automation" id="tab-automation">',
    ],
    [
      "<button class=\"nav-btn\" onclick=\"show('kpis')\">",
      '<button type="button" role="tab" aria-selected="false" aria-controls="kpis" class="strategy-tab" data-tab="kpis" id="tab-kpis">',
    ],
  ];
  for (const [a, b] of buttons) t = t.split(a).join(b);
  const panels = [
    [
      '<div id="positioning" class="page active">',
      '<div id="positioning" class="strategy-page is-active" role="tabpanel" aria-labelledby="tab-positioning">',
    ],
    [
      '<div id="icp" class="page">',
      '<div id="icp" class="strategy-page" role="tabpanel" aria-labelledby="tab-icp">',
    ],
    [
      '<div id="channels" class="page">',
      '<div id="channels" class="strategy-page" role="tabpanel" aria-labelledby="tab-channels">',
    ],
    [
      '<div id="content" class="page">',
      '<div id="content" class="strategy-page" role="tabpanel" aria-labelledby="tab-content">',
    ],
    [
      '<div id="lead" class="page">',
      '<div id="lead" class="strategy-page" role="tabpanel" aria-labelledby="tab-lead">',
    ],
    [
      '<div id="automation" class="page">',
      '<div id="automation" class="strategy-page" role="tabpanel" aria-labelledby="tab-automation">',
    ],
    [
      '<div id="kpis" class="page">',
      '<div id="kpis" class="strategy-page" role="tabpanel" aria-labelledby="tab-kpis">',
    ],
  ];
  for (const [a, b] of panels) t = t.split(a).join(b);
  t = t.replace(/<script>[\s\S]*?<\/script>\s*/, "");
  return t.trim();
}

const INDEX_HEAD = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>RXS Meta — Marketing strategy &amp; playbook</title>
  <meta name="description" content="Full marketing strategy and AI automation playbook for RXS Meta Group of Companies — positioning, ICPs, channels, content, lead gen, automation, and KPIs." />
  <link rel="stylesheet" href="css/rxsmeta.css" />
</head>
<body>
  <a class="skip" href="#strategy-heading">Skip to strategy</a>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" href="./">
        <span class="site-brand__name">RXS Meta</span>
        <span class="site-brand__tag">Innovating with purpose</span>
      </a>
      <nav class="site-nav" aria-label="Site">
        <a href="./" aria-current="page">Strategy</a>
        <a href="whorxsmeta/">Who RXS Meta</a>
        <a href="rxspartners/">Partners</a>
        <a class="external" href="https://www.rxsmeta.com/" target="_blank" rel="noopener noreferrer">rxsmeta.com</a>
      </nav>
    </div>
  </header>

  <section class="hero" aria-label="Introduction">
    <div class="hero__inner">
      <p class="hero__eyebrow"><span aria-hidden="true"></span> AI-driven · ESG-focused</p>
      <h1>Innovating with purpose</h1>
      <p>Internal marketing strategy and automation playbook — aligned with the RXS Meta brand voice: business growth, responsible technology, and measurable impact for Philippine and ASEAN leaders.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#strategy-heading">Open playbook</a>
        <a class="btn btn--ghost" href="whorxsmeta/">Featured social carousel</a>
        <a class="btn btn--ghost" href="rxspartners/">Partner portfolio</a>
      </div>
    </div>
  </section>

  <main class="layout" id="main">
    <article class="strategy-doc" aria-labelledby="strategy-heading">
`;

const INDEX_FOOT = `
    </article>
  </main>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <span>RXS Meta Group of Companies · strategy microsite</span>
      <span><a href="https://www.rxsmeta.com/">www.rxsmeta.com</a></span>
    </div>
  </footer>

  <script>
  (function () {
    var tablist = document.querySelector(".strategy-tabs");
    if (!tablist) return;
    var tabs = [].slice.call(tablist.querySelectorAll(".strategy-tab"));
    var panels = {};
    tabs.forEach(function (btn) {
      var id = btn.getAttribute("data-tab");
      panels[id] = document.getElementById(id);
    });
    function show(id, opts) {
      opts = opts || {};
      tabs.forEach(function (btn) {
        var on = btn.getAttribute("data-tab") === id;
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
      });
      Object.keys(panels).forEach(function (k) {
        var p = panels[k];
        if (!p) return;
        p.classList.toggle("is-active", k === id);
      });
      if (opts.focusTab) {
        var b = tablist.querySelector('[data-tab="' + id + '"]');
        if (b) b.focus();
      }
      if (history.replaceState) {
        try {
          history.replaceState(null, "", "#" + id);
        } catch (e) {}
      }
    }
    tablist.addEventListener("click", function (e) {
      var btn = e.target.closest(".strategy-tab");
      if (!btn || !tablist.contains(btn)) return;
      show(btn.getAttribute("data-tab"), { focusTab: false });
    });
    tablist.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        show(next.getAttribute("data-tab"), { focusTab: true });
      }
    });
    tabs.forEach(function (btn, idx) {
      btn.tabIndex = idx === 0 ? 0 : -1;
    });
    function fromHash() {
      var h = (location.hash || "#positioning").slice(1);
      if (panels[h]) show(h);
      else show("positioning");
    }
    window.addEventListener("hashchange", fromHash);
    fromHash();
  })();
  </script>
</body>
</html>
`;

const CAROUSEL_RESPONSIVE_CSS = `

/* ——— FB/IG carousel embed ——— */
.fb-ig-root .stage,
.fb-ig-root .viewport {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  height: auto;
  aspect-ratio: 1;
}
.fb-ig-root .slide {
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  height: auto;
}
.fb-ig-root .slides,
.fb-ig-root .track {
  will-change: transform;
}

.fb-ig-root .wrap {
  width: 100%;
  max-width: 540px;
}
.fb-ig-root .nav-row {
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
.fb-ig-root .slide-count {
  width: 100%;
  text-align: center;
}

.partners-root .shell {
  width: 100%;
  max-width: 540px;
}
.partners-root .bar {
  width: 100% !important;
  max-width: 540px;
}
.partners-root .viewport + div[style*="justify-content"] {
  width: 100% !important;
  max-width: 540px !important;
}

@media (max-width: 559px) {
  .fb-ig-root .s1-headline {
    font-size: clamp(26px, 8vw, 40px);
  }
  .fb-ig-root .s1-content {
    padding: 28px 20px 24px;
  }
  .fb-ig-root .s2-top-content {
    padding: 24px 20px;
  }
  .fb-ig-root .s2-body {
    padding: 20px;
  }
  .fb-ig-root .s2-footer {
    padding: 0 20px 20px;
  }
  .fb-ig-root .s3-content,
  .fb-ig-root .s4-content,
  .fb-ig-root .s5-content,
  .fb-ig-root .s6-content {
    padding: 28px 20px;
  }
  .fb-ig-root .s3-services {
    grid-template-columns: 1fr;
  }
  .fb-ig-root .s4-stats {
    grid-template-columns: 1fr;
  }

  .partners-root .partner-card[style*="display:flex"] {
    flex-direction: column !important;
  }
  .partners-root .partner-card [style*="grid-template-columns:1fr 1fr 1fr"],
  .partners-root .partner-card [style*="grid-template-columns: 1fr 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
`;

/** Appended after partners fragment CSS so it wins over `.partner-card{ height:580px }` etc. */
const PARTNERS_LAYOUT_OVERRIDE = `

/* Partners: avoid clipping tall slides (e.g. KMS). Fragment uses fixed 580px height — override. */
.partners-root .viewport {
  width: 100%;
  max-width: 540px;
  margin: 0 auto;
  height: auto !important;
  min-height: 580px;
  aspect-ratio: unset !important;
}
.partners-root .track {
  align-items: stretch;
}
.partners-root .partner-card {
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  height: auto !important;
  min-height: 580px;
}
`;

function patchFbIgScript(html) {
  let out = html;
  /* Prefer percentage translate so slides stay aligned when sub-pixel widths differ from offsetWidth (fixes mobile “peek” of next slide). */
  if (out.includes("(cur*540)")) {
    out = out.replace(
      "slidesEl.style.transform='translateX(-'+(cur*540)+'px)';",
      "slidesEl.style.transform='translateX(-'+(cur*100)+'%)';"
    );
  }
  if (out.includes("offsetWidth||540")) {
    out = out.replace(
      /slidesEl\.style\.transform='translateX\(-'\+\(cur\*[^)]+\)\+'px\)';/,
      "slidesEl.style.transform='translateX(-'+(cur*100)+'%');"
    );
  }
  if (!out.includes("addEventListener('resize'")) {
    out = out.trim().replace(/<\/script>\s*$/i, "window.addEventListener('resize',function(){go(cur);});\n</script>");
  }
  return out + "\n";
}

function patchPartnersScript(html) {
  let out = html;
  if (out.includes("(cur*540)")) {
    out = out.replace(
      "track.style.transform='translateX(-'+(cur*540)+'px)';",
      "track.style.transform='translateX(-'+(cur*100)+'%)';"
    );
  }
  if (out.includes("offsetWidth||540")) {
    out = out.replace(
      /track\.style\.transform='translateX\(-'\+\(cur\*[^)]+\)\+'px\)';/,
      "track.style.transform='translateX(-'+(cur*100)+'%');"
    );
  }
  if (!out.includes("addEventListener('resize'")) {
    out = out.trim().replace(/<\/script>\s*$/i, "window.addEventListener('resize',function(){go(cur);});\n</script>");
  }
  return out + "\n";
}

function extractStyle(html) {
  const m = html.match(/<style>([\s\S]*?)<\/style>/);
  const css = m ? m[1].trim() : "";
  const body = html.replace(/<style>[\s\S]*?<\/style>\s*/, "").trim();
  return { css, body };
}

function subpageShell({ title, description, canonicalPath, current, mainInner }) {
  const nav = {
    home: '<a href="../">Strategy</a>',
    who: '<a href="../whorxsmeta/">Who RXS Meta</a>',
    partners: '<a href="../rxspartners/">Partners</a>',
  };
  if (current === "home") nav.home = '<a href="../" aria-current="page">Strategy</a>';
  else if (current === "who") nav.who = '<a href="../whorxsmeta/" aria-current="page">Who RXS Meta</a>';
  else if (current === "partners")
    nav.partners = '<a href="../rxspartners/" aria-current="page">Partners</a>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="stylesheet" href="../css/rxsmeta.css" />
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" href="../">
        <span class="site-brand__name">RXS Meta</span>
        <span class="site-brand__tag">Innovating with purpose</span>
      </a>
      <nav class="site-nav" aria-label="Site">
        ${nav.home}
        ${nav.who}
        ${nav.partners}
        <a class="external" href="https://www.rxsmeta.com/" target="_blank" rel="noopener noreferrer">rxsmeta.com</a>
      </nav>
    </div>
  </header>

  <main class="layout layout--sub" id="main">
    ${mainInner}
  </main>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <span>RXS Meta · ${canonicalPath}</span>
      <span><a href="https://www.rxsmeta.com/">www.rxsmeta.com</a></span>
    </div>
  </footer>
</body>
</html>
`;
}

function main() {
  rmrf(SITE);
  fs.mkdirSync(path.join(SITE, "css"), { recursive: true });

  fs.copyFileSync(
    path.join(ROOT, "css", "rxsmeta.css"),
    path.join(SITE, "css", "rxsmeta.css")
  );

  const strat = readUtf8("rxsmeta_marketing_strategy.html");
  const body = transformStrategyHtml(strat);
  writeUtf8(
    path.join("site", "index.html"),
    INDEX_HEAD + "\n" + body + "\n" + INDEX_FOOT
  );

  const carouselRaw = readUtf8("rxsmeta_carousel_fb_ig.html");
  let { css: cCss, body: cBody } = extractStyle(carouselRaw);
  cBody = patchFbIgScript(cBody);
  const extra =
    "\n/* carousel-fb-ig (source fragment) */\n" + cCss + CAROUSEL_RESPONSIVE_CSS;
  const cssPath = path.join(SITE, "css", "rxsmeta.css");
  fs.writeFileSync(cssPath, fs.readFileSync(cssPath, "utf8") + extra, "utf8");

  const whoMain = `
    <div class="sub-intro">
      <h1>Who RXS Meta</h1>
      <p>Six-slide carousel for Facebook and Instagram — brand story, services, ESG edge, advocacy pillars, and a clear call to action.</p>
    </div>
    <div class="carousel-host fb-ig-root" aria-label="Social carousel preview">
      ${cBody}
    </div>
    `;

  fs.mkdirSync(path.join(SITE, "whorxsmeta"), { recursive: true });
  fs.writeFileSync(
    path.join(SITE, "whorxsmeta", "index.html"),
    subpageShell({
      title: "Who RXS Meta — Featured FB &amp; IG carousel | RXS Meta",
      description:
        "RXS Meta featured social carousel — AI-driven, ESG-focused consultancy story for Facebook and Instagram.",
      canonicalPath: "/whorxsmeta",
      current: "who",
      mainInner: whoMain,
    }),
    "utf8"
  );

  const partnersRaw = readUtf8("rxsmeta_partners_v2.html");
  let { css: pCss, body: pBody } = extractStyle(partnersRaw);
  pBody = pBody.replace(/class="card"/g, 'class="partner-card"');
  pBody = pBody.replace(
    "justify-content:space-between;width:540px",
    "justify-content:space-between;width:100%;max-width:540px"
  );
  pBody = patchPartnersScript(pBody);
  pCss = pCss.split(".card").join(".partner-card");

  fs.writeFileSync(
    cssPath,
    fs.readFileSync(cssPath, "utf8") +
      "\n/* partners v2 (source fragment) */\n" +
      pCss +
      "\n/* partners layout override */\n" +
      PARTNERS_LAYOUT_OVERRIDE,
    "utf8"
  );

  const partnersMain = `
    <div class="sub-intro">
      <h1>RXS Partners</h1>
      <p>Brand partner portfolio carousel — go-to technology alliances and opportunistic portfolio relationships.</p>
    </div>
    <div class="carousel-host partners-root" aria-label="Partners carousel preview">
      ${pBody}
    </div>
    `;

  fs.mkdirSync(path.join(SITE, "rxspartners"), { recursive: true });
  fs.writeFileSync(
    path.join(SITE, "rxspartners", "index.html"),
    subpageShell({
      title: "RXS Partners — Technology portfolio | RXS Meta",
      description:
        "RXS Meta partner network — ServeDeck, Corsight AI, ECO-OS, Glem AI, KMS Lighthouse, BigID, and Roxas Management Consultancy.",
      canonicalPath: "/rxspartners",
      current: "partners",
      mainInner: partnersMain,
    }),
    "utf8"
  );

  console.log("Built", SITE);
}

main();
