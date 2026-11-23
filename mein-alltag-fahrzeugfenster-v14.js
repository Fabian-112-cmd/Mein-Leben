/* Mein Alltag V14 – Fahrzeugformular strukturieren, ohne Eingaben oder Datenlogik zu ersetzen. */
(()=>{'use strict';
const modal=document.getElementById('modal');
const title=document.getElementById('modalTitle');
const fields=document.getElementById('entryFields');
const form=document.getElementById('entryForm');
if(!modal||!title||!fields||!form)return;
const style=document.createElement('style');style.textContent=`
#modal.vehicle-v14 .dialog{width:min(860px,calc(100vw - 24px));max-width:860px}
#modal.vehicle-v14 #entryFields{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important;align-items:start}
#modal.vehicle-v14 .v14-section{grid-column:1/-1;min-width:0;border:1px solid #dce8df;background:#fbfdfa;border-radius:15px;padding:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 14px}
#modal.vehicle-v14 .v14-section>h3{grid-column:1/-1;font-size:16px;margin:0 0 2px;color:#164936;display:flex;gap:8px;align-items:center}
#modal.vehicle-v14 .v14-section>label{min-width:0;margin:0!important}
#modal.vehicle-v14 .v14-section>label.wide{grid-column:1/-1}
#modal.vehicle-v14 .v14-section input,#modal.vehicle-v14 .v14-section select,#modal.vehicle-v14 .v14-section textarea{width:100%;max-width:100%;box-sizing:border-box}
#modal.vehicle-v14 .v14-section .vehicle-photo-field,#modal.vehicle-v14 .v14-section .feature-box{grid-column:1/-1;width:100%!important;max-width:none!important;box-sizing:border-box}
#modal.vehicle-v14 .v14-section .history-controls{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
#modal.vehicle-v14 .v14-section .history-controls textarea{grid-column:1/-1;min-height:70px}
#modal.vehicle-v14 .v14-section .history-controls #addHistory{grid-column:1/-1;justify-self:start;max-width:260px}
#modal.vehicle-v14 .v14-section .feature-row{display:flex;gap:12px;align-items:center;justify-content:space-between}
#modal.vehicle-v14 .attach-section{border:1px solid #dce8df;border-radius:15px;padding:16px;background:#fbfdfa}
#modal.vehicle-v14 .v14-upload-warning{font-size:12px;color:#a43a29;font-weight:650;margin-top:8px}
@media(max-width:850px){
 #modal.vehicle-v14 .dialog{width:100%!important;max-width:620px!important}
 #modal.vehicle-v14 #entryFields,#modal.vehicle-v14 .v14-section{grid-template-columns:minmax(0,1fr)!important}
 #modal.vehicle-v14 .v14-section{padding:12px;gap:12px}
 #modal.vehicle-v14 .v14-section .history-controls{grid-template-columns:minmax(0,1fr)!important}
 #modal.vehicle-v14 .v14-section .history-controls textarea,#modal.vehicle-v14 .v14-section .history-controls #addHistory{grid-column:1}
}
`;document.head.appendChild(style);
const section=(heading,klass)=>{const el=document.createElement('section');el.className='v14-section '+klass;const h=document.createElement('h3');h.textContent=heading;el.appendChild(h);fields.appendChild(el);return el};
function arrange(){
 const vehicle=/Fahrzeug/i.test(title.textContent||'')&&!modal.classList.contains('hidden');
 modal.classList.toggle('vehicle-v14',vehicle);
 if(!vehicle||fields.querySelector('.v14-section'))return;
 const labels=[...fields.children].filter(e=>e.matches('label'));
 const photo=fields.querySelector('.vehicle-photo-field');
 const history=[...fields.children].find(e=>e.querySelector('#addHistory'));
 const data=section('🚘 Fahrzeugdaten','v14-data');
 const dates=section('📅 Termine, Versicherung & Kosten','v14-dates');
 const files=section('🗂️ Fahrzeugakte & Servicehistorie','v14-files');
 const match=(text,words)=>words.some(w=>text.toLowerCase().includes(w));
 for(const label of labels){
  const name=(label.textContent||'').toLowerCase();
  const target=match(name,['tüv','versicherung','servicekosten','werkstattservice','kosten','fällig','erinnerung'])?dates:match(name,['bemerkung','notiz'])?files:data;
  target.appendChild(label);
 }
 if(photo)files.appendChild(photo);
 if(history)files.appendChild(history);
 // Leere Abschnitte vermeiden.
 for(const s of [data,dates,files])if(s.children.length===1)s.remove();
}
let pending=false;
function schedule(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;arrange()})}
new MutationObserver(schedule).observe(modal,{attributes:true,attributeFilter:['class']});
new MutationObserver(schedule).observe(fields,{childList:true});
const fileInput=document.getElementById('newAttachments');
if(fileInput){fileInput.addEventListener('change',()=>{
 let msg=form.querySelector('.v14-upload-warning');if(msg)msg.remove();
 const oversized=[...(fileInput.files||[])].filter(f=>f.size>10*1024*1024);
 if(oversized.length){msg=document.createElement('p');msg.className='v14-upload-warning';msg.textContent='Zu groß (max. 10 MB je Datei): '+oversized.map(f=>f.name).join(', ')+'. Bitte kleinere Datei auswählen.';fileInput.closest('.attach-section')?.appendChild(msg)}
 });}
schedule();
})();
