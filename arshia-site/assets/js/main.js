// Small interactions only: theme toggle, scroll reveal, gallery lightbox, footer year.
(function () {
  document.documentElement.classList.remove("no-js");

  // theme toggle (remembered per browser; falls back gracefully if storage is blocked)
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}
  var btn = document.querySelector(".theme-btn");
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function paint() {  }
  if (btn) {
    paint();
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });
  }

  // images that haven't been added yet turn into a labelled placeholder,
  // so dropping a file with the expected name into assets/img/ is all it takes.
  function toPlaceholder(img) {
    var ph = document.createElement("div");
    ph.className = "ph";
    if (img.style.cssText) ph.style.cssText = img.style.cssText;
    ph.textContent = img.getAttribute("data-ph") || "photo coming soon";
    img.replaceWith(ph);
  }
  document.querySelectorAll("img[data-ph]").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) toPlaceholder(img);
    else img.addEventListener("error", function () { toPlaceholder(img); });
  });

  document.querySelectorAll("img.peek").forEach(function (img) {
    function drop() { img.remove(); }
    if (img.complete && img.naturalWidth === 0) drop(); else img.addEventListener("error", drop);
  });

  // scroll reveal
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  // lightbox for real gallery images
  var imgs = document.querySelectorAll(".gallery img, .fig img, .thumbs img, .field img, .rec .th img, .press img");
  if (imgs.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = '<div><img alt=""><p></p></div>';
    document.body.appendChild(lb);
    var big = lb.querySelector("img"), cap = lb.querySelector("p");
    imgs.forEach(function (img) {
      img.tabIndex = 0;
      function open() {
        big.src = img.src; big.alt = img.alt;
        var fc = img.closest("figure") && img.closest("figure").querySelector("figcaption");
        cap.textContent = fc ? fc.textContent : "";
        lb.classList.add("open");
      }
      img.addEventListener("click", open);
      img.addEventListener("keydown", function (e) { if (e.key === "Enter") open(); });
    });
    lb.addEventListener("click", function () { lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("open"); });
  }

  // experience rail arrows
  document.querySelectorAll("[data-rail]").forEach(function (b) {
    b.addEventListener("click", function () {
      var rail = document.getElementById(b.getAttribute("data-rail"));
      if (rail) rail.scrollBy({ left: (+b.getAttribute("data-dir")) * Math.min(460, rail.clientWidth * 0.9), behavior: "smooth" });
    });
  });

  // "see more" on experience cards; hide the button when nothing is cut off
  document.querySelectorAll(".xcard .more").forEach(function (btn) {
    var card = btn.closest(".xcard"), list = card.querySelector(".bul");
    if (list && list.scrollHeight <= list.clientHeight + 4) { btn.hidden = true; list.style.maxHeight = "none"; list.classList.add("full"); return; }
    btn.addEventListener("click", function () {
      var open = card.classList.toggle("open");
      btn.textContent = open ? "see less" : "see more";
    });
  });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // hero: type through each role
  var cyc = document.querySelector(".cycle[data-words]");
  if (cyc && !reduce) {
    var words = cyc.getAttribute("data-words").split(","), wi = 0, ci = words[0].length, del = true;
    setTimeout(function step() {
      var w = words[wi];
      if (del) { ci--; if (ci === 0) { del = false; wi = (wi + 1) % words.length; } }
      else { ci++; if (ci === words[wi].length) { del = true; cyc.textContent = words[wi]; return setTimeout(step, 1800); } }
      cyc.textContent = words[wi].slice(0, ci) || "\u200b";
      setTimeout(step, del ? 45 : 85);
    }, 1800);
  }

  // count numbers up when they scroll into view
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, to = +el.getAttribute("data-count"), pre = el.getAttribute("data-prefix") || "", suf = el.getAttribute("data-suffix") || "", t0 = null;
        co.unobserve(el);
        requestAnimationFrame(function f(t) {
          if (!t0) t0 = t;
          var k = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - k, 3);
          el.textContent = pre + Math.round(to * e).toLocaleString("en-IN") + suf;
          if (k < 1) requestAnimationFrame(f);
        });
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { co.observe(c); });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
