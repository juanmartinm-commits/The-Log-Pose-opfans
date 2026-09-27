const DATA = [
 {id:"romance-dawn",arc:"Romance Dawn",group:"East Blue",title:"El comienzo de la aventura",desc:"La aventura comienza y el viaje toma rumbo.",image:"east-blue.png",keyword:"EASTBLUE",icon:"⛵"},
 {id:"orange-town",arc:"Orange Town",group:"East Blue",title:"El payaso entra en escena",desc:"Un nuevo enemigo aparece en el camino.",image:"orange-town.png",keyword:"ORANGETOWN",icon:"🤡"},
 {id:"syrup-village",arc:"Syrup Village",group:"East Blue",title:"Un mentiroso se une",desc:"Una historia, una tripulación y un nuevo rumbo.",image:"syrup-village.png",keyword:"USOPP",icon:"🎯"},
 {id:"baratie",arc:"Baratie",group:"East Blue",title:"All Blue",desc:"El sueño de un cocinero encuentra su lugar en el mar.",image:"baratie.png",keyword:"ALLBLUE",icon:"🍴"},
 {id:"arlong-park",arc:"Arlong Park",group:"East Blue",title:"¡Nami!",desc:"Una promesa y una batalla por la libertad.",image:"arlong-park.png",keyword:"ARLONGPARK",icon:"🌊"},
 {id:"loguetown",arc:"Loguetown",group:"East Blue",title:"Hacia la Grand Line",desc:"El East Blue queda atrás. La próxima etapa comienza.",image:"loguetown.png",keyword:"GRANDLINE",icon:"🧭"},
 {id:"katana",arc:"Colección",group:"Especial",title:"Tres espadas",desc:"Un logro especial relacionado con las katanas del viaje.",image:"katana.png",keyword:"SANTORYU",icon:"⚔️"},
 {id:"fruits",arc:"Colección",group:"Especial",title:"Frutas misteriosas",desc:"Reconocé las frutas y sus diseños.",image:"frutas.png",keyword:"DEVILFRUIT",icon:"🍊"},
 {id:"ohara",arc:"Ohara",group:"Especial",title:"La historia prohibida",desc:"Un secreto del mundo que no debería ser olvidado.",image:"ohara.png",keyword:"OHARA",icon:"📜"}
];
const ROUTE = [
 ["Romance Dawn","⛵"],["Orange Town","🤡"],["Syrup Village","🎯"],["Baratie","🍴"],["Arlong Park","🌊"],["Loguetown","🧭"],["Grand Line","☠️"]
];
let unlocked = JSON.parse(localStorage.getItem("logpose_unlocked") || "[]");
let selected = null, lockOnly = false;
const $ = s => document.querySelector(s);

function isUnlocked(id){return unlocked.includes(id)}
function save(){localStorage.setItem("logpose_unlocked",JSON.stringify(unlocked))}
function renderRoute(){
  $("#routeNodes").innerHTML = ROUTE.map((r,i)=>{
    const item=DATA.find(x=>x.arc===r[0]);
    const active=item && isUnlocked(item.id);
    return `<div class="route-node ${active?"active":""} ${i===0&&!active?"current":""}">
      <div class="route-dot">${r[1]}</div><b>${r[0]}</b><small>${active?"DESBLOQUEADO":i===6?"PRÓXIMO DESTINO":"RUTA"}</small>
    </div>`
  }).join("");
}
function renderFilters(){
  const arcs=[...new Set(DATA.map(x=>x.group))];
  $("#arcFilter").innerHTML='<option value="all">Todos los arcos</option>'+arcs.map(a=>`<option value="${a}">${a}</option>`).join("");
}
function imageUrl(name){
  return `assets/images/${name}`;
}
function renderCards(){
  const q=$("#search").value.toLowerCase().trim(), arc=$("#arcFilter").value;
  const list=DATA.filter(x=>{
    const text=(x.title+" "+x.desc+" "+x.arc+" "+x.group).toLowerCase();
    return (!q||text.includes(q)) && (arc==="all"||x.group===arc) && (!lockOnly||!isUnlocked(x.id));
  });
  $("#achievementsGrid").innerHTML=list.map(x=>{
    const done=isUnlocked(x.id);
    return `<article class="achievement ${done?"":"locked"}">
      <div class="achievement-image" style="background-image:url('${imageUrl(x.image)}'),url('assets/images/placeholder.svg')">
        ${done?"":"<span class='lock-badge'>🔒 BLOQUEADO</span>"}
      </div>
      <div class="achievement-body">
        <span class="arc">${x.group} · ${x.arc}</span>
        <h3>${done?x.title:"???"}</h3>
        <p>${done?x.desc:"Desbloqueá este logro para descubrirlo."}</p>
        <div class="achievement-foot">
          <span class="status ${done?"done":""}">${done?"✓ DESBLOQUEADO":"🔒 OCULTO"}</span>
          <button class="claim" data-id="${x.id}" ${done?"disabled":""}>${done?"Conseguido":"Desbloquear"}</button>
        </div>
      </div>
    </article>`
  }).join("") || `<p>No encontramos logros con esos filtros.</p>`;
  document.querySelectorAll(".claim:not(:disabled)").forEach(b=>b.onclick=()=>openUnlock(b.dataset.id));
  updateStats();
}
function updateStats(){
  const n=unlocked.length,total=DATA.length,p=Math.round(n/total*100);
  $("#unlockedCount").textContent=n;$("#totalCount").textContent=total;$("#progressPercent").textContent=p+"%";$("#progressBar").style.width=p+"%";
}
function openUnlock(id){
  selected=DATA.find(x=>x.id===id);
  $("#dialogTitle").textContent=selected.title;
  $("#dialogHint").textContent="Ingresá la palabra clave para reclamar este logro.";
  $("#keywordInput").value="";$("#keywordMessage").textContent="";$("#keywordMessage").className="message";
  $("#unlockDialog").showModal();setTimeout(()=>$("#keywordInput").focus(),50);
}
$("#unlockForm").addEventListener("submit",e=>{
  if(e.submitter?.value==="cancel")return;
  e.preventDefault();
  const value=$("#keywordInput").value.trim().toUpperCase();
  if(value===selected.keyword){
    if(!unlocked.includes(selected.id))unlocked.push(selected.id);
    save();$("#keywordMessage").textContent="✓ Logro desbloqueado.";$("#keywordMessage").className="message ok";
    renderCards();renderRoute();setTimeout(()=>$("#unlockDialog").close(),650);
  }else{$("#keywordMessage").textContent="La palabra clave no es correcta."}
});
$("#search").addEventListener("input",renderCards);
$("#arcFilter").addEventListener("change",renderCards);
$("#lockFilter").addEventListener("click",()=>{lockOnly=!lockOnly;$("#lockFilter").textContent=lockOnly?"Solo bloqueados":"Todos";$("#lockFilter").classList.toggle("active",lockOnly);renderCards()});
renderFilters();renderRoute();renderCards();