/* ============================================================
   ECG / DATA WAVEFORM
   Draws a thin green "signal" waveform across the viewport as
   an SVG path. Loops by shifting the sample window one point at
   a time, so the motion is continuous without rebuilding the
   DOM tree. Fully static when prefers-reduced-motion is set.
   ============================================================ */
(function () {
  "use strict";

  var STEP_MS = 90; // ms between waveform shifts
  var RIPPLE = 8; // amplitude of small background ripples
  var PEAK = 38; // amplitude of occasional signal peaks

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var contexts = [];
  var timer = null;

  // Build one waveform context per .ecg-band on the page
  function setup() {
    var bands = document.querySelectorAll(".ecg-band");
    bands.forEach(function (band) {
      var svg = band.querySelector(".ecg-svg");
      var track = band.querySelector(".ecg-track");
      if (!svg || !track) return;
      var ctx = { svg: svg, track: track, points: [], count: 0, width: 0, height: 100, spacing: 14, phase: 0 };
      contexts.push(ctx);
      resize(ctx);
    });
  }

  function resize(ctx) {
    var rect = ctx.svg.getBoundingClientRect();
    if (!rect.width) return;

    // Fewer points on small screens (lighter + calmer on mobile)
    ctx.spacing = rect.width < 600 ? 22 : 14;
    ctx.width = Math.ceil(rect.width);
    ctx.height = rect.height || 100;

    ctx.svg.setAttribute("viewBox", "0 0 " + ctx.width + " " + ctx.height);
    ctx.svg.setAttribute("preserveAspectRatio", "none");

    ctx.count = Math.ceil(ctx.width / ctx.spacing) + 2;
    ctx.points = [];
    for (var i = 0; i < ctx.count; i++) {
      ctx.points.push(sample(i + ctx.phase, ctx.height));
    }
    render(ctx);
  }

  // Wave shape: soft ripples + an occasional heartbeat-like peak
  function sample(n, height) {
    var ripple =
      Math.sin(n * 0.55) * 2 +
      Math.sin(n * 0.21 + 1.3) * (RIPPLE * 0.5);

    var local = n % 37; // one peak roughly every 37 samples
    var peak = 0;
    if (local >= 15 && local <= 24) {
      var t = (local - 15) / 9; // 0..1 across the peak
      peak = -Math.sin(t * Math.PI) * PEAK * (0.7 + 0.3 * Math.sin(n * 0.37));
    }

    var y = height / 2 + ripple + peak;
    if (y < 6) y = 6;
    if (y > height - 6) y = height - 6;
    return y;
  }

  function render(ctx) {
    var d = "";
    for (var i = 0; i < ctx.points.length; i++) {
      d += (i === 0 ? "M" : "L") + (i * ctx.spacing).toFixed(1) + " " + ctx.points[i].toFixed(1);
    }
    ctx.track.innerHTML =
      '<path vector-effect="non-scaling-stroke" d="' + d + '"></path>';
  }

  function tick() {
    contexts.forEach(function (ctx) {
      ctx.phase += 1;
      ctx.points.shift();
      ctx.points.push(sample(ctx.count - 1 + ctx.phase, ctx.height));
      render(ctx);
    });
  }

  function start() {
    if (timer || reducedMotion.matches) return;
    timer = window.setInterval(tick, STEP_MS);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  window.addEventListener("resize", function () {
    contexts.forEach(resize);
  });

  // React if the user changes motion preference mid-session
  function onMotionChange() {
    if (reducedMotion.matches) {
      stop();
    } else {
      start();
    }
  }
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", onMotionChange);
  }

  function init() {
    setup();
    if (!contexts.length) return;

    if (reducedMotion.matches) {
      contexts.forEach(resize); // single static frame
    } else {
      start();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
