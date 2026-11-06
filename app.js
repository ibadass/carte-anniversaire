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
  // Bonne réponse : feu d'artifice en forme de cœur + « BOOM ! », affichés par-dessus la fenêtre de question
  function heartBurst(x, y, taille) {
    const n = 90;
    for (let i = 0; i < n; i++) {
      const t = (Math.PI * 2 * i) / n, s = taille * (0.9 + Math.random() * 0.2);
      const hx = 16 * Math.sin(t) ** 3;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      parts.push({ x, y, vx: hx * s, vy: hy * s - 0.4, life: 80 + Math.random() * 20, h: 330 + Math.random() * 30 });
    }
  }
  function heartBoom() {
    const top = (el) => { el.setAttribute("popover", "manual"); el.showPopover && el.showPopover(); };
    const fin = (el, rm) => { try { el.hidePopover && el.hidePopover(); } catch (e) {} rm ? el.remove() : el.removeAttribute("popover"); };
    top(fw);
    const b = document.createElement("div");
    b.className = "boom";
    b.innerHTML = "<span>💖</span><b>BOOM !</b>";
    document.body.append(b);
    top(b);
    const w = innerWidth, h = innerHeight;
    heartBurst(w / 2, h * 0.38, 0.3);
    setTimeout(() => heartBurst(w * 0.2, h * 0.25, 0.17), 250);
    setTimeout(() => heartBurst(w * 0.8, h * 0.25, 0.17), 450);
    setTimeout(show, 150); setTimeout(show, 350); setTimeout(show, 600);
    if (navigator.vibrate) navigator.vibrate([40, 40, 80]);
    setTimeout(() => fin(b, true), 1700);
    setTimeout(() => fin(fw, false), 3200);
  }
  function spectacle(ms) {
    clearInterval(fwTimer);
    show();
    fwTimer = setInterval(show, 450);
    setTimeout(() => clearInterval(fwTimer), ms);
  }

  function grandFinal() {
    clearInterval(fwTimer);
    let t = 0;
    const salve = () => {
      for (let i = 0; i < 3; i++) setTimeout(show, i * 120);
      if (t++ % 8 === 0) kisses(12);
    };
    salve();
    fwTimer = setInterval(() => {
      salve();
      if (t > 160) clearInterval(fwTimer);
    }, 300);
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
        const melange = (arr) => {
          const t = arr.slice();
          for (let i = t.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [t[i], t[j]] = [t[j], t[i]];
          }
          return t;
        };
        // Les 20 cases questions piochent au hasard dans un lot plus grand (questions + questionsPlus)
        const slots = (conf.questions || []).map((q) => q.case);
        const faciles = (conf.questions || []).map((q) => ({ q: q.q, r: q.r, choix: (conf.choix || {})[q.case] })).concat(conf.questionsPlus || []);
        // Questions difficiles d'abord ; les plus faciles ne servent que s'il en manque
        let questions = new Map();
        const tirerQuestions = () => {
          const tirage = melange(conf.questionsDures || []).concat(melange(faciles));
          questions = new Map(slots.map((c, i) => [c, tirage[i]]).filter((e) => e[1]));
        };
        tirerQuestions();
        const pieges = new Map((conf.pieges || []).map((p) => [p.case, p]));
        // Cases libres : blague, personne, blague, personne, musique
        const SUD = conf.sudoku || {};
        const SYM = { 10: "0123456789", 15: "123456789ABCDEF" };
        const DIM = { 10: [2, 5], 15: [3, 5] }; // lignes x colonnes par bloc
        // Grille valide : motif de base, puis chiffres, lignes et colonnes permutés au hasard
        const nouvelleGrille = (N) => {
          const [R, C] = DIM[N];
          const perm = melange([...SYM[N]]);
          const rows = melange([...Array(N / R).keys()]).flatMap((b) => melange([...Array(R).keys()]).map((k) => b * R + k));
          const cols = melange([...Array(N / C).keys()]).flatMap((p) => melange([...Array(C).keys()]).map((k) => p * C + k));
          const sol = rows.map((r) => cols.map((c) => perm[(C * (r % R) + Math.floor(r / R) + c) % N]));
          const vides = new Set(melange([...Array(N * N).keys()]).slice(0, SUD.vides ? SUD.vides[N] : 40));
          const puzzle = sol.map((row, r) => row.map((ch, c) => (vides.has(r * N + c) ? "." : ch)).join(""));
          return { N, R, C, puzzle, solution: sol.map((r) => r.join("")), val: puzzle.map((r) => r.split("")), fait: false };
        };
        const sudokus = new Map((SUD.grilles || []).map((g) => [g.case, nouvelleGrille(g.n)]));
        const libres = new Map();
        // Les types de cases sont fixes, mais le contenu (blague, personne, musique) est retiré à chaque partie
        const tirerLibres = () => {
          libres.clear();
          const seq = ["blague", "personnes", "blague", "personnes", "musiques"];
          const lots = {};
          const cnt = {};
          let li = 0;
          for (let n = 1; n < 80; n++) {
            if (cadeaux.has(n) || questions.has(n) || pieges.has(n) || sudokus.has(n)) continue;
            const k = seq[li++ % seq.length];
            const key = k === "blague" ? "blagues" : k;
            const arr = lots[key] || (lots[key] = melange(conf[key] || []));
            cnt[key] = (cnt[key] || 0) + 1;
            if (arr.length) libres.set(n, { kind: k, txt: arr[(cnt[key] - 1) % arr.length] });
          }
        };
        tirerLibres();
        const dlg = document.createElement("dialog");
        dlg.className = "pop";
        const popTxt = el("p", "pop-txt", "");
        const close = el("button", "pop-close alt", "Continuer ✕");
        close.onclick = () => dlg.close();
        // Raccourci : fermer la case et relancer le dé d'un seul geste
        let veutLancer = false;
        const lancer = el("button", "pop-close", "🎲 Lancer le dé");
        lancer.onclick = () => { veutLancer = true; dlg.close(); };
        const actions = el("div", "pop-actions");
        actions.append(lancer, close);
        const montrerActions = (v) => { close.hidden = !v; lancer.hidden = !v || pos >= 80; };
        const opts = el("div", "pop-opts");
        const popImg = el("img", "pop-img");
        popImg.hidden = true;
        popImg.onerror = () => { popImg.hidden = true; };
        dlg.append(popImg, popTxt, opts, actions);
        dlg.addEventListener("close", () => { const f = next; next = null; f && f(); });
        document.body.append(dlg);
        const say = (t) => new Promise((res) => {
          next = res;
          popTxt.textContent = t;
          opts.replaceChildren();
          popImg.hidden = true;
          montrerActions(true);
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
            const kind = n === 80 ? " fin" : pieges.has(n) ? " piege" : cadeaux.has(n) ? " cadeau" : questions.has(n) ? " question" : sudokus.has(n) ? " sudoku" : lib ? " " + lib.kind : "";
            const ico = n === 80 ? "🏁" : pieges.has(n) ? pieges.get(n).e : cadeaux.has(n) ? "🎁" : questions.has(n) ? "❓" : sudokus.has(n) ? "🧩" : lib ? { blague: "😂", personnes: "👪", musiques: "🎵" }[lib.kind] : "";
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
        const PIPS = { f1: [4], f2: [0, 8], f3: [0, 4, 8], f4: [0, 2, 6, 8], f5: [0, 2, 4, 6, 8] };
        const faceEl = {};
        ["c1", "c2", "c3", "c4", "c5", "c6"].forEach((cls) => cube.append(el("div", "core " + cls)));
        ["f1", "f6", "f3", "f4", "f2", "f5"].forEach((cls) => {
          const f = el("div", "face " + cls);
          if (PIPS[cls]) {
            for (let k = 0; k < 9; k++) f.append(el("i", PIPS[cls].includes(k) ? "pip" : ""));
            f.classList.add("pips");
          }
          faceEl[cls] = f;
          cube.append(f);
        });
        const f6 = faceEl.f6;
        f6.classList.add("photo-face");
        if (cfg.photo) f6.style.backgroundImage = "url(" + cfg.photo + ")";
        let lancers = 0;
        const choisir = () => new Promise((res) => {
          Object.keys(cells).forEach((k) => {
            if (+k === 80 || cells[k].classList.contains("ouverte") || cells[k].contains(pion)) return;
            cells[k].classList.add("choix");
            cells[k].onclick = () => {
              Object.values(cells).forEach((c) => { c.classList.remove("choix"); c.onclick = null; });
              res(+k);
            };
          });
        });
        const tilt = el("div", "tilt");
        tilt.append(cube);
        de.append(tilt);
        de.classList.add("tap");
        de.onclick = () => btn.click();
        const cubeAt = { x: 0, y: 0 };
        const SHOW = { 1: [0, 0], 6: [0, 180], 3: [0, -90], 4: [0, 90], 2: [-90, 0], 5: [90, 0] };
        const btn = el("button", "big", "🎲 Lancer le dé");
        cube.classList.add("idle");
        const rnd = (m) => {
          const a = new Uint32Array(1);
          const lim = 4294967296 - (4294967296 % m);
          do crypto.getRandomValues(a); while (a[0] >= lim); // évite le biais du modulo
          return a[0] % m;
        };
        const rnd6 = () => rnd(5) + 1;
        const info = el("p", "hint", "Touche le dé pour jouer. Objectif : la case 80 ! 🏁");
        let pos = 0;
        let busy = false;
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
        const NIVEAUX = [[0, "🌱 Apprenti"], [100, "🧳 Voyageur"], [250, "🧭 Explorateur"], [450, "🌍 Globe-trotter"], [700, "🏅 Champion"], [1000, "👑 Légende"]];
        const REC = "carte80-record";
        let score = 0, serie = 0, record = +(localStorage.getItem(REC) || 0);
        const vues = new Set();
        const hud = el("div", "hud");
        const hudPts = el("b", "hud-pts", "0");
        const hudNiv = el("span", "hud-niv", "");
        const hudRec = el("span", "hud-rec", "");
        const hudBar = el("i", "hud-fill");
        const hudTrack = el("div", "hud-track");
        hudTrack.append(hudBar);
        hud.append(el("div", "hud-top", ""), hudTrack, hudRec);
        hud.firstChild.append(el("span", "", "⭐ "), hudPts, el("span", "", " pts"), hudNiv);
        const majHud = () => {
          hudPts.textContent = score;
          let i = NIVEAUX.length - 1;
          while (NIVEAUX[i][0] > score) i--;
          const nxt = NIVEAUX[i + 1];
          hudNiv.textContent = NIVEAUX[i][1];
          hudBar.style.width = (nxt ? Math.round(((score - NIVEAUX[i][0]) / (nxt[0] - NIVEAUX[i][0])) * 100) : 100) + "%";
          hudRec.textContent = (nxt ? "Prochain niveau : " + nxt[1] + " à " + nxt[0] + " pts · " : "Niveau maximum ! · ") + "🏆 Record : " + record;
          return NIVEAUX[i][1];
        };
        const gagner = (pts, why) => {
          const avant = hudNiv.textContent;
          score += pts;
          if (score > record) { record = score; localStorage.setItem(REC, String(record)); }
          const niv = majHud();
          hudPts.classList.remove("bump");
          void hudPts.offsetWidth;
          hudPts.classList.add("bump");
          const t = el("div", "gain", "+" + pts + " " + why);
          (document.querySelector("dialog[open]") || document.body).append(t);
          setTimeout(() => t.remove(), 1800);
          if (avant && avant !== niv) {
            const l = el("div", "gain niveau", "🎉 Nouveau niveau : " + niv);
            (document.querySelector("dialog[open]") || document.body).append(l);
            setTimeout(() => l.remove(), 2600);
            flash();
          }
        };
        const premiere = (n, pts, why) => {
          if (vues.has(n)) return;
          vues.add(n);
          gagner(pts, why);
        };
        let rejouer = false;
        const sudoku = (n) => new Promise((res) => {
          const S = sudokus.get(n);
          const { N, R, C } = S;
          const sym = SYM[N];
          const sd = document.createElement("dialog");
          sd.className = "pop sudoku-pop n" + N;
          const grille = el("div", "sdk");
          grille.style.gridTemplateColumns = "repeat(" + N + ", minmax(0, 1fr))";
          const msg = el("p", "sdk-msg", "🧩 Complète la grille : chaque ligne, chaque colonne et chaque bloc de " + R + "×" + C + " contient une fois chaque symbole" + (N === 15 ? " (1 à 9, puis A B C D E F)." : " (0 à 9)."));
          const btns = [];
          let sel = null;
          const choisirCase = (r, c) => {
            if (S.fait || S.puzzle[r][c] !== ".") return;
            sel = [r, c];
            btns.forEach((b) => b.classList.remove("sel"));
            btns[r * N + c].classList.add("sel");
          };
          for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
              const fixe = S.puzzle[r][c] !== ".";
              const v = S.val[r][c];
              const b = el("button", "sdk-c" + (fixe ? " fixe" : "") + ((r + 1) % R === 0 && r < N - 1 ? " bb" : "") + ((c + 1) % C === 0 && c < N - 1 ? " br" : ""), v === "." ? "" : v);
              b.onclick = () => choisirCase(r, c);
              btns.push(b);
              grille.append(b);
            }
          }
          const mettre = (v) => {
            if (!sel || S.fait) return;
            const [r, c] = sel;
            S.val[r][c] = v;
            btns.forEach((b) => b.classList.remove("err"));
            btns[r * N + c].textContent = v === "." ? "" : v;
          };
          const pad = el("div", "sdk-pad");
          pad.style.gridTemplateColumns = "repeat(" + (N === 15 ? 8 : 6) + ", 1fr)";
          sym.split("").forEach((d) => {
            const b = el("button", "", d);
            b.onclick = () => mettre(d);
            pad.append(b);
          });
          const eff = el("button", "wide", "⌫");
          eff.onclick = () => mettre(".");
          pad.append(eff);
          const verif = el("button", "pop-close", "Vérifier ✔");
          const quitter = el("button", "pop-close alt", "Plus tard ✕");
          // Une case est en conflit si son symbole apparaît déjà dans sa ligne, sa colonne ou son bloc
          const conflits = () => {
            const bad = new Set();
            const groupes = [];
            for (let i = 0; i < N; i++) {
              groupes.push([...Array(N).keys()].map((k) => [i, k]), [...Array(N).keys()].map((k) => [k, i]));
            }
            for (let br = 0; br < N; br += R) for (let bc = 0; bc < N; bc += C) {
              const g = [];
              for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) g.push([br + r, bc + c]);
              groupes.push(g);
            }
            groupes.forEach((g) => {
              const vus = {};
              g.forEach(([r, c]) => { const v = S.val[r][c]; if (v !== ".") (vus[v] = vus[v] || []).push(r * N + c); });
              Object.values(vus).forEach((l) => l.length > 1 && l.forEach((k) => bad.add(k)));
            });
            return bad;
          };
          verif.onclick = () => {
            if (S.fait) return sd.close();
            let vide = 0;
            S.val.forEach((row) => row.forEach((v) => v === "." && vide++));
            const bad = conflits();
            bad.forEach((k) => btns[k].classList.add("err"));
            if (!bad.size && !vide) {
              S.fait = true;
              msg.textContent = "🎉 Sudoku réussi, bravo Papa !";
              verif.textContent = "Continuer ✕";
              quitter.hidden = true;
              flash();
              gagner(N === 15 ? 200 : 100, "Sudoku résolu !");
            } else if (bad.size) {
              msg.textContent = "❌ Il y a des erreurs (en rouge) : un symbole est en double. Corrige-les !";
            } else {
              msg.textContent = "Il reste " + vide + " case" + (vide > 1 ? "s" : "") + " à remplir.";
            }
          };
          quitter.onclick = () => sd.close();
          sd.append(msg, grille, pad, verif, quitter);
          sd.addEventListener("close", () => { sd.remove(); res(); });
          document.body.append(sd);
          sd.showModal ? sd.showModal() : sd.setAttribute("open", "");
        });
        const reveal = async (n) => {
          if (sudokus.has(n)) {
            cells[n].classList.add("ouverte");
            lit(n, "lit");
            flash();
            await sudoku(n);
            return;
          }
          const p = pieges.get(n);
          if (p) {
            premiere(n, 15, "Courage, piège relevé !");
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
            premiere(n, 10, lib.kind === "blague" ? "Un bon rire !" : "Case découverte !");
            await say(lib.kind === "blague" ? "😂 Blague de Papa : " + lib.txt : lib.txt);
            return;
          }
          const q = questions.get(n);
          if (!q) return;
          cells[n].classList.add("ouverte");
          lit(n, "lit");
          flash();
          const ch = q.choix;
          if (ch) {
            const bonne = ch[0];
            const mel = ch.slice().sort(() => Math.random() - 0.5);
            const fini = say("❓ " + q.q);
            montrerActions(false);
            mel.forEach((txt) => {
              const b = el("button", "pop-opt", txt);
              b.onclick = () => {
                opts.querySelectorAll("button").forEach((x) => {
                  x.disabled = true;
                  if (x.textContent === bonne) x.classList.add("ok");
                });
                if (txt !== bonne) b.classList.add("ko");
                const ok = txt === bonne;
                if (ok) heartBoom();
                popTxt.textContent = (ok ? "✅ Bravo ! " : "❌ Raté ! ") + q.r;
                montrerActions(true);
                if (!vues.has(n)) {
                  serie = ok ? serie + 1 : 0;
                  const bonus = ok && serie >= 2 ? 10 * Math.min(serie - 1, 5) : 0;
                  premiere(n, ok ? 50 + bonus : 10, ok ? (bonus ? "Série de " + serie + " !" : "Bonne réponse !") : "Merci d'avoir tenté !");
                }
              };
              opts.append(b);
            });
            await fini;
            return;
          }
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
            grandFinal();
            gagner(200, "Arrivée à 80 ans !");
            const win = el("div", "victoire");
            const wb = el("button", "pop-close", "Rejouer les feux 🎆");
            wb.onclick = () => grandFinal();
            const wc = el("button", "pop-close alt", "Fermer ✕");
            wc.onclick = () => win.remove();
            win.append(el("p", "pop-txt", "🏆 Bravo Papa ! Tu as atteint tes 80 ans avec " + score + " points ! 🎉"), wb, wc);
            document.body.append(win);
            info.textContent = "🏆 Tu as gagné ! Bon anniversaire Papa !";
            return;
          }
          if (cadeaux.has(n)) {
            cells[n].classList.add("ouverte");
            lit(n, "lit");
            flash();
            const premier = !vues.has(n);
            premiere(n, 30, "Un cadeau !");
            const sp = (conf.cadeauxPhoto || {})[n];
            if (sp) {
              const fini = say("🎁 Cadeau ! " + sp.txt);
              popImg.src = sp.photo;
              popImg.hidden = false;
              await fini;
              rejouer = premier;
              return;
            }
            await say("🎁 Cadeau ! Ouvre le cadeau physique qui t'attend !");
            return;
          }
          await reveal(n);
        };
        btn.onclick = async () => {
          if (busy || pos === 80) return;
          busy = true;
          veutLancer = false;
          de.classList.remove("pret");
          btn.disabled = true;
          lancers++;
          const bonus = rnd(8) === 0;
          const r = bonus ? 6 : rnd6();
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
            await say("🃏 Joker de Papa ! Tu peux ouvrir 2 cases de ton choix, sans bouger ton pion (sauf l'arrivée).");
            for (let k = 1; k <= 2; k++) {
              info.textContent = "🃏 Touche la case à ouvrir (" + k + "/2)";
              const n = await choisir();
              await sleep(400);
              await arrive(n);
              rejouer = false;
              cells[n].classList.add("ouverte");
            }
            info.textContent = "📍 Case " + pos + " sur 80 · touche le dé 🎲";
            busy = false;
            btn.disabled = false;
            await finDeTour();
            return;
          }
          let target = pos + r;
          if (target > 80) target = 160 - target;
          const depuis = pos;
          await move(target);
          if (pos > depuis) gagner(2 * (pos - depuis), "En avance !");
          for (let p = Math.max(10, Math.ceil((depuis + 1) / 10) * 10); p <= Math.min(pos, 70); p += 10) {
            premiere("palier" + p, 25, "Palier " + p + " franchi !");
          }
          await arrive(pos);
          if (rejouer) {
            rejouer = false;
            busy = false;
            btn.disabled = false;
            info.textContent = "🎲 Tu rejoues !";
            await sleep(600);
            btn.onclick();
            return;
          }
          info.textContent = pos === 80 ? "🏆 Tu as gagné ! Bon anniversaire Papa !" : "📍 Case " + pos + " sur 80 · touche le dé 🎲";
          busy = false;
          btn.textContent = "🎲 Lancer le dé";
          btn.disabled = pos === 80;
          await finDeTour();
        };
        const finDeTour = async () => {
          if (pos >= 80) return;
          if (veutLancer) {
            veutLancer = false;
            await sleep(500);
            btn.onclick();
          } else {
            de.classList.add("pret");
          }
        };
        const raz = el("button", "big petit", "↺ Recommencer");
        raz.onclick = () => {
          if (busy || !confirm("Recommencer la partie depuis le début ?")) return;
          const dernier = score;
          tirerQuestions();
          tirerLibres();
          pos = 0;
          lancers = 0;
          score = 0;
          serie = 0;
          vues.clear();
          sudokus.forEach((s, k) => sudokus.set(k, nouvelleGrille(s.N)));
          document.querySelectorAll(".victoire").forEach((v) => v.remove());
          majHud();
          Object.keys(cells).forEach((k) => {
            cells[k].classList.remove("ouverte", "lit", "piege-hit");
            if (+k !== 80) {
              cells[k].classList.add("cache");
              cells[k].querySelector(".ico").textContent = "❔";
            }
          });
          placePion();
          info.textContent = "Nouvelle partie, nouvelles surprises ! 🏆 Record : " + record + " pts" + (dernier ? " (partie précédente : " + dernier + " pts)" : "") + ". Touche le dé !";
          btn.disabled = false;
          btn.textContent = "🎲 Lancer le dé";
          cube.classList.add("idle");
        };
        const row = el("div", "oie-bar");
        row.append(depart, raz);
        // Un seul écran : score en haut, plateau au milieu, dé et boutons en bas
        const haut = el("div", "ecran-haut");
        haut.append(hud, info);
        const bas = el("div", "ecran-bas");
        const cmd = el("div", "cmd");
        cmd.append(row);
        bas.append(de, cmd);
        board.append(plateau);
        s.append(haut, board, bas);
        placePion();
        majHud();
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
