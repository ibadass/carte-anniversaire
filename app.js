(function () {
  const cfg = Object.assign({}, window.CARTE_CONFIG);
  const q = new URLSearchParams(location.search);
  ["nom", "age", "de", "message"].forEach((k) => q.get(k) && (cfg[k] = q.get(k)));
  if (q.get("modules")) cfg.modules = q.get("modules").split(",");

  const $ = (s) => document.querySelector(s);
  $("#age").textContent = cfg.age;
  $("#titre").textContent = "Joyeux anniversaire " + cfg.nom + " ! 🎂";
  $("#message").textContent = cfg.message;
  $("#de").textContent = "Avec tout notre amour, " + cfg.de + " 💝";
  document.title = "Joyeux anniversaire " + cfg.nom + " !";

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.textContent = html;
    return e;
  };

  // ---------- Feux d'artifice ----------
  const fw = $("#fw"), fctx = fw.getContext("2d");
  let parts = [], fwTimer = null;
  function resize() {
    for (const c of [fw, $("#fx")]) { c.width = innerWidth; c.height = innerHeight; }
  }
  addEventListener("resize", resize); resize();
  function burst(x, y) {
    const hue = Math.random() * 360, n = 70;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n, v = 1 + Math.random() * 4;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 70 + Math.random() * 30, h: hue + Math.random() * 40 });
    }
    if (navigator.vibrate) navigator.vibrate(30);
  }
  function loopFw() {
    fctx.globalCompositeOperation = "destination-out";
    fctx.fillStyle = "rgba(0,0,0,.18)";
    fctx.fillRect(0, 0, fw.width, fw.height);
    fctx.globalCompositeOperation = "lighter";
    parts = parts.filter((p) => p.life > 0);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.985; p.life--;
      fctx.fillStyle = `hsla(${p.h},100%,60%,${Math.min(1, p.life / 40)})`;
      fctx.beginPath(); fctx.arc(p.x, p.y, 2.4, 0, 7); fctx.fill();
    }
    requestAnimationFrame(loopFw);
  }
  loopFw();
  function show() {
    burst(innerWidth * (0.15 + Math.random() * 0.7), innerHeight * (0.1 + Math.random() * 0.4));
  }
  function spectacle(ms) {
    clearInterval(fwTimer);
    show();
    fwTimer = setInterval(show, 450);
    setTimeout(() => clearInterval(fwTimer), ms);
  }
  addEventListener("pointerdown", (e) => { if (e.target.closest("[data-fw]")) return; burst(e.clientX, e.clientY); });

  // ---------- Bisous (pluie de cœurs) ----------
  const fx = $("#fx"), xctx = fx.getContext("2d");
  let hearts = [];
  const KISS = ["💋", "😘", "❤️", "💕", "🥰", "💖"];
  function kisses(n) {
    for (let i = 0; i < n; i++) hearts.push({
      x: Math.random() * fx.width, y: fx.height + 20 + Math.random() * 300,
      v: 1.5 + Math.random() * 3, s: 28 + Math.random() * 30, e: KISS[(Math.random() * KISS.length) | 0], w: Math.random() * 6,
    });
    if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
  }
  (function loopX() {
    xctx.clearRect(0, 0, fx.width, fx.height);
    hearts = hearts.filter((h) => h.y > -60);
    for (const h of hearts) {
      h.y -= h.v; h.w += 0.05;
      xctx.font = h.s + "px serif";
      xctx.fillText(h.e, h.x + Math.sin(h.w) * 20, h.y);
    }
    requestAnimationFrame(loopX);
  })();

  // ---------- Modules ----------
  const modules = {
    feux: {
      label: "🎆 Feux d'artifice",
      build(s) {
        s.append(el("p", "hint", "Touche l'écran pour tirer un feu d'artifice !"));
        const b = el("button", "big", "🎆 Lancer le grand spectacle !");
        b.dataset.fw = 1; b.onclick = () => spectacle(8000);
        s.append(b);
      },
      enter() { spectacle(5000); },
    },
    bisous: {
      label: "😘 Bisous",
      build(s) {
        s.append(el("p", "hint", "Des bisous pour toi, autant que tu veux !"));
        const b = el("button", "big", "😘 Envoyer des bisous !");
        b.dataset.fw = 1; b.onclick = () => kisses(30);
        s.append(b);
      },
      enter() { kisses(25); },
    },
    livres: {
      label: "📚 Livres",
      build(s) {
        s.append(el("p", "hint", "Quelques trésors de ta bibliothèque…"));
        const g = el("div", "cards");
        cfg.livres.forEach((l) => {
          const c = el("div", "card");
          c.append(el("span", "e", l.emoji), el("b", "", l.titre), el("small", "", l.auteur));
          g.append(c);
        });
        s.append(g);
      },
    },
    bd: {
      label: "💥 BD",
      build(s) {
        s.append(el("p", "hint", "Belges et françaises : touche une BD !"));
        const bulle = el("div", "bulle", "Pouf ! Pof ! Bam ! 💥");
        s.append(bulle);
        const g = el("div", "cards");
        cfg.bd.forEach((b) => {
          const c = el("button", "card bd");
          c.style.background = b.couleur;
          c.append(el("span", "e", b.emoji), el("b", "", b.titre), el("small", "", b.auteur));
          c.onclick = () => { bulle.textContent = b.emoji + " " + b.phrase; burst(innerWidth / 2, innerHeight / 3); };
          g.append(c);
        });
        s.append(g);
      },
    },
    voeux: {
      label: "💌 Vœux",
      build(s) {
        cfg.voeux.forEach((v) => s.append(el("div", "voeu", v)));
        const b = el("button", "big", "🎉 Tout en même temps !");
        b.dataset.fw = 1; b.onclick = () => { spectacle(8000); kisses(40); };
        s.append(b);
      },
      enter() { kisses(15); },
    },
  };

  const nav = $("#nav"), main = $("#main"), tabs = {};
  const active = cfg.modules.filter((m) => modules[m]);
  function select(id) {
    active.forEach((m) => {
      tabs[m].b.classList.toggle("on", m === id);
      tabs[m].s.classList.toggle("on", m === id);
    });
    modules[id].enter && modules[id].enter();
    scrollTo({ top: 0, behavior: "smooth" });
  }
  active.forEach((m) => {
    const b = el("button", "", modules[m].label);
    b.onclick = () => select(m);
    const s = el("section");
    modules[m].build(s);
    nav.append(b); main.append(s);
    tabs[m] = { b, s };
  });
  if (active.length) { tabs[active[0]].b.classList.add("on"); tabs[active[0]].s.classList.add("on"); }
  setTimeout(() => spectacle(4000), 500);
})();
