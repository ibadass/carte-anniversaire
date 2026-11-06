(function () {
  const cfg = Object.assign({}, window.CARTE_CONFIG);
  const q = new URLSearchParams(location.search);
  ["nom", "age", "de", "message", "photo"].forEach((k) => q.get(k) && (cfg[k] = q.get(k)));
  if (q.get("modules")) cfg.modules = q.get("modules").split(",");

  const $ = (s) => document.querySelector(s);
  if (cfg.photo) {
    const img = document.createElement("img");
    img.className = "photo";
    img.alt = cfg.nom;
    img.src = cfg.photo;
    img.onerror = () => img.remove();
    $("#age").before(img);
  }
  $("#age").textContent = cfg.age;
  $("#titre").textContent = cfg.titre || "Joyeux anniversaire " + cfg.nom + " ! 🎂";
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
    },
    bisous: {
      label: "😘 Bisous",
      build(s) {
        s.append(el("p", "hint", "Des bisous pour toi, autant que tu veux !"));
        const b = el("button", "big", "😘 Envoyer des bisous !");
        b.dataset.fw = 1; b.onclick = () => kisses(30);
        s.append(b);
      },
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
    calendrier: {
      label: "📅 Calendrier",
      build(s) {
        s.append(el("p", "hint", "Touche une case pour ouvrir ton cadeau du jour 🎁"));
        const msg = el("div", "bulle", "Ouvre une case pour découvrir le message !");
        const g = el("div", "cal");
        cfg.calendrier.forEach((d, i) => {
          const c = el("button", "case");
          const inner = el("div", "in");
          inner.append(el("div", "face", String(i + 1)), el("div", "back", d.e));
          c.append(inner);
          c.onclick = () => {
            if (c.classList.contains("open")) return;
            c.classList.add("open");
            msg.textContent = d.e + " " + d.t;
            if (i === cfg.calendrier.length - 1) spectacle(6000);
          };
          g.append(c);
        });
        s.append(g, msg);
      },
    },
    passions: {
      label: "⚽ Passions",
      build(s) {
        s.append(el("p", "hint", "Ses passions, en quatre cartes"));
        const bulle = el("div", "bulle", "Touche une passion 👇");
        s.append(bulle);
        const g = el("div", "cards");
        cfg.passions.forEach((p) => {
          const c = el("button", "card bd");
          c.style.background = p.couleur;
          c.append(el("span", "e", p.emoji), el("b", "", p.titre));
          c.onclick = () => { bulle.textContent = p.emoji + " " + p.phrase; };
          g.append(c);
        });
        s.append(g);
      },
    },
    voyages: {
      label: "🌍 Voyages",
      build(s) {
        const total = cfg.voyages.length;
        const info = el("p", "hint", "Tour du monde : touche une étape pour la cocher ✅");
        s.append(info);
        const g = el("div", "cards");
        cfg.voyages.forEach((v) => {
          const c = el("button", "card");
          c.append(el("span", "e", v.emoji), el("b", "", v.lieu), el("small", "", v.ref));
          c.onclick = () => {
            c.classList.toggle("fait");
            const n = g.querySelectorAll(".fait").length;
            info.textContent = n === total ? "🎉 Tour du monde terminé !" : `${n} / ${total} étapes parcourues`;
          };
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
          c.onclick = () => { bulle.textContent = b.emoji + " " + b.phrase; };
          g.append(c);
        });
        s.append(g);
      },
    },
    western: {
      label: "🤠 Western",
      build(s) {
        s.append(el("p", "hint", "La trilogie du dollar de Sergio Leone, en mode Far West !"));
        const bulle = el("div", "bulle", "Pour une poignée de bisous… 🤠");
        s.append(bulle);
        const g = el("div", "cards");
        cfg.western.forEach((w) => {
          const c = el("button", "card bd");
          c.style.background = w.couleur;
          c.append(el("span", "e", w.emoji), el("b", "", w.titre), el("small", "", w.annee + " · " + w.acteur));
          c.onclick = () => { bulle.textContent = w.emoji + " " + w.phrase; };
          g.append(c);
        });
        s.append(g);
      },
    },
    voeux: {
      label: "💌 Vœux",
      build(s) {
        cfg.voeux.forEach((v) => s.append(el("div", "voeu", v)));
        const b = el("button", "big", "💋 Une pluie de bisous !");
        b.dataset.fw = 1; b.onclick = () => kisses(30);
        s.append(b);
      },
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
})();
