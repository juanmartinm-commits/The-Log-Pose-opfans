const achievements = [
  {id:1, title:"El inicio de la aventura", desc:"Queda mucho camino por delante.", arc:"East Blue", img:"assets/achievement_01.jpg", key:["LOGPOSE"], type:"común"},
  {id:2, title:"Derrotando a los corruptos", desc:"El capitán corrupto.", arc:"East Blue", img:"assets/achievement_02.jpg", key:["HELMEPPO","MORGAN"], type:"común"},
  {id:3, title:"El primer nakama", desc:"El espadachín de la tripulación.", arc:"East Blue", img:"assets/achievement_03.jpg", key:["ZORO"], type:"nakama"},
  {id:4, title:"Navegante", desc:"La ladrona del pelo naranja.", arc:"East Blue", img:"assets/achievement_04.jpg", key:["NAMI"], type:"nakama"},
  {id:5, title:"Payaso", desc:"El payaso que se divide.", arc:"Orange Town", img:"assets/achievement_05.jpg", key:["BUGGY","RICHIE","MOHJI","CABAJI"], minKeys:3, type:"medio"},
  {id:6, title:"Shushu", desc:"???", arc:"Orange Town", img:"assets/achievement_06.jpg", key:["SHUSHU"], secret:true, type:"secreto"},
  {id:7, title:"El mentiroso", desc:"El mentiroso del pueblo.", arc:"Villa Syrup", img:"assets/achievement_07.jpg", key:["USOPP"], type:"nakama"},
  {id:8, title:"El primer barco", desc:"El primer barco oficial.", arc:"Villa Syrup", img:"assets/achievement_08.jpg", key:["GOING MERRY","MERRY"], type:"nakama-medio"},
  {id:9, title:"Ojos de halcón", desc:"La persona imprevista.", arc:"Baratie", img:"assets/achievement_09.jpg", key:["DRACULE MIHAWK","MIHAWK"], type:"medio"},
  {id:10, title:"Cocinero", desc:"El mejor del restaurante.", arc:"Baratie", img:"assets/achievement_10.jpg", key:["SANJI"], type:"nakama"},
  {id:11, title:"Ejemplo a seguir", desc:"Buena acción voluntaria.", arc:"Baratie", img:"assets/achievement_11.jpg", key:["COMIDA","HAMBRE","SANJI"], minKeys:1, type:"difícil"},
  {id:12, title:"Los infames piratas", desc:"Los infames piratas.", arc:"Baratie", img:"assets/achievement_12.jpg", key:["PEARL","GIN","DON KRIEG"], minKeys:3, secret:true, type:"secreto"},
  {id:13, title:"Derrota", desc:"La derrota inesperada.", arc:"Baratie", img:"assets/achievement_13.jpg", key:["ZORO"], autoAfter:12, type:"común"},
  {id:14, title:"Traición", desc:"La traición inesperada.", arc:"Arlong Park", img:"assets/achievement_14.jpg", key:["NAMI"], type:"común"},
  {id:15, title:"Mandarinas", desc:"Triste historia de ???", arc:"Arlong Park", img:"assets/achievement_15.jpg", key:["BELL-MERE","BELLMERE","BELL MERE"], type:"medio"},
  {id:16, title:"Hombres pez", desc:"La tripulación pez.", arc:"Arlong Park", img:"assets/achievement_16.jpg", key:["CHEW","ARLONG","HATCHAN","HACHAN","KUROOBI","NAMI"], minKeys:5, type:"difícil"},
  {id:17, title:"Humitos", desc:"El humitos.", arc:"Loguetown", img:"assets/achievement_17.jpg", key:["SMOKER","TASHIGI"], minKeys:2, type:"común"},
  {id:18, title:"Alianza pirata", desc:"Inesperada alianza.", arc:"Loguetown", img:"assets/achievement_01.jpg", key:["BUGGY","ALVIDA"], minKeys:2, type:"medio"},
  {id:19, title:"Juramento", desc:"Los sueños de la tripulación.", arc:"Loguetown", img:"assets/achievement_02.jpg", key:["LOS SUEÑOS SON LO MÁS IMPORTANTE","LOS SUENOS SON LO MAS IMPORTANTE"], secret:true, type:"secreto"},
  {id:20, title:"Baratie", desc:"Completaste los logros principales del Baratie.", arc:"Baratie", img:"assets/achievement_12.jpg", trophy:true, type:"trofeo", requires:[9,10,11,12,13]},
  {id:21, title:"Arlong Park", desc:"Desbloqueaste el arco de Arlong Park.", arc:"Arlong Park", img:"assets/achievement_16.jpg", trophy:true, type:"trofeo", requires:[14,15,16]},
  {id:22, title:"Loguetown", desc:"Completaste los logros principales de Loguetown.", arc:"Loguetown", img:"assets/achievement_17.jpg", trophy:true, type:"medio", requires:[17,18,19]},
  {id:23, title:"Pirata principiante", desc:"Completaste la saga del East Blue.", arc:"East Blue", img:"assets/achievement_03.jpg", trophy:true, type:"medio", requires:[1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19]},
  {id:24, title:"Rumbo a la Gran Ruta", desc:"El viaje continúa hacia una nueva etapa.", arc:"Loguetown", img:"assets/achievement_04.jpg", trophy:true, type:"medio", requires:[22,23]}
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
function normalize(s){ return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toUpperCase(); }
function requirementMet(a, value){
  const entered = normalize(value);
  if(a.minKeys){ return a.key.filter(k => entered.includes(normalize(k))).length >= a.minKeys; }
  return a.key.some(k => entered === normalize(k) || entered.includes(normalize(k)));
}
function unlock(id){
  if(!saved.includes(id)) saved.push(id);
}
function checkAutomatic(){
  achievements.filter(a => a.autoAfter && isUnlocked(a.autoAfter)).forEach(a => unlock(a.id));
  achievements.filter(a => a.requires && a.requires.every(isUnlocked)).forEach(a => unlock(a.id));
}

function render(){
  checkAutomatic();
  localStorage.setItem("opfans_progress", JSON.stringify(saved));
  const filtered = achievements.filter(a =>
    currentFilter === "all" ||
    (currentFilter === "unlocked" && isUnlocked(a.id)) ||
    (currentFilter === "locked" && !isUnlocked(a.id))
  );

  grid.innerHTML = filtered.map(a => `
    <article class="achievement ${isUnlocked(a.id) ? "unlocked" : "locked"}">
      <div class="status">${isUnlocked(a.id) ? "DESBLOQUEADO" : "BLOQUEADO"}</div>
      <div class="badge"><img src="${a.img}" alt="${a.title}"></div>
      <span class="tag">${a.arc}${a.type ? " • " + a.type : ""}</span>
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
      ${isUnlocked(a.id)
        ? `<button class="claim-btn" disabled>✓ Logro conseguido</button>`
        : a.trophy
          ? `<button class="claim-btn" disabled>🔒 Completá los requisitos</button>`
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
  if(a.trophy) return;
  modalContent.innerHTML = `
    <img src="${a.img}" style="width:130px;height:130px;object-fit:cover;border-radius:50%;border:4px solid #8d662c;box-shadow:0 5px 14px rgba(0,0,0,.25)" alt="">
    <h2>${a.title}</h2>
    <p>${a.secret ? "Es un logro secreto. Ingresá la palabra o los datos requeridos." : "Ingresá la palabra clave para reclamar este logro."}</p>
    <input id="keyInput" autocomplete="off" placeholder="Palabra clave">
    <div class="error" id="error"></div>
    <button class="submit" id="submitKey">Reclamar logro</button>
  `;
  modal.classList.remove("hidden");
  const keyInput = document.getElementById("keyInput");
  keyInput.focus();
  document.getElementById("submitKey").onclick = () => {
    if(requirementMet(a, keyInput.value)){
      unlock(a.id);
      checkAutomatic();
      localStorage.setItem("opfans_progress", JSON.stringify(saved));
      modal.classList.add("hidden");
      render();
    } else {
      document.getElementById("error").textContent = "Los datos ingresados no cumplen el requisito.";
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
