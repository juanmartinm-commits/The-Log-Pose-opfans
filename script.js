const stateKey = "logpose_opfans_unlocked_v1";
let achievements = [];
let unlocked = new Set(JSON.parse(localStorage.getItem(stateKey) || "[]"));
let selected = null;

const $ = s => document.querySelector(s);
const grid = $("#achievementGrid");
const dialog = $("#unlockDialog");
const keywordInput = $("#keywordInput");
const message = $("#dialogMessage");

async function loadData(){
  const res = await fetch("assets/achievements.json");
  achievements = await res.json();
  const arcs = [...new Set(achievements.map(a=>a.arc))].sort();
  arcs.forEach(arc=>{
    const o=document.createElement("option"); o.value=arc; o.textContent=arc;
    $("#arcFilter").appendChild(o);
  });
  render();
}

function imgPath(path){
  return path;
}

function render(){
  const q=$("#search").value.trim().toLowerCase();
  const arc=$("#arcFilter").value;
  const status=$("#statusFilter").value;

  const list=achievements.filter(a=>{
    const text=(a.title+" "+a.description+" "+a.arc).toLowerCase();
    const matchesQ=!q || text.includes(q);
    const matchesArc=arc==="all" || a.arc===arc;
    const isUnlocked=unlocked.has(a.id);
    const matchesStatus=status==="all" || (status==="unlocked" ? isUnlocked : !isUnlocked);
    return matchesQ && matchesArc && matchesStatus;
  });

  grid.innerHTML=list.length ? list.map(cardHTML).join("") :
    `<div class="empty">No hay logros que coincidan con tu búsqueda.</div>`;

  document.querySelectorAll("[data-unlock]").forEach(btn=>{
    btn.addEventListener("click",()=>openUnlock(btn.dataset.unlock));
  });
  updateStats();
}

function cardHTML(a){
  const isUnlocked=unlocked.has(a.id);
  return `<article class="card ${isUnlocked?"unlocked":"locked"}">
    <div class="card-img">
      <img src="${imgPath(a.image)}" alt="${escapeHtml(a.title)}" onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">
      ${isUnlocked ? "" : `<div class="lock" aria-label="Bloqueado">🔒</div>`}
    </div>
    <div class="card-body">
      <span class="tag">${escapeHtml(a.arc)} · ${escapeHtml(a.type)}</span>
      <h3>${escapeHtml(a.title)}</h3>
      <p>${escapeHtml(a.description)}</p>
      <div class="card-bottom">
        <span class="status">${isUnlocked?"✓ DESBLOQUEADO":"BLOQUEADO"}</span>
        <button class="small-button" data-unlock="${a.id}">Ingresar palabra</button>
      </div>
    </div>
  </article>`;
}

function openUnlock(id){
  selected=achievements.find(a=>a.id===id);
  if(!selected) return;
  $("#dialogTitle").textContent=selected.title;
  keywordInput.value="";
  message.textContent="";
  message.className="dialog-message";
  dialog.showModal();
  setTimeout(()=>keywordInput.focus(),50);
}

$("#unlockForm").addEventListener("submit", e=>{
  e.preventDefault();
  if(!selected) return;
  const entered=keywordInput.value.trim().toUpperCase();
  if(entered===selected.keyword.toUpperCase()){
    unlocked.add(selected.id);
    localStorage.setItem(stateKey,JSON.stringify([...unlocked]));
    message.textContent="¡Logro desbloqueado!";
    message.className="dialog-message ok";
    render();
    setTimeout(()=>dialog.close(),700);
  }else{
    message.textContent="La palabra clave no coincide.";
    message.className="dialog-message error";
  }
});

["search","arcFilter","statusFilter"].forEach(id=>$( "#"+id).addEventListener("input",render));
$("#arcFilter").addEventListener("change",render);
$("#statusFilter").addEventListener("change",render);

function updateStats(){
  const count=unlocked.size;
  const total=achievements.length;
  const pct=total ? Math.round(count/total*100) : 0;
  $("#unlockedCount").textContent=count;
  $("#totalCount").textContent=total;
  $("#progressPercent").textContent=pct+"%";
  $("#heroProgress").textContent=`${count} / ${total}`;
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
loadData().catch(()=>{
  grid.innerHTML='<div class="empty">No se pudo cargar la lista de logros. Abrí la página mediante GitHub Pages o un servidor local.</div>';
});
