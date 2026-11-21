/* Mein Alltag V13: read-only Tagesuebersicht. Keine Datenbank-Schreibzugriffe. */
(()=>{'use strict';
const css=document.createElement('style');css.textContent=`
#privat-v13{margin:15px 0 23px}.v13-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:16px}.v13-stat{background:#fffefa;border:1px solid #e2e9dc;border-radius:14px;padding:13px 15px;text-align:center;box-shadow:0 4px 14px #123b2110}.v13-stat b{display:block;font-size:25px;color:#174e36}.v13-stat small{display:block;color:#667f6c;font-size:12px;margin-top:3px}.v13-group{background:#fffefa;border:1px solid #e2e9dc;border-radius:14px;padding:14px;margin-top:10px}.v13-group h3{font-size:15px;margin:0 0 9px;color:#194b35}.v13-line{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 2px;border-top:1px solid #e9efe8}.v13-line:first-of-type{border-top:0}.v13-line-main{min-width:0;flex:1}.v13-line-main strong{display:block;font-size:13px;overflow-wrap:anywhere}.v13-line-main small{display:block;color:#6b806f;font-size:11px;margin-top:3px}.v13-open{border:1px solid #cbdcca;border-radius:9px;background:#f4f9f1;color:#19573a;font-size:12px;font-weight:700;padding:9px 11px;white-space:nowrap}.v13-empty{font-size:12px;color:#849486;padding:8px 0}.v13-late{color:#b64a36!important}.v13-heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.v13-heading h2{margin:0 0 10px;font-size:17px}.v13-heading small{font-size:11px;color:#829080}
@media(max-width:600px){.v13-summary{gap:6px}.v13-stat{padding:11px 5px}.v13-stat b{font-size:21px}.v13-stat small{font-size:10px}.v13-group{padding:12px}.v13-line{align-items:flex-start}.v13-open{padding:8px}}
`;document.head.appendChild(css);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const addDays=(d,n)=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate()+n,12);return iso(x)};
const pretty=s=>new Date(s+'T12:00:00').toLocaleDateString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit'});
function render(){
 const content=document.getElementById('content');if(!content||document.body.classList.contains('on-home')===false){document.getElementById('privat-v13')?.remove();return}
 const getter=window.meinAlltagV13Records;if(typeof getter!=='function')return;
 const records=getter();if(!Array.isArray(records))return;
 const today=new Date(),start=iso(today),tomorrow=addDays(today,1),end=addDays(today,7);
 const all=records.filter(r=>r&&r.due_date&&/^\d{4}-\d{2}-\d{2}/.test(r.due_date)&&!(r.kind==='tasks'&&r.details?.status==='Erledigt'))
  .map(r=>({...r,day:r.due_date.slice(0,10)})).sort((a,b)=>a.day.localeCompare(b.day)||String(a.title).localeCompare(String(b.title),'de'));
 const late=all.filter(r=>r.day<start),now=all.filter(r=>r.day===start),next=all.filter(r=>r.day===tomorrow),week=all.filter(r=>r.day>tomorrow&&r.day<=end);
 const kind={tasks:'Aufgabe',appointments:'Termin',insurances:'Versicherung',contracts:'Vertrag',vehicles:'Fahrzeug',notes:'Notiz'};
 const row=r=>`<div class="v13-line"><div class="v13-line-main"><strong>${esc(r.title||'Ohne Bezeichnung')}</strong><small>${esc(kind[r.kind]||'Eintrag')} · ${esc(pretty(r.day))}${r.day<start?' · Überfällig':''}</small></div><button type="button" class="v13-open" data-v13-edit="${esc(r.id)}">Öffnen ↗</button></div>`;
 const group=(title,items,lateGroup=false)=>`<section class="v13-group"><h3 class="${lateGroup?'v13-late':''}">${title} (${items.length})</h3>${items.length?items.slice(0,12).map(row).join(''):'<div class="v13-empty">Keine Einträge</div>'}${items.length>12?`<div class="v13-empty">Weitere ${items.length-12} Einträge in den Kategorien</div>`:''}</section>`;
 const html=`<div class="v13-heading"><h2>📅 Dein Tagesüberblick</h2><small>Automatisch aus deinen Einträgen</small></div><div class="v13-summary"><div class="v13-stat"><b>${now.length}</b><small>Heute</small></div><div class="v13-stat"><b>${next.length}</b><small>Morgen</small></div><div class="v13-stat"><b>${now.length+next.length+week.length}</b><small>Nächste 7 Tage</small></div></div>${late.length?group('⚠ Überfällig',late,true):''}${group('Heute',now)}${group('Morgen',next)}${group('Weitere 7 Tage',week)}`;
 let host=document.getElementById('privat-v13');if(!host){host=document.createElement('section');host.id='privat-v13';const grid=content.querySelector('.dashboard-grid');if(grid)grid.insertAdjacentElement('afterend',host);else content.prepend(host)}
 if(host.dataset.rendered===html)return;host.dataset.rendered=html;host.innerHTML=html;
}
let busy=false;const observer=new MutationObserver(()=>{if(busy)return;busy=true;try{render()}finally{busy=false}});
const target=document.getElementById('content');if(target)observer.observe(target,{childList:true,subtree:false});
document.addEventListener('click',e=>{const b=e.target.closest('[data-v13-edit]');if(!b)return;const id=b.dataset.v13Edit;const original=document.querySelector(`[data-edit="${CSS.escape(id)}"]`);if(original){original.click();return}
 // Click on a native category button first; the original app's own edit handler opens the entry.
 const r=window.meinAlltagV13Records?.().find(x=>String(x.id)===id);if(!r)return;
 const nav=document.querySelector(`[data-view="${CSS.escape(r.kind)}"]`);nav?.click();const edit=document.querySelector(`[data-edit="${CSS.escape(id)}"]`);if(edit)edit.click();else alert('Bitte den Eintrag in seiner Kategorie öffnen.');
});
render();
})();
