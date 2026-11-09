/* Segredo da Insulina - quiz em 28 telas (vanilla JS) */

// ===== CONFIGURE AQUI =====
const CONFIG = {
  checkout: "#",                 // [NEED] cole aqui o link do seu checkout
  price: "R$ 24,90",
  installments: "ou 3x de R$ 8,30",
  womenCount: "+12.847",         // [NEED] confirme que o número é real antes de publicar
  total: 28
};

const IMG = "assets/";
const A = {
  logo: IMG + "logo.png",
  doc: IMG + "doutora.png",
  iconAntes: IMG + "icon-antes-TUawfA0v.png",
  bodyMedio: IMG + "body-medio-DStQ-FtD.webp",
  bodyAcima: IMG + "body-acima-B6GAhLJh.webp",
  bodySobre: IMG + "body-sobrepeso-Xf73tryt.webp",
  bodyPlus: IMG + "body-plussize-C2UrcrEA.webp",
  areas: IMG + "body-areas-CF2TMRSN.webp",
  commit: IMG + "commitment-before-after-DYP9iNat.png",
  depo: IMG + "depoimento-antes-depois-CsLdWDkt.jpg"
};

const state = {
  age: "", bodyType: "", bodyAreas: [], name: "", weightImpact: "", appearance: "",
  barriers: [], goals: [], weight: 75, height: 165, desiredWeight: 65, routine: [],
  sleep: "", commitment: "", bloating: "", firstResult: ""
};

let page = Math.max(1, parseInt(new URLSearchParams(location.search).get("page"), 10) || 1);
let timers = [];

const $screen = document.getElementById("screen");
const $top = document.getElementById("top");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nm = () => esc(state.name || "Você");
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- helpers de UI ---------- */
const opt = (key, o, cls = "") => `<button class="quiz-option ${cls} ${isSel(key, o.value) ? "selected" : ""}" data-pick="${key}" data-value="${o.value}">
  ${o.emoji ? `<span class="emoji">${o.emoji}</span>` : ""}<span class="opt-label ${o.small ? "s" : ""}">${o.label}</span></button>`;
const isSel = (k, v) => Array.isArray(state[k]) ? state[k].includes(v) : state[k] === v;
const stepper = (key, min, max, unit) => `
  <div class="value">${state[key]}<small>${unit}</small></div>
  <div class="steppers">${[["-5", -5], ["−", -1], ["+", 1], ["+5", 5]].map(([l, d]) => `<button data-step="${key}" data-d="${d}" data-min="${min}" data-max="${max}">${l}</button>`).join("")}</div>`;

/* ---------- telas ---------- */
const P = {};

P[1] = () => `
<div class="cover">
  <div class="cover-logo"><img class="logo-img" src="${A.logo}" alt="Segredo da Insulina"></div>
  <div class="cover-body">
    <h1>Barriga teimosa depois dos 40? Conheça a mistura de liquidificador que custa <span class="grad accent">R$10</span></h1>
    <p class="lead">Responda a 2 minutos de perguntas e receba uma rotina de 21 dias feita para o seu corpo.</p>
    <div class="cover-photo">
      <div class="glow"></div>
      <img class="doc" src="${A.doc}" alt="Médica segurando a mistura do Segredo da Insulina">
      <div class="badge-doc"><span>🩺</span><div><div class="t1">Médica</div><div class="t2">ESPECIALISTA</div></div></div>
      <div class="badge-price">custa R$10</div>
    </div>
    <div class="proof"><strong>${CONFIG.womenCount} mulheres</strong> já montaram a rotina delas aqui</div>
    <button class="btn-cta btn-sm" data-next>MONTAR MINHA ROTINA GRÁTIS</button>
    <div class="checks"><span><span class="ok">✓</span> Grátis</span><span class="dot">·</span><span><span class="ok">✓</span> Leva 2 minutos</span><span class="dot">·</span><span><span class="ok">✓</span> Ingredientes de mercado</span></div>
  </div>
</div>`;

const AGES = [{ value: "18-27", emoji: "🌸", label: "18 – 27 anos" }, { value: "28-39", emoji: "💐", label: "28 – 39 anos" }, { value: "40-54", emoji: "🌺", label: "40 – 54 anos" }, { value: "54+", emoji: "🌷", label: "54+ anos" }];
P[2] = () => `<div class="pad fade-in"><h2 class="h2">Para começar: qual é a sua idade?</h2><p class="sub">Seu metabolismo muda a cada fase. A rotina muda junto.</p>
<div class="col gap-3" style="margin-top:.5rem">${AGES.map(o => opt("age", o)).join("")}</div></div>`;

