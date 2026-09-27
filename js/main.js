/* ============================================================
   MAIN SCRIPT
   Modules: boot sequence, mobile menu, active nav, scroll
   header state, reveal animations, project renderer.
   ============================================================ */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ----------------------------------------------------------
     EDIT HERE: your projects.
     Add a new object to this array and it will appear in the
     Projects section automatically (when JS is enabled).
     For links you don't have yet, leave the value as null —
     that button renders as disabled.
     ---------------------------------------------------------- */
  var PROJECTS = [
    {
      num: "01",
      title: "COMING SOON",
      description: "Project description will appear here.",
      tech: [],
      status: "IN DEVELOPMENT",
      github: null,
      demo: null
    },
    {
      num: "02",
      title: "COMING SOON",
      description: "Project description will appear here.",
      tech: [],
      status: "IN DEVELOPMENT",
      github: null,
      demo: null
    },
    {
      num: "03",
      title: "COMING SOON",
      description: "Project description will appear here.",
      tech: [],
      status: "IN DEVELOPMENT",
      github: null,
      demo: null
    }
  ];

  /* ---------- BOOT SEQUENCE ---------- */
  // Runs only if JS works AND the user allows motion. Short,
  // and the page underneath is already usable without it.
  function runBoot() {
    if (reducedMotion.matches) return;

    var boot = document.getElementById("boot");
    if (!boot) return;

    boot.classList.add("is-active");
    document.body.style.overflow = "hidden";

    var total = 1300; // keep it short
    window.setTimeout(function () {
      boot.classList.add("is-fading");
      document.body.style.overflow = "";
      window.setTimeout(function () {
        boot.remove();
      }, 350);
    }, total);

    // Allow skipping with Escape
    document.addEventListener(
      "keydown",
      function skip(e) {
        if (e.key === "Escape") {
          boot.remove();
          document.body.style.overflow = "";
          document.removeEventListener("keydown", skip);
        }
      },
      { once: false }
    );
  }

  /* ---------- MOBILE MENU ---------- */
  function initMenu() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });

    // Close after choosing a section
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    // Close with Escape and return focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset state when resizing back to desktop
    window.matchMedia("(min-width: 821px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- SCROLLED HEADER STATE ---------- */
  function initHeaderState() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- ACTIVE NAVIGATION ---------- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".nav__link")
    );
    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);
    if (!sections.length) return;

    function update() {
      var pos = window.scrollY + window.innerHeight * 0.35;
      var currentId = sections[0].id;

      sections.forEach(function (section) {
        if (section.offsetTop <= pos) currentId = section.id;
      });

      links.forEach(function (link) {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === "#" + currentId
        );
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length || reducedMotion.matches) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- PROJECT RENDERER ---------- */
  // Rebuilds #project-list from the PROJECTS array above.
  // The static HTML in index.html is the no-JS fallback.
  function renderProjects() {
    var list = document.getElementById("project-list");
    if (!list) return;

    function buildCard(p) {
      var card = document.createElement("article");
      card.className = "project-card corners";

      var techText = p.tech && p.tech.length ? p.tech.join(", ") : "—";
      var githubBtn = p.github
        ? '<a class="btn btn--small" href="' + p.github + '" target="_blank" rel="noopener noreferrer">GITHUB</a>'
        : '<button class="btn btn--small" type="button" disabled>GITHUB</button>';
      var demoBtn = p.demo
        ? '<a class="btn btn--small" href="' + p.demo + '" target="_blank" rel="noopener noreferrer">VIEW PROJECT</a>'
        : '<button class="btn btn--small" type="button" disabled>VIEW PROJECT</button>';

      card.innerHTML =
        '<div class="project-card__top">' +
        '<span class="project-card__num">PROJECT ' + p.num + "</span>" +
        '<span class="project-card__status">' + p.status + "</span>" +
        "</div>" +
        '<h3 class="project-card__title">' + p.title + "</h3>" +
        '<p class="project-card__desc">' + p.description + "</p>" +
        '<div class="project-card__meta">' +
        '<span class="meta-label">TECH</span>' +
        '<span class="meta-value">' + techText + "</span>" +
        "</div>" +
        '<div class="project-card__actions">' + demoBtn + githubBtn + "</div>";

      return card;
    }

    list.innerHTML = "";
    PROJECTS.forEach(function (p) {
      list.appendChild(buildCard(p));
    });
  }

  /* ---------- INIT ---------- */
  function init() {
    runBoot();
    initMenu();
    initHeaderState();
    initActiveNav();
    initReveals();
    renderProjects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
