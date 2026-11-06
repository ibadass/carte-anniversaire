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
    proches: {
      label: "👥 Nos proches",
      build(s) {
        s.append(el("p", "hint", "Les personnes qui comptent pour toi 💛"));
        const list = el("div", "frise");
        (cfg.proches || []).forEach((p) => {
          const c = el("div", "etape");
          if (p.photo) {
            const img = el("img", "ph");
            img.src = p.photo;
            img.alt = p.titre;
            img.onerror = () => img.remove();
            c.append(img);
          }
          c.append(el("span", "e", p.emoji), el("b", "", p.titre));
          if (p.sous) c.append(el("small", "", p.sous));
          c.append(el("p", "", p.phrase));
          list.append(c);
        });
        s.append(list);
      },
    },
    oie: {
      label: "🎲 Jeu de l'oie",
      build(s) {
        const conf = cfg.oie || {};
        const oies = new Set(conf.oies || []);
        const pieges = new Map((conf.pieges || []).map((p) => [p.case, p]));
        const voitures = new Map((conf.voitures || []).map((v) => [v.case, v]));
        const blagues = conf.humour || [];
        const dlg = document.createElement("dialog");
        dlg.className = "pop";
        const humTxt = el("p", "pop-hum", "");
        const popTxt = el("p", "pop-txt", "");
        const close = el("button", "pop-close", "Continuer ✕");
        close.onclick = () => dlg.close();
        dlg.append(humTxt, popTxt, close);
        dlg.addEventListener("close", () => { const f = next; next = null; f && f(); });
        document.body.append(dlg);
        const say = (t, hum = "") => new Promise((res) => {
          next = res;
          humTxt.textContent = hum;
          popTxt.textContent = t;
          if (dlg.open) return;
          dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
        });

        const plateau = el("div", "plateau");
        const cells = {};
        for (let row = 7; row >= 0; row--) {
          const nums = [];
          for (let c = 0; c < 10; c++) nums.push(row * 10 + c + 1);
          if (row % 2 === 1) nums.reverse();
          nums.forEach((n) => {
            const kind = n === 80 ? " fin" : pieges.has(n) ? " piege" : oies.has(n) ? " oie" : voitures.has(n) ? " voiture" : "";
            const ico = n === 80 ? "🏁" : pieges.has(n) ? "🕳️" : oies.has(n) ? "🪿" : voitures.has(n) ? "🚗" : "";
            const c = el("div", "cell" + kind);
            c.append(el("span", "num", String(n)), el("span", "ico", ico));
            cells[n] = c;
            plateau.append(c);
          });
        }

        const depart = el("div", "depart", "Départ");
        const pion = el("span", "pion", "👴");
        const de = el("div", "scene");
        const cube = el("div", "cube");
        const faces = ["⚀", "⚅", "⚂", "⚃", "⚁", "⚄"];
        ["f1", "f6", "f3", "f4", "f2", "f5"].forEach((cls, i) => cube.append(el("div", "face " + cls, faces[i])));
        de.append(cube);
        const cubeAt = { x: 0, y: 0 };
        const SHOW = { 1: [0, 0], 6: [0, 180], 3: [0, -90], 4: [0, 90], 2: [-90, 0], 5: [90, 0] };
        const btn = el("button", "big", "🎲 Lancer le dé");
        const info = el("p", "hint", "Atteins la case 80 pour fêter tes 80 ans !");
        let pos = 0;
        let busy = false;
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const placePion = () => (pos ? cells[pos].append(pion) : depart.append(pion));
        const lit = (n, cls) => {
          const c = cells[n];
          if (!c) return;
          c.classList.remove(cls);
          void c.offsetWidth;
          c.classList.add(cls);
          setTimeout(() => c.classList.remove(cls), 1200);
        };
        const flash = (red) => {
          const f = el("div", "flash" + (red ? " red" : ""));
          document.body.append(f);
          setTimeout(() => f.remove(), 1000);
        };
        const move = async (to) => {
          const dir = to > pos ? 1 : -1;
          while (pos !== to) {
            pos += dir;
            placePion();
            await sleep(260);
          }
        };
        const reveal = async () => {
          const d = cfg.calendrier[pos - 1];
          cells[pos].classList.add("ouverte");
          lit(pos, "lit");
          flash();
          const hum = blagues.length ? "😂 " + blagues[(pos - 1) % blagues.length] : "";
          if (d) await say(d.e + " " + d.t, hum);
        };
        const arrive = async () => {
          if (!pos) return;
          if (pos === 80) {
            cells[80].classList.add("ouverte");
            lit(80, "lit");
            flash();
            spectacle(8000);
            await say("🏆 Bravo Papa ! Tu as atteint tes 80 ans !");
            info.textContent = "🏆 Tu as gagné ! Bon anniversaire Papa !";
            return;
          }
          if (pieges.has(pos)) {
            const p = pieges.get(pos);
            flash(true);
            lit(pos, "piege-hit");
            await say("🕳️ Piège ! " + p.t);
            await move(Math.max(0, pos - p.recul));
            return;
          }
          if (voitures.has(pos)) {
            lit(pos, "lit");
            flash();
            await say("🚗 " + voitures.get(pos).nom + " !", "😂 La blague : on ne connaît plus l'ordre...");
            return;
          }
          if (oies.has(pos)) {
            lit(pos, "lit");
            flash();
            await say("🪿 L'oie ! Tu avances de 2 cases bonus.");
            await move(Math.min(80, pos + 2));
            await arrive();
            return;
          }
          await reveal();
        };
        btn.onclick = async () => {
          if (busy || pos === 80) return;
          busy = true;
          btn.disabled = true;
          const r = 1 + Math.floor(Math.random() * 6);
          const [tx, ty] = SHOW[r];
          cubeAt.x = Math.round(cubeAt.x / 360) * 360 + 1080 + tx;
          cubeAt.y = Math.round(cubeAt.y / 360) * 360 + 1080 + ty;
          cube.style.transform = "rotateX(" + cubeAt.x + "deg) rotateY(" + cubeAt.y + "deg)";
          de.classList.remove("throw");
          void de.offsetWidth;
          de.classList.add("throw");
          let target = pos + r;
          if (target > 80) target = 160 - target;
          await move(target);
          await arrive();
          info.textContent = pos === 80 ? "🏆 Tu as gagné ! Bon anniversaire Papa !" : "Case " + pos + " / 80";
          busy = false;
          btn.disabled = pos === 80;
        };
        const raz = el("button", "big", "↺ RAZ");
        raz.onclick = () => {
          if (busy) return;
          pos = 0;
          Object.values(cells).forEach((c) => c.classList.remove("ouverte", "lit", "piege-hit"));
          placePion();
          info.textContent = "Atteins la case 80 pour fêter tes 80 ans !";
          btn.disabled = false;
        };
        const bar = el("div", "oie-bar");
        bar.append(depart, de, btn, raz);
        s.append(bar, info, plateau);
        placePion();
      },
    },
    calendrier: {
      label: "📅 Calendrier",
      build(s) {
        s.append(el("p", "hint", "Touche une case pour ouvrir ton cadeau du jour 🎁"));
        const dlg = document.createElement("dialog");
        dlg.className = "pop";
        const popTxt = el("p", "pop-txt", "");
        const close = el("button", "pop-close", "Fermer ✕");
        close.onclick = () => dlg.close();
        dlg.append(popTxt, close);
        dlg.addEventListener("click", (e) => e.target === dlg && dlg.close());
        document.body.append(dlg);
        const g = el("div", "cal");
        cfg.calendrier.forEach((d, i) => {
          const c = el("button", "case");
          const inner = el("div", "in");
          inner.append(el("div", "face", String(i + 1)), el("div", "back", d.e));
          c.append(inner);
          c.onclick = () => {
            if (!c.classList.contains("open")) c.classList.add("open");
            popTxt.textContent = d.e + " " + d.t;
            dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
            if (i === cfg.calendrier.length - 1) spectacle(6000);
          };
          g.append(c);
        });
        s.append(g);
      },
    },
    parcours: {
      label: "🧭 Parcours",
      build(s) {
        s.append(el("p", "hint", cfg.ne || ""));
        const list = el("div", "frise");
        (cfg.parcours || []).forEach((p) => {
          const c = el("div", "etape");
          c.append(el("span", "e", p.emoji), el("small", "", p.annee), el("b", "", p.titre), el("p", "", p.texte));
          list.append(c);
        });
        s.append(list);
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
  if (cfg.accueil) {
    const acc = document.createElement("dialog");
    acc.className = "pop";
    const ok = el("button", "pop-close", "C'est parti ✕");
    ok.onclick = () => acc.close();
    acc.append(el("p", "pop-txt", cfg.accueil), ok);
    document.body.append(acc);
    acc.showModal ? acc.showModal() : acc.setAttribute("open", "");
  }

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