const BODIES = [{ value: "medio", label: "Médio", img: A.bodyMedio }, { value: "acima-do-peso", label: "Acima do peso", img: A.bodyAcima }, { value: "sobrepeso", label: "Sobrepeso", img: A.bodySobre }, { value: "plus-size", label: "Plus Size", img: A.bodyPlus }];
P[3] = () => `<div class="pad fade-in"><h2 class="h2 h2x">Qual silhueta se parece mais com a sua <span class="grad">hoje</span>?</h2>
<div class="grid2">${BODIES.map(o => `<button class="quiz-option body-opt ${isSel("bodyType", o.value) ? "selected" : ""}" data-pick="bodyType" data-value="${o.value}"><img src="${o.img}" alt="${o.label}" loading="lazy"><span class="opt-label s">${o.label}</span></button>`).join("")}</div></div>`;

const AREAS = [["papada", "😊", "Papada", "na"], ["bracos", "💪", "Braços", "nos"], ["barriga", "🤰", "Barriga", "na"], ["cintura", "💝", "Cintura", "na"], ["gluteos", "🍑", "Glúteos", "nos"], ["coxas", "🦵", "Coxas", "nas"], ["corpo-todo", "✨", "Corpo todo", "no"]];
P[4] = () => `<div class="pad-sm fade-in"><h2 class="h2-xl">Onde a gordura mais <span class="grad">teima em ficar</span>?</h2><p class="sub">Marque quantas áreas quiser.</p>
<div class="areas"><div class="pic"><img src="${A.areas}" alt="Áreas do corpo" loading="lazy"></div>
<div class="list">${AREAS.map(a => `<button class="quiz-option ${state.bodyAreas.includes(a[0]) ? "selected" : ""}" data-multi="bodyAreas" data-value="${a[0]}"><span>${a[1]}</span><span class="l">${a[2]}</span></button>`).join("")}</div></div>
<button class="btn-quiz" data-next ${state.bodyAreas.length ? "" : "disabled"}>Continuar</button></div>`;

const STAT = { "18-27": ["18 a 27", "Por volta dos 20"], "28-39": ["28 a 39", "Entre 28 e 39"], "40-54": ["40 a 54", "Depois dos 40"], "54+": ["54+", "Depois dos 54"] };
P[5] = () => {
  const areas = state.bodyAreas.filter(a => a !== "corpo-todo");
  const labels = (areas.length ? areas : ["barriga"]).map(k => { const a = AREAS.find(x => x[0] === k); return `${a[3]} ${a[2].toLowerCase()}`; });
  const txt = labels.length > 1 ? labels.slice(0, -1).join(", ") + " e " + labels.slice(-1) : labels[0];
  return `<div class="alone fade-in"><div class="round">🤝</div>
  <h2 class="h2" style="margin-bottom:1rem">Se o ponteiro da balança não obedece, a falha não é sua.</h2>
  <div class="card-stat"><div class="b" style="font-size:1.125rem">Com a idade, os hormônios que controlam a fome e o armazenamento de gordura respondem de outro jeito.</div>
  <p class="a" style="margin-top:1rem;margin-bottom:0">Por isso o acúmulo ${txt} costuma persistir mesmo com dieta.</p></div>
  <button class="btn-quiz" data-next>Faz sentido, continuar</button></div>`;
};

P[6] = () => `<div class="pad fade-in"><h2 class="h2">Por que as dietas de antes pararam de funcionar</h2>
<div class="col gap-3">
 <div class="tick-row"><span class="c">1</span><span class="t">Você come menos e o corpo reage gastando menos energia.</span></div>
 <div class="tick-row"><span class="c">2</span><span class="t">A fome volta forte à noite e a força de vontade perde a briga.</span></div>
 <div class="tick-row"><span class="c">3</span><span class="t">O inchaço esconde o progresso e a motivação cai.</span></div></div>
<p class="sub" style="margin-top:.5rem">Uma rotina simples, com alimentos de mercado, ataca esses três pontos juntos.</p>
<button class="btn-quiz" data-next>Quero entender como</button></div>`;

P[7] = () => `<div class="pad fade-in" style="align-items:center;gap:1.5rem"><h2 class="h2 h2x">Como posso te chamar?</h2>
<input id="nameInput" class="name-input" type="text" value="${esc(state.name)}" placeholder="Seu primeiro nome" autocomplete="given-name">
<button class="btn-quiz" data-name ${state.name.trim() ? "" : "disabled"}>Continuar</button></div>`;

