/* ============================================================
   Syed Rayhan Ali — portfolio script
   Projects renderer · mobile menu · header state · active nav ·
   reveals
   ============================================================ */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ============================================================
     PROJECTS — edit here
     Add one object per project; the list re-renders on load.
     Use null for links that don't exist yet (renders a plain row).
     ============================================================ */
  var PROJECTS = [
    {
      number: "01",
      title: "Coming soon",
      description: "A project currently in development.",
      technologies: [],
      status: "coming soon",
      github: null,
      demo: null
    },
    {
      number: "02",
      title: "Coming soon",
      description: "A project currently in development.",
      technologies: [],
      status: "coming soon",
      github: null,
      demo: null
    },
    {
      number: "03",
      title: "Coming soon",
      description: "A project currently in development.",
      technologies: [],
      status: "coming soon",
      github: null,
      demo: null
    }
  ];

  /* ---------- project renderer ---------- */
  function renderProjects() {
    var list = document.getElementById("project-list");
    if (!list) return;

    list.innerHTML = "";
    PROJECTS.forEach(function (p) {
      var li = document.createElement("li");
      li.className = "project-row";

      var num = document.createElement("span");
      num.className = "project-row__num";
      num.textContent = p.number;

      var body = document.createElement("div");
      body.className = "project-row__body";

      var title = document.createElement("p");
      title.className = "project-row__title";
      title.textContent = p.status === "coming soon" ? "Coming soon" : p.title;

      var desc = document.createElement("p");
      desc.className = "project-row__desc";
      desc.textContent = p.technologies && p.technologies.length
        ? p.technologies.join(", ")
        : p.description;

      body.appendChild(title);
      body.appendChild(desc);

      var arrow = document.createElement("span");
      arrow.className = "project-row__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";

      li.appendChild(num);
      li.appendChild(body);
      li.appendChild(arrow);

      // Real project: the whole row opens its link via keyboard too.
      var href = p.github || p.demo;
      if (href) {
        li.tabIndex = 0;
        li.setAttribute("role", "link");
        li.style.cursor = "pointer";
        li.addEventListener("click", function () {
          window.open(href, "_blank", "noopener,noreferrer");
        });
        li.addEventListener("keydown", function (e) {
          if (e.key === "Enter") window.open(href, "_blank", "noopener,noreferrer");
        });
      }

      list.appendChild(li);
    });
  }

  /* ---------- mobile menu ---------- */
  function initMenu() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(!menu.classList.contains("is-open"));
    });

    // close after picking a section
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    // Escape closes and returns focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // reset when resizing back to desktop
    window.matchMedia("(min-width: 641px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- header scrolled state ---------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- active navigation ---------- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var sections = links
      .map(function (l) {
        var id = l.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);
    if (!sections.length) return;

    function update() {
      var pos = window.scrollY + window.innerHeight * 0.35;
      var currentId = sections[0].id;
      sections.forEach(function (s) {
        if (s.offsetTop <= pos) currentId = s.id;
      });
      links.forEach(function (l) {
        l.classList.toggle("is-active", l.getAttribute("href") === "#" + currentId);
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- reveal on scroll (gentle) ---------- */
  function initReveals() {
    if (reducedMotion.matches) return;

    var targets = document.querySelectorAll(
      ".section__title, .section__note, .section__copy, " +
      ".annotation, .explore-list, .project-list, .big-link"
    );
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) return; // content stays visible

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  /* ---------- hero load-in ---------- */
  // Adds .is-loaded one frame after init so the CSS stagger runs.
  function initHeroLoad() {
    var home = document.getElementById("home");
    if (!home || reducedMotion.matches) return;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        home.classList.add("is-loaded");
      });
    });
  }

  /* ---------- init ---------- */
  function init() {
    renderProjects();
    initMenu();
    initHeader();
    initActiveNav();
    initReveals();
    initHeroLoad();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
