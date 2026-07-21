(function () {
  "use strict";

  // Mobile nav toggle
  function initMenu() {
    var btn = document.querySelector(".menu-btn");
    var panel = document.querySelector(".nav-mobile");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  // Contact form — inline confirmation, no backend wired yet
  function initForm() {
    var form = document.getElementById("form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var confirm = document.getElementById("form-confirm");
      if (confirm) confirm.style.display = "block";
      var submit = form.querySelector('button[type="submit"]');
      if (submit) submit.textContent = "Message received";
      form.reset();
    });
  }

  // Substack feed for the Insights page — replaces the hardcoded fallback rows
  function initFeed() {
    var list = document.getElementById("post-list");
    if (!list) return;

    var FEED = "https://denisealettaupa.substack.com/feed";

    function fmt(d) {
      var dt = new Date(d);
      return isNaN(dt) ? "" : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    function strip(html) {
      var div = document.createElement("div");
      div.innerHTML = html || "";
      var t = (div.textContent || "").trim().replace(/\s+/g, " ");
      return t.length > 200 ? t.slice(0, 197).replace(/\S*$/, "") + "…" : t;
    }
    function esc(s) {
      var d = document.createElement("div");
      d.textContent = s == null ? "" : String(s);
      return d.innerHTML;
    }
    function rowHTML(p) {
      return (
        '<div style="display: flex; flex-wrap: wrap; gap: 12px 32px; align-items: baseline; padding: 32px 0; border-bottom: 0.5px solid #DDD6CA">' +
          '<div style="font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #9A9187; flex: 0 0 148px">' + esc(p.date) + '</div>' +
          '<div style="flex: 1 1 480px">' +
            '<h3 style="font-family: \'Cardo\', Georgia, serif; font-weight: 400; font-size: 25px; line-height: 1.25; margin: 0 0 8px">' +
              '<a class="title-link" href="' + esc(p.href) + '" target="_blank" rel="noopener" style="color: #1C1815">' + esc(p.title) + '</a>' +
            '</h3>' +
            '<p style="font-size: 15px; line-height: 1.6; color: #6B645B; margin: 0; max-width: 72ch; text-wrap: pretty">' + esc(p.blurb) + '</p>' +
          '</div>' +
        '</div>'
      );
    }
    function render(posts) {
      if (!posts || !posts.length) return;
      list.innerHTML = posts.map(rowHTML).join("");
    }

    (function load() {
      fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(FEED))
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.status === "ok" && Array.isArray(j.items) && j.items.length) {
            render(j.items.map(function (it) {
              return { date: fmt(it.pubDate), title: it.title, blurb: strip(it.description), href: it.link };
            }));
            return true;
          }
          throw new Error("rss2json failed");
        })
        .catch(function () {
          fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(FEED))
            .then(function (r) { return r.text(); })
            .then(function (text) {
              var xml = new DOMParser().parseFromString(text, "text/xml");
              var items = Array.prototype.slice.call(xml.querySelectorAll("item")).map(function (it) {
                function q(sel) { var el = it.querySelector(sel); return el ? el.textContent : ""; }
                return { date: fmt(q("pubDate")), title: q("title"), blurb: strip(q("description")), href: q("link") || "#" };
              }).filter(function (p) { return p.title; });
              render(items);
            })
            .catch(function () { /* keep the hardcoded fallback rows already in the page */ });
        });
    })();
  }

  function init() {
    initMenu();
    initForm();
    initFeed();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