const IMPACT = [{ value: "autoestima", emoji: "💔", t: "Minha autoestima", d: "Me olho no espelho e não me reconheço" }, { value: "saude", emoji: "🩺", t: "Minha saúde", d: "Sinto que ela está pedindo atenção" }, { value: "relacionamentos", emoji: "👥", t: "Meus relacionamentos", d: "Evito sair, tirar foto ou encontrar pessoas" }, { value: "rotina", emoji: "📅", t: "Minha rotina", d: "Falta energia para cuidar da família e de mim" }];
P[8] = () => `<div class="pad fade-in"><h2 class="h2"><span class="grad">${nm()}</span>, o que o peso mais atrapalha hoje?</h2>
<div class="col gap-3" style="margin-top:.5rem">${IMPACT.map(o => `<button class="quiz-option start ${isSel("weightImpact", o.value) ? "selected" : ""}" data-pick="weightImpact" data-value="${o.value}"><span class="emoji" style="margin-top:.25rem">${o.emoji}</span><div><div class="opt-title">${o.t}</div><div class="opt-desc">${o.d}</div></div></button>`).join("")}</div></div>`;

const TRIED = [{ value: "varias-vezes", emoji: "😞", label: "Já, várias vezes. Perco e logo ganho de volta", small: 1 }, { value: "nao-mantem", emoji: "😶", label: "Já, mas nunca consigo manter", small: 1 }, { value: "primeira-vez", emoji: "✨", label: "Estou tentando pela primeira vez de verdade", small: 1 }, { value: "tudo", emoji: "😩", label: "Já tentei de tudo e nada funcionou", small: 1 }];
P[9] = () => `<div class="pad fade-in"><h2 class="h2">Você já tentou <span class="grad">emagrecer antes</span>?</h2>
<div class="col gap-3" style="margin-top:1rem">${TRIED.map(o => opt("appearance", o)).join("")}</div></div>`;

P[10] = () => `<div class="pad-sm center items-center fade-in" style="gap:1.5rem"><div style="font-size:3rem">🧬</div>
<h2 class="h2-xl"><span class="grad">${nm()}</span>, seu corpo aprendeu a se proteger.</h2>
<p class="muted" style="font-size:1rem">Depois de várias dietas, ele passa a segurar gordura e a pedir comida. Isso é biologia, e não falta de disciplina.</p>
<p style="font-size:1rem;font-weight:600">O Segredo da Insulina trabalha o sinal de saciedade e o inchaço, para você parar de lutar contra a fome.</p>
<button class="btn-quiz" data-next>Entendi, continuar</button></div>`;

const BARR = [{ value: "dinheiro", emoji: "💸", label: "Já gastei dinheiro e não tive resultado", small: 1 }, { value: "financeiro", emoji: "💰", label: "Tratamentos caros não cabem no meu bolso", small: 1 }, { value: "constancia", emoji: "📉", label: "Começo e não consigo manter", small: 1 }, { value: "fome", emoji: "🍫", label: "Sinto fome e acabo cedendo", small: 1 }, { value: "tempo", emoji: "⏰", label: "Não tenho tempo para dietas", small: 1 }];
P[11] = () => `<div class="pad fade-in"><h2 class="h2">O que mais te trava hoje?</h2><p class="sub">Marque tudo que se aplica.</p>
<div class="col gap-3">${BARR.map(o => `<button class="quiz-option ${state.barriers.includes(o.value) ? "selected" : ""}" data-multi="barriers" data-value="${o.value}"><span class="emoji">${o.emoji}</span><span class="opt-label s">${o.label}</span></button>`).join("")}</div>
<button class="btn-quiz" data-next ${state.barriers.length ? "" : "disabled"}>Continuar</button></div>`;

P[12] = () => `<div class="pad-sm center items-center fade-in" style="gap:1.5rem"><div style="font-size:3rem">🥤</div>
<h2 class="h2-xl">Canetas como o Mounjaro passam de R$1.000 por mês e exigem receita.</h2>
<div class="box-hl"><p>O <span class="grad accent">Segredo da Insulina</span> é um caminho natural e acessível: a base sai por cerca de <span class="grad accent">R$10</span> e fica pronta no liquidificador.</p>
<p class="s">Sem ingrediente importado e sem horário rígido. Se você usa algum medicamento, siga o acompanhamento do seu médico e combine a rotina com ele.</p></div>
<button class="btn-quiz" data-next>Continuar</button></div>`;

const GOALS = [["saude", "❤️", "Melhorar minha saúde"], ["peso", "⚖️", "Perder peso de verdade"], ["desinchar", "💧", "Desinchar logo na primeira semana"], ["energia", "⚡", "Ter mais energia no dia a dia"], ["autoestima", "🌸", "Me sentir bem comigo mesma"]];
P[13] = () => `<div class="pad fade-in"><h2 class="h2">O que você quer <span class="grad">conquistar</span>?</h2><p class="sub">Marque tudo que se aplica.</p>
<div class="col gap-3">${GOALS.map(g => `<button class="quiz-option ${state.goals.includes(g[0]) ? "selected" : ""}" data-multi="goals" data-value="${g[0]}"><span class="emoji">${g[1]}</span><span class="opt-label s">${g[2]}</span></button>`).join("")}</div>
<button class="btn-quiz" data-next ${state.goals.length ? "" : "disabled"}>Continuar</button></div>`;

