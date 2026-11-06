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
  $("#accueil").textContent = cfg.accueil || "";
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
        const cadeaux = new Set(conf.cadeaux || []);
        const questions = new Map((conf.questions || []).map((q) => [q.case, q]));
        const pieges = new Map((conf.pieges || []).map((p) => [p.case, p]));
        // Cases libres : blague, personne, blague, personne, musique
        const libres = new Map();
        const seq = ["blague", "personnes", "blague", "personnes", "musiques"];
        const cnt = {};
        let li = 0;
        for (let n = 1; n < 80; n++) {
          if (cadeaux.has(n) || questions.has(n) || pieges.has(n)) continue;
          const k = seq[li++ % seq.length];
          const key = k === "blague" ? "blagues" : k;
          const arr = conf[key] || [];
          cnt[key] = (cnt[key] || 0) + 1;
          if (arr.length) libres.set(n, { kind: k, txt: arr[(cnt[key] - 1) % arr.length] });
        }
        const dlg = document.createElement("dialog");
        dlg.className = "pop";
        const popTxt = el("p", "pop-txt", "");
        const close = el("button", "pop-close", "Continuer ✕");
        close.onclick = () => dlg.close();
        dlg.append(popTxt, close);
        dlg.addEventListener("close", () => { const f = next; next = null; f && f(); });
        document.body.append(dlg);
        const say = (t) => new Promise((res) => {
          next = res;
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
            const lib = libres.get(n);
            const kind = n === 80 ? " fin" : pieges.has(n) ? " piege" : cadeaux.has(n) ? " cadeau" : questions.has(n) ? " question" : lib ? " " + lib.kind : "";
            const ico = n === 80 ? "🏁" : pieges.has(n) ? pieges.get(n).e : cadeaux.has(n) ? "🎁" : questions.has(n) ? "❓" : lib ? { blague: "😂", personnes: "👪", musiques: "🎵" }[lib.kind] : "";
            const c = el("div", "cell" + kind + (n === 80 ? "" : " cache"));
            c._ico = ico;
            c.append(el("span", "num", String(n)), el("span", "ico", n === 80 ? ico : "❔"));
            cells[n] = c;
            plateau.append(c);
          });
        }

        const depart = el("div", "depart", "Départ");
        const pion = el("span", "pion", "👴");
        const de = el("div", "scene");
        const cube = el("div", "cube");
        const faces = ["⚀", "⚅", "⚂", "⚃", "⚁", "⚄"];
        const faceEl = {};
        ["f1", "f6", "f3", "f4", "f2", "f5"].forEach((cls, i) => {
          faceEl[cls] = el("div", "face " + cls, faces[i]);
          cube.append(faceEl[cls]);
        });
        const f6 = faceEl.f6;
        const pipsF6 = f6.textContent;
        const photoOn = () => {
          f6.textContent = "";
          f6.classList.add("photo-face");
          if (cfg.photo) f6.style.backgroundImage = "url(" + cfg.photo + ")";
        };
        const photoOff = () => {
          f6.textContent = pipsF6;
          f6.classList.remove("photo-face");
          f6.style.backgroundImage = "";
        };
        let lancers = 0;
        const EVERY = 5;
        const choisir = () => new Promise((res) => {
          Object.keys(cells).forEach((k) => {
            if (+k === 80) return;
            cells[k].classList.add("choix");
            cells[k].onclick = () => {
              Object.values(cells).forEach((c) => { c.classList.remove("choix"); c.onclick = null; });
              res(+k);
            };
          });
        });
        de.append(cube);
        const cubeAt = { x: 0, y: 0 };
        const SHOW = { 1: [0, 0], 6: [0, 180], 3: [0, -90], 4: [0, 90], 2: [-90, 0], 5: [90, 0] };
        const btn = el("button", "big", "🚀 Démarrer le jeu");
        cube.classList.add("idle");
        const rnd6 = () => {
          const a = new Uint32Array(1);
          do crypto.getRandomValues(a); while (a[0] >= 4294967292); // évite le biais du modulo
          return (a[0] % 6) + 1;
        };
        const info = el("p", "hint", "Atteins la case 80 pour fêter tes 80 ans !");
        let pos = 0;
        let busy = false;
        let stageEl;
        const board = el("div", "board");
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
        const reveal = async (n) => {
          const p = pieges.get(n);
          if (p) {
            cells[n].classList.add("ouverte", "piege-hit");
            flash(true);
            await say(p.e + " " + p.titre);
            await say(p.gage);
            return;
          }
          const lib = libres.get(n);
          if (lib) {
            cells[n].classList.add("ouverte");
            lit(n, "lit");
            flash();
            await say(lib.kind === "blague" ? "😂 Blague de Papa : " + lib.txt : lib.txt);
            return;
          }
          const q = questions.get(n);
          if (!q) return;
          cells[n].classList.add("ouverte");
          lit(n, "lit");
          flash();
          await say("❓ " + q.q);
          await say("💡 " + q.r);
        };
        const decouvrir = (n) => {
          cells[n].classList.remove("cache");
          cells[n].querySelector(".ico").textContent = cells[n]._ico;
        };
        const arrive = async (n) => {
          decouvrir(n);
          if (n === 80) {
            cells[80].classList.add("ouverte");
            lit(80, "lit");
            flash();
            spectacle(8000);
            await say("🏆 Bravo Papa ! Tu as atteint tes 80 ans !");
            info.textContent = "🏆 Tu as gagné ! Bon anniversaire Papa !";
            return;
          }
          if (cadeaux.has(n)) {
            cells[n].classList.add("ouverte");
            lit(n, "lit");
            flash();
            await say("🎁 Cadeau ! Ouvre le cadeau physique qui t'attend !");
            return;
          }
          await reveal(n);
        };
        btn.onclick = async () => {
          if (busy || pos === 80) return;
          busy = true;
          btn.disabled = true;
          lancers++;
          const bonus = lancers % EVERY === 0;
          const r = bonus ? 6 : rnd6();
          if (bonus) photoOn();
          cube.classList.remove("idle");
          void cube.offsetWidth;
          const [tx, ty] = SHOW[r];
          cubeAt.x = Math.round(cubeAt.x / 360) * 360 + 1080 + tx;
          cubeAt.y = Math.round(cubeAt.y / 360) * 360 + 1080 + ty;
          cube.style.transform = "rotateX(" + cubeAt.x + "deg) rotateY(" + cubeAt.y + "deg)";
          de.classList.remove("throw");
          void de.offsetWidth;
          de.classList.add("throw");
          await sleep(1900);
          if (bonus) {
            board.scrollIntoView({ behavior: "smooth", block: "start" });
            info.textContent = "✨ Touche la case où tu veux aller !";
            await say("✨ Face magique ! Choisis n'importe quelle case du plateau : le pion s'y téléporte (sauf l'arrivée, pas de raccourci vers la victoire !).");
            const n = await choisir();
            cells[n].scrollIntoView({ behavior: "smooth", block: "center" });
            pos = n;
            placePion();
            flash();
            await sleep(500);
            await arrive(pos);
            photoOff();
            stageEl.scrollIntoView({ behavior: "smooth", block: "start" });
            info.textContent = "Case " + pos + " / 80";
            busy = false;
            btn.disabled = false;
            return;
          }
          let target = pos + r;
          if (target > 80) target = 160 - target;
          cells[Math.min(target, 80)].scrollIntoView({ behavior: "smooth", block: "center" });
          await move(target);
          await arrive(pos);
          stageEl.scrollIntoView({ behavior: "smooth", block: "start" });
          const reste = EVERY - (lancers % EVERY);
          info.textContent = pos === 80 ? "🏆 Tu as gagné ! Bon anniversaire Papa !" : "Case " + pos + " / 80 · ✨ face magique dans " + reste + " lancer" + (reste > 1 ? "s" : "");
          busy = false;
          btn.textContent = "🎲 Lancer le dé";
          btn.disabled = pos === 80;
        };
        const raz = el("button", "big", "↺ RAZ");
        raz.onclick = () => {
          if (busy) return;
          pos = 0;
          lancers = 0;
          Object.keys(cells).forEach((k) => {
            cells[k].classList.remove("ouverte", "lit", "piege-hit");
            if (+k !== 80) {
              cells[k].classList.add("cache");
              cells[k].querySelector(".ico").textContent = "❔";
            }
          });
          placePion();
          info.textContent = "Atteins la case 80 pour fêter tes 80 ans !";
          btn.disabled = false;
          btn.textContent = "🚀 Démarrer le jeu";
          cube.classList.add("idle");
        };
        const stage = el("div", "stage");
        const row = el("div", "oie-bar");
        row.append(depart, raz);
        stage.append(el("h2", "stage-t", "À toi de jouer, Papa !"), de, btn, info, row);
        board.append(el("h2", "stage-t", "Le plateau"), el("p", "hint", "Chaque case est à découvrir… 🤫"), plateau);
        s.append(stage, board);
        stageEl = stage;
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
  if (active.length < 2) nav.hidden = true;
  if (active.length) { tabs[active[0]].b.classList.add("on"); tabs[active[0]].s.classList.add("on"); }
})();
