const achievements = [
  {id:1, title:"Comienzo de la aventura", desc:"Comenzá tu viaje por el mundo de One Piece.", arc:"East Blue", img:"assets/achievement_01.jpg", key:"LOGPOSE"},
  {id:2, title:"Derribando a los corruptos", desc:"Superá uno de los primeros grandes conflictos de la aventura.", arc:"East Blue", img:"assets/achievement_02.jpg", key:"CORRUPTOS"},
  {id:3, title:"El primer nakama", desc:"Conocé al primer gran compañero que se suma al viaje.", arc:"East Blue", img:"assets/achievement_03.jpg", key:"NAKAMA"},
  {id:4, title:"El primer nakama", desc:"Conseguí este logro al avanzar por la historia y conocer a Zoro.", arc:"East Blue", img:"assets/achievement_04.jpg", key:"ZORO"},
  {id:5, title:"El payaso Buggy", desc:"Llegá al encuentro con uno de los primeros piratas reconocibles de la aventura.", arc:"East Blue", img:"assets/achievement_05.jpg", key:"BUGGY"},
  {id:6, title:"Nami", desc:"Conocé a la navegante que marcará una etapa importante del viaje.", arc:"East Blue", img:"assets/achievement_06.jpg", key:"NAMI"},
  {id:7, title:"El capitán Usopp", desc:"Llegá a la historia de Usopp y su incorporación al viaje.", arc:"East Blue", img:"assets/achievement_07.jpg", key:"USOPP"},
  {id:8, title:"El primer barco", desc:"Conseguí tu primer barco para continuar la aventura.", arc:"East Blue", img:"assets/achievement_08.jpg", key:"BARCO"},
  {id:9, title:"Restaurante marítimo Baratie", desc:"Llegá al Baratie y conocé una nueva parte del mundo pirata.", arc:"East Blue", img:"assets/achievement_09.jpg", key:"BARATIE"},
  {id:10, title:"Mihawk — un caballero del mar", desc:"Conocé a uno de los espadachines más importantes de la historia.", arc:"East Blue", img:"assets/achievement_10.jpg", key:"MIHAWK"},
  {id:11, title:"El cocinero Sanji", desc:"Llegá al momento en que Sanji entra en escena.", arc:"East Blue", img:"assets/achievement_11.jpg", key:"SANJI"},
  {id:12, title:"Traición", desc:"Descubrí una de las situaciones más importantes relacionadas con Nami.", arc:"East Blue", img:"assets/achievement_12.jpg", key:"TRAICION"},
  {id:13, title:"Mandarinas — historia de Nami", desc:"Conocé la historia que explica una parte fundamental de Nami.", arc:"East Blue", img:"assets/achievement_13.jpg", key:"MANDARINAS"},
  {id:14, title:"Hombres pez vs la tripulación", desc:"Llegá a uno de los grandes enfrentamientos de East Blue.", arc:"Arlong Park", img:"assets/achievement_14.jpg", key:"ARLONG"},
  {id:15, title:"Juramento", desc:"Viví uno de los momentos que consolidan el vínculo de la tripulación.", arc:"East Blue", img:"assets/achievement_15.jpg", key:"JURAMENTO"},
  {id:16, title:"Alianza pirata", desc:"Descubrí el valor de formar alianzas durante la aventura.", arc:"East Blue", img:"assets/achievement_16.jpg", key:"ALIANZA"},
  {id:17, title:"Humitos — Loguetown", desc:"Llegá a Loguetown y preparate para entrar en la Gran Ruta.", arc:"Loguetown", img:"assets/achievement_17.jpg", key:"LOGUETOWN"}
];

const saved = JSON.parse(localStorage.getItem("opfans_progress") || "[]");
const username = localStorage.getItem("opfans_username") || "";
const input = document.getElementById("username");
input.value = username;
input.addEventListener("input", e => localStorage.setItem("opfans_username", e.target.value));

const grid = document.getElementById("achievementGrid");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
let currentFilter = "all";

function isUnlocked(id){ return saved.includes(id); }

function render(){
  const filtered = achievements.filter(a =>
    currentFilter === "all" ||
    (currentFilter === "unlocked" && isUnlocked(a.id)) ||
    (currentFilter === "locked" && !isUnlocked(a.id))
  );

  grid.innerHTML = filtered.map(a => `
    <article class="achievement ${isUnlocked(a.id) ? "unlocked" : "locked"}">
      <div class="status">${isUnlocked(a.id) ? "DESBLOQUEADO" : "BLOQUEADO"}</div>
      <div class="badge"><img src="${a.img}" alt="${a.title}"></div>
      <span class="tag">${a.arc}</span>
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
      ${isUnlocked(a.id)
        ? `<button class="claim-btn" disabled>✓ Logro conseguido</button>`
        : `<button class="claim-btn" onclick="openClaim(${a.id})">Desbloquear</button><div class="lock-icon">🔒</div>`}
    </article>
  `).join("");

  const count = saved.length;
  const pct = Math.round(count / achievements.length * 100);
  document.getElementById("progressText").textContent = `${count} / ${achievements.length}`;
  document.getElementById("progressRingText").textContent = `${pct}%`;
  document.querySelector(".progress-ring").style.background =
    `conic-gradient(#d5ad59 ${pct * 3.6}deg, rgba(255,255,255,.12) 0deg)`;
}

window.openClaim = function(id){
  const a = achievements.find(x => x.id === id);
  modalContent.innerHTML = `
    <img src="${a.img}" style="width:130px;height:130px;object-fit:cover;border-radius:50%;border:4px solid #8d662c;box-shadow:0 5px 14px rgba(0,0,0,.25)" alt="">
    <h2>${a.title}</h2>
    <p>Ingresá la palabra clave para reclamar este logro.</p>
    <input id="keyInput" autocomplete="off" placeholder="Palabra clave">
    <div class="error" id="error"></div>
    <button class="submit" id="submitKey">Reclamar logro</button>
  `;
  modal.classList.remove("hidden");
  const keyInput = document.getElementById("keyInput");
  keyInput.focus();
  document.getElementById("submitKey").onclick = () => {
    if(keyInput.value.trim().toUpperCase() === a.key){
      saved.push(a.id);
      localStorage.setItem("opfans_progress", JSON.stringify(saved));
      modal.classList.add("hidden");
      render();
    } else {
      document.getElementById("error").textContent = "La palabra clave no coincide.";
    }
  };
  keyInput.addEventListener("keydown", e => { if(e.key === "Enter") document.getElementById("submitKey").click(); });
};

document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
modal.addEventListener("click", e => { if(e.target === modal) modal.classList.add("hidden"); });

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

document.getElementById("resetBtn").onclick = () => {
  if(confirm("¿Seguro que querés borrar todos los logros de este dispositivo?")){
    localStorage.removeItem("opfans_progress");
    saved.length = 0;
    render();
  }
};

render();