const BLOAT = [{ value: "sempre", emoji: "😣", label: "Sim, quase todo dia me sinto inchada", small: 1 }, { value: "as-vezes", emoji: "😐", label: "Às vezes, principalmente à noite", small: 1 }, { value: "raramente", emoji: "😊", label: "Raramente", small: 1 }];
P[14] = () => `<div class="pad fade-in"><h2 class="h2">Você sente inchaço, barriga dura ou digestão lenta com frequência?</h2>
<div class="col gap-3" style="margin-top:1rem">${BLOAT.map(o => opt("bloating", o)).join("")}</div></div>`;

P[15] = () => `<div class="pad-sm fade-in"><h2 class="h2"><span class="grad">${nm()}</span>, veja como o Segredo da Insulina funciona 🎉</h2>
<div class="col gap-3">${["Ingredientes naturais, de mercado", "1 a 2 vezes por dia", "Receita 100% caseira"].map(t => `<div class="tick-row"><span class="c">✓</span><span class="t">${t}</span></div>`).join("")}</div>
<div class="steps">
 <div class="step"><div class="n">1</div><img class="i1" src="${A.iconAntes}" alt=""><div class="ti">Antes</div><div class="de">Fome constante e barriga inchada</div></div>
 <div class="step"><div class="n">2</div><img class="i2 logo-img" src="${A.logo}" alt=""><div class="ti">Segredo da Insulina</div><div class="de">Mistura natural que ajuda a saciedade</div></div>
 <div class="step"><div class="n">3</div><div class="ic">🔥</div><div class="ti">Rotina em ação</div><div class="de">Menos beliscos, menos inchaço</div></div>
 <div class="step"><div class="n">4</div><div class="ic">✨</div><div class="ti">Corpo responde</div><div class="de">Você sente a diferença na roupa</div></div></div>
<button class="btn-quiz" data-next>Entendi! Continuar 🚀</button></div>`;

P[16] = () => `<div class="pad fade-in" style="align-items:center;gap:1.5rem"><h2 class="h2 h2x">Qual é seu <span class="grad">peso atual</span>?</h2>${stepper("weight", 45, 150, "kg")}<button class="btn-quiz" data-next>Continuar</button></div>`;
P[17] = () => `<div class="pad fade-in" style="align-items:center;gap:1.5rem"><h2 class="h2 h2x">Qual é sua <span class="grad">altura</span>?</h2>${stepper("height", 140, 200, "cm")}<button class="btn-quiz" data-next>Continuar</button></div>`;
P[18] = () => { const d = state.weight - state.desiredWeight; return `<div class="pad fade-in" style="align-items:center;gap:1.5rem"><h2 class="h2 h2x">Qual é seu <span class="grad">peso desejado</span>?</h2>${stepper("desiredWeight", 40, state.weight - 1, "kg")}
${d > 0 ? `<div class="goal-pill">Meta: perder ${d} kg 🎯</div>` : ""}<button class="btn-quiz" data-next>Continuar</button></div>`; };

const ROUT = [{ value: "fora", emoji: "🏢", label: "Trabalho fora de casa" }, { value: "home", emoji: "🏠", label: "Trabalho em casa / home office" }, { value: "casa", emoji: "👨‍👩‍👧", label: "Cuido da casa e da família" }, { value: "corrida", emoji: "🏃‍♀️", label: "Minha rotina é corrida e irregular" }];
P[19] = () => `<div class="pad fade-in"><h2 class="h2">Como é a sua <span class="grad">rotina diária</span>?</h2><p class="sub">Vamos encaixar a receita no seu horário.</p>
<div class="col gap-3" style="margin-top:.5rem">${ROUT.map(o => opt("routine", o)).join("")}</div></div>`;

const SLEEP = [{ value: "menos-5", emoji: "😴", label: "Menos de 5h" }, { value: "5-7", emoji: "🌙", label: "5 a 7 horas" }, { value: "7-9", emoji: "😊", label: "7 a 9 horas" }, { value: "mais-9", emoji: "💤", label: "Mais de 9h" }];
P[20] = () => `<div class="pad fade-in"><h2 class="h2 h2x">Quantas horas você <span class="grad">dorme por noite</span>?</h2><p class="sub">Sono curto aumenta a fome do dia seguinte.</p>
<div class="col gap-3" style="margin-top:.5rem">${SLEEP.map(o => opt("sleep", o)).join("")}</div></div>`;

P[21] = () => {
  const loss = state.weight - state.desiredWeight;
  const a = 10, l = 85;
  const pts = [[5, a], [25, a + 8], [45, a + 30], [65, a + 52], [85, l - 6], [95, l]];
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return `<div class="pad-sm center items-center fade-in"><h2 class="h2-xl"><span class="grad">${nm()}</span>, a sua meta de ${loss} kg é possível com constância.</h2>
<div class="box-hl"><div class="goal-box"><div class="col items-center"><span class="v">${state.weight}kg</span><span class="l">hoje</span></div><span class="arrow">→</span><div class="col items-center"><span class="v p">${state.desiredWeight}kg</span><span class="l">sua meta</span></div></div>
<div class="goal-meta"><span>Falta pouco: ${loss} kg até chegar lá</span></div></div>
<div class="chart-card"><p class="cap">Projeção ilustrativa</p>
<div class="chart" id="chart"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="hsl(152 60% 34%)" stop-opacity=".3"/><stop offset="100%" stop-color="hsl(152 60% 34%)" stop-opacity=".02"/></linearGradient></defs>
<path class="area" d="${line} L95,100 L5,100 Z" fill="url(#cg)"/><path class="line" d="${line}" fill="none" stroke="hsl(152 60% 34%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
<div class="lb l1" style="top:${a}%"><div style="display:flex;align-items:center;gap:.5rem"><span class="dotc" style="background:hsl(var(--foreground))"></span><span class="t">${state.weight}kg</span></div><span class="small" style="margin-left:1.25rem">hoje</span></div>
<div class="lb l3" style="top:${l - 6}%"><span class="dotc pulse" style="background:hsl(var(--btn));width:.875rem;height:.875rem"></span><span class="t" style="color:hsl(var(--btn))">${state.desiredWeight}kg</span><span class="small">meta</span></div></div>
<p class="chart-note">Estimativa para ilustrar o caminho até a sua meta. Resultados variam de pessoa para pessoa.</p></div>
<button class="btn-quiz" data-next>VAMOS LÁ</button></div>`;
};

const COMMIT = [{ value: "sim", emoji: "😍", label: "Sim, eu me comprometo" }, { value: "hoje", emoji: "🤩", label: "Quero começar hoje mesmo" }, { value: "duvidas", emoji: "🤔", label: "Ainda tenho algumas dúvidas" }];
P[22] = () => `<div class="pad-sm items-center fade-in">
<div class="commit-img"><img src="${A.commit}" alt="Transformação antes e depois"><div class="ov"><div class="bounce-h"><div class="c"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div></div></div></div>
<div class="pill-note"><span>🎁</span><span>PARA LIBERAR SEU PLANO, PRECISO SABER:</span></div>
<h2 class="h2-xl">Você segue a rotina por 7 dias para ver como o seu corpo responde?</h2>
<div class="col gap-3" style="width:100%">${COMMIT.map(o => opt("commitment", o)).join("")}</div></div>`;

P[23] = () => `<div class="pad fade-in"><h2 class="h2">Qual resultado você quer sentir <span class="grad">primeiro</span>?</h2>
<div class="col gap-3" style="margin-top:1rem">${GOALS.map(g => opt("firstResult", { value: g[0], emoji: g[1], label: g[2], small: 1 })).join("")}</div></div>`;

const ANALYSIS = [["Calculando sua faixa de peso", "⚖️", 1800], ["Considerando sua idade", "🎂", 1500], ["Cruzando suas respostas", "🔍", 1600], ["Escolhendo as receitas ideais", "✨", 1400]];
P[24] = () => `<div class="analysis fade-in"><div class="head"><div class="brain pulse" style="font-size:2.25rem">🧠</div><h2>Preparando sua análise, <span style="color:hsl(var(--primary))">${nm()}</span>...</h2><p>Estamos organizando suas respostas</p></div>
<div class="list">${ANALYSIS.map((a, i) => `<div class="a-item" id="ai${i}"><div class="ic">${a[1]}</div><div class="tx"><p>${a[0]}</p><div class="bar hidden"><i></i></div></div></div>`).join("")}</div>
<div class="total"><div class="bar"><i id="totalbar"></i></div><p id="totaltxt">0% concluído</p></div></div>`;
function runAnalysis() {
  let n = 0, p = 0;
  const upd = () => {
    const pct = Math.min((n + p / 100) / ANALYSIS.length * 100, 100);
    const b = document.getElementById("totalbar"), t = document.getElementById("totaltxt");
    if (b) b.style.width = pct + "%"; if (t) t.textContent = Math.round(pct) + "% concluído";
  };
  const mark = () => ANALYSIS.forEach((a, i) => {
    const el = document.getElementById("ai" + i); if (!el) return;
    el.className = "a-item " + (i < n ? "done" : i === n ? "cur" : "");
    el.querySelector(".ic").textContent = i < n ? "✅" : a[1];
    el.querySelector(".bar").classList.toggle("hidden", i !== n);
  });
  const stepIt = () => {
    if (n >= ANALYSIS.length) { upd(); timers.push(setTimeout(() => go(page + 1), 600)); return; }
    mark(); p = 0; const dur = ANALYSIS[n][2];
    const iv = setInterval(() => {
      p += 30 / dur * 100; const el = document.querySelector("#ai" + n + " .bar i"); if (el) el.style.width = Math.min(p, 100) + "%"; upd();
      if (p >= 100) { clearInterval(iv); n++; timers.push(setTimeout(stepIt, 300)); }
    }, 30);
    timers.push(iv);
  };
  stepIt();
}

const FOCUS = { saude: "Cuidar da saúde", peso: "Perder peso", desinchar: "Desinchar", energia: "Ganhar energia", autoestima: "Recuperar a autoestima" };
P[25] = () => {
  const h = state.height / 100, imc = state.weight / (h * h);
  const cls = imc >= 30 ? "Obesidade" : imc >= 25 ? "Sobrepeso" : imc >= 18.5 ? "Faixa normal" : "Abaixo do peso";
  const pts = [
    "Seu primeiro objetivo: " + (FOCUS[state.firstResult] || "Perder peso").toLowerCase(),
    state.bloating === "sempre" ? "Inchaço frequente, que atrapalha a leitura da balança" : "Meta de " + Math.max(0, state.weight - state.desiredWeight) + " kg para chegar ao seu peso desejado",
    state.sleep === "menos-5" || state.sleep === "5-7" ? "Sono curto, que aumenta a fome do dia seguinte" : "Sono em boa faixa, um ponto a seu favor",
    state.barriers.includes("fome") ? "Fome que vence a disciplina, o ponto principal da sua rotina" : "Constância: a rotina será simples para caber no seu dia"
  ];
  const ben = ["Mistura de R$10 feita no liquidificador", "Rotina para desinchar nos primeiros dias", "Estratégias para controlar a fome sem sofrimento", "Receitas para manter o resultado sem efeito sanfona", "Sobremesas que cabem no plano"];
  return `<div class="pad-sm fade-in"><h2 class="h2-xl"><span class="grad">${nm()}</span>, sua análise está pronta.</h2>
<div class="imc"><div class="top"></div><div class="in"><div class="center"><div class="n">${imc.toFixed(1)}</div><div class="cl">Seu IMC: <b>${cls}</b></div></div><hr>
<div class="col gap-2" style="width:100%"><div class="alert-t">O que suas respostas mostram:</div>${pts.map(t => `<div class="alert-i"><span>📌</span> ${t}</div>`).join("")}</div></div></div>
<div class="insight">🌿 Sua rotina de 21 dias foi montada em torno desses pontos, uma etapa de cada vez.</div>
<div><h3 class="ben-t">O que está no seu plano 👇</h3>${ben.map(b => `<div class="ben"><span style="color:hsl(var(--btn))">✅</span> ${b}</div>`).join("")}</div>
<div class="testi"><img src="${A.depo}" alt="Depoimento antes e depois" loading="lazy"><div class="in"><p class="q">"Perdi 11kg em 5 semanas!"</p><p class="m">Rose, 52 anos - São Paulo</p><div>⭐⭐⭐⭐⭐</div><p class="m">Resultado individual. Pode variar.</p></div></div>
<button class="btn-quiz" data-next>Continuar</button></div>`;
};

const TESTI = [
  { q: "Perdi 9kg em 21 dias. Tive que jogar algumas calças e shorts fora.", n: "Maria", a: 47, r: "-9kg", i: "antes-depois-maria-Bjz-z-hL.jpg" },
  { q: "Minha pressão normalizou e o médico reduziu meu remédio.", n: "Rosana", a: 52, r: "-7kg", i: "antes-depois-rosana-BQrEG7CG.jpg" },
  { q: "Me olhei no espelho e me reconheci de novo.", n: "Fernanda", a: 43, r: "-11kg", i: "antes-depois-fernanda-DB-hMpea.jpg" },
  { q: "Voltei a ter energia pra cuidar dos meus filhos.", n: "Claudia", a: 36, r: "-8kg", i: "antes-depois-4-CXXOM7GR.jpg" }
];
P[26] = () => `<div class="pad-sm items-center fade-in"><h2 class="h2-xl">Mulheres como você que já seguiram a rotina</h2>
<div class="col gap-4" style="width:100%">${TESTI.map(t => `<div class="t-card"><img src="${IMG + t.i}" alt="Antes e depois - ${t.n}" loading="lazy"><div class="in"><div class="res">${t.r}</div><p class="q">"${t.q}"</p><p class="m">${t.n}, ${t.a} anos</p><div>⭐⭐⭐⭐⭐</div></div></div>`).join("")}</div>
<p class="sub" style="margin:0">Relatos individuais. Os resultados variam de pessoa para pessoa.</p>
<button class="btn-cta" data-next>Quero montar a minha rotina</button></div>`;

const READY = ["Montando sua rotina de 21 dias", "Personalizando seu Segredo da Insulina", "Calculando ingredientes e receitas", "Reunindo seus bônus", "Rotina pronta"];
P[27] = () => `<div class="ready fade-in"><div class="hero"><div class="e">✨</div><h2>Sua rotina de <strong>21 dias</strong> do <strong>Segredo da Insulina</strong> está pronta</h2></div>
<div class="bounce-v">⬇️</div><div class="steps-l">${READY.map((t, i) => `<div id="rs${i}">◻️ ${t}</div>`).join("")}</div>
<div class="progress-bar-track" style="width:100%"><div class="progress-bar-fill" id="rbar" style="width:0"></div></div></div>`;
function runReady() {
  let t = 0, r = 0;
  const paint = () => READY.forEach((x, i) => { const el = document.getElementById("rs" + i); if (el) { el.className = i <= t ? "on" : ""; el.textContent = (i < t ? "✅" : i === t ? "⏳" : "◻️") + " " + x; } });
  paint();
  timers.push(setInterval(() => { t = Math.min(t + 1, READY.length - 1); paint(); }, 1200));
  timers.push(setInterval(() => { r = Math.min(r + 1.5, 100); const b = document.getElementById("rbar"); if (b) b.style.width = r + "%"; }, 100));
  timers.push(setTimeout(() => go(page + 1), 8500));
}

const FAQ = [
  ["O Segredo da Insulina funciona para todo mundo?", "Cada corpo responde de um jeito. A rotina combina alimentos que ajudam na saciedade e no inchaço com hábitos simples, e funciona melhor quando você segue os 21 dias. Ela não substitui acompanhamento médico."],
  ["Quando começo a sentir diferença?", "Muitas mulheres relatam menos inchaço nos primeiros dias. A perda de peso depende da sua constância, da alimentação e do seu organismo."],
  ["É seguro? Tem efeitos colaterais?", "Os ingredientes são alimentos comuns de mercado. Se você tem alguma condição de saúde, toma medicação contínua, está grávida ou amamentando, converse com seu médico antes de começar."],
  ["Como recebo o protocolo?", "Logo depois do pagamento você recebe o acesso ao aplicativo com as receitas, a rotina de 21 dias e os bônus. O acesso é vitalício."],
  ["E se eu não gostar?", "Você tem 30 dias de garantia. Se não gostar por qualquer motivo, devolvemos 100% do valor, sem perguntas."],
  ["O pagamento é seguro?", "Sim. O pagamento acontece em uma plataforma criptografada, e seus dados ficam protegidos."],
  ["Preciso comprar ingredientes caros?", "Não. Tudo se encontra em qualquer supermercado, e a base custa em torno de R$10."]
];
P[28] = () => {
  const loss = Math.max(1, state.weight - state.desiredWeight);
  const date = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  const days = [["✨", "Primeiros 7 dias", "Menos inchaço e roupa mais confortável"], ["🔥", "Até o 14º dia", "Fome mais controlada e rotina no automático"], ["🏆", "Dia 21", `Você mais perto da meta de ${loss} kg`, 1]];
  const bonus = [["Bônus 1: Dicas para potencializar o resultado", "Ajustes simples de horário e combinação de alimentos"], ["Bônus 2: 40 sobremesas para o seu plano", "Doce sem culpa, dentro da rotina"], ["Bônus 3: 20 shakes e vitaminas", "Variações deliciosas para não enjoar"]];
  const inc = [["Receitas completas do Segredo da Insulina"], ["Rotina de 21 dias, passo a passo"], ["Aplicativo exclusivo, com acesso vitalício"], ["Lista de compras com todos os ingredientes"], ["BÔNUS: Dicas para potencializar o resultado", 1], ["BÔNUS: 20 shakes e vitaminas", 1], ["BÔNUS: 40 sobremesas para o seu plano", 1]];
  return `<div class="sticky">🔥 Seu plano está pronto, <span>${nm()}</span>. Garanta o acesso agora.</div>
<div class="offer">
 <div class="center"><h1><span class="grad">${nm()}</span>, sua rotina de 21 dias foi gerada</h1><p class="sub" style="margin-top:.75rem">Ela foi montada com as suas respostas. Garanta o acesso antes de sair desta página.</p></div>
 <div class="plan"><div class="hd"><div class="s">Seu plano exclusivo</div><div class="b">21 dias, uma etapa de cada vez</div></div><div class="bd">
  ${days.map(d => `<div class="day"><span class="e">${d[0]}</span><div class="x"><div class="a">${d[1]}</div><div class="b">${d[2]}</div></div>${d[3] ? '<span class="meta">META</span>' : ""}</div>`).join("")}
  <div class="exp">🎯 Meta de ${loss} kg, no seu ritmo</div></div></div>
 <div class="center"><h2 class="h2-xl" style="font-size:1rem">Você também recebe <span style="color:hsl(var(--primary))">3 bônus</span> para facilitar a rotina</h2></div>
 <div class="col gap-3">${bonus.map(b => `<div class="bonus"><span class="e">🎁</span><div><div class="a">${b[0]}</div><div class="b">${b[1]}</div></div></div>`).join("")}</div>
 <div class="plan"><div class="hd"><div class="s">Veja</div><div class="b m">Tudo o que você recebe</div><div class="d">Acesso liberado até ${date}</div></div><div class="bd">
  ${inc.map(i => `<div class="inc"><span class="c">${i[1] ? "🎁" : "✅"}</span><span>${i[0]}</span></div>`).join("")}
  <div class="price"><div class="por">PAGAMENTO ÚNICO</div><div class="v">${CONFIG.price}</div><div class="p">${CONFIG.installments}</div></div></div></div>
 <a class="btn-cta" href="${CONFIG.checkout}" data-checkout>QUERO COMEÇAR MINHA ROTINA</a>
 <div class="guar"><div class="seal">GARANTIA<br>30<br>DIAS</div><div class="t">Teste por 30 dias, sem risco</div>
  <p>A lei já garante 7 dias. Nós damos 30. Se a rotina não for para você, devolvemos cada centavo.</p><p>Basta pedir. Sem perguntas e sem burocracia.</p></div>
 <div class="faq"><h3>Perguntas frequentes</h3>${FAQ.map(f => `<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join("")}</div>
 <a class="btn-cta" href="${CONFIG.checkout}" data-checkout>COMEÇAR AGORA</a>
 <div class="secure">🔒 Pagamento 100% seguro · Seus dados estão protegidos<br><br>Este conteúdo é educativo e não substitui orientação médica ou nutricional. Os resultados variam de pessoa para pessoa.</div>
</div>`;
};

/* ---------- motor ---------- */
function topbar() {
  if (page <= 1 || page >= CONFIG.total + 1) { $top.classList.add("hidden"); return; }
  $top.classList.remove("hidden");
  const pct = (page - 1) / CONFIG.total * 100;
  $top.innerHTML = `<div class="topbar-row"><button class="back" data-back aria-label="Voltar"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><img class="logo-top logo-img" src="${A.logo}" alt="Segredo da Insulina"></div><div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>`;
}
function render(resetScroll) {
  timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = [];
  const fn = P[page] || P[1];
  const y = $screen.scrollTop;
  topbar();
  $screen.innerHTML = fn();
  $screen.scrollTop = resetScroll ? 0 : y;
  if (page === 21) timers.push(setTimeout(() => document.getElementById("chart")?.classList.add("go"), 300));
  if (page === 24) runAnalysis();
  if (page === 27) runReady();
  if (page === 7) { const i = document.getElementById("nameInput"); if (i && window.innerWidth > 700) i.focus(); }
}
function go(n) { page = clamp(n, 1, CONFIG.total); history.replaceState(null, "", page > 1 ? "?page=" + page : location.pathname); render(true); }
function pick(key, v) { state[key] = key === "routine" ? [v] : v; render(false); setTimeout(() => go(page + 1), 300); }

document.addEventListener("click", e => {
  const t = e.target.closest("button,a"); if (!t) return;
  if (t.dataset.next !== undefined && !t.disabled) return go(page + 1);
  if (t.dataset.back !== undefined) return go(page - 1);
  if (t.dataset.pick) return pick(t.dataset.pick, t.dataset.value);
  if (t.dataset.multi) { const k = t.dataset.multi, a = state[k], v = t.dataset.value; state[k] = a.includes(v) ? a.filter(x => x !== v) : [...a, v]; return render(false); }
  if (t.dataset.step) {
    const k = t.dataset.step, d = +t.dataset.d; let min = +t.dataset.min, max = +t.dataset.max;
    state[k] = clamp(state[k] + d, min, k === "desiredWeight" ? state.weight - 1 : max);
    if (k === "weight" && state.desiredWeight >= state.weight) state.desiredWeight = state.weight - 1;
    return render(false);
  }
  if (t.dataset.name !== undefined && state.name.trim()) return go(page + 1);
  if (t.dataset.checkout !== undefined && CONFIG.checkout === "#") e.preventDefault();
});
document.addEventListener("input", e => {
  if (e.target.id === "nameInput") { state.name = e.target.value; const b = document.querySelector("[data-name]"); if (b) b.disabled = !state.name.trim(); }
});
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "nameInput" && state.name.trim()) go(page + 1); });

render(true);
