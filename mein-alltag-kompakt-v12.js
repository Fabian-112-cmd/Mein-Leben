/* Mein Alltag V12: vereinheitlicht V7, V8, V9 und V11.
   Die Original-Speicher- und Loeschfunktionen bleiben erhalten. */
(function(){
'use strict';
const modal=document.getElementById('modal');
const dialog=modal?.querySelector('.dialog');
const form=dialog?.querySelector('#entryForm');
const fields=form?.querySelector('#entryFields');
const attachments=form?.querySelector('.attach-section');
const footer=form?.querySelector('.dialogfoot')||dialog?.querySelector('.dialogfoot');
if(!modal||!dialog||!form||!fields||!attachments||!footer)return;

// Alles bleibt IM Formular, damit die originale Speicherroutine ihren
// Submit-Button weiterhin mit querySelector findet.
let scroller=form.querySelector('.privat-v12-scroll');
if(!scroller){
 scroller=document.createElement('div');
 scroller.className='privat-v12-scroll';
 form.insertBefore(scroller,fields);
 scroller.append(fields,attachments);
}
if(footer.parentElement!==form)form.appendChild(footer);
const save=footer.querySelector('button[type="submit"]');
save?.removeAttribute('form');

// ID wird aus dem originalen Bearbeiten-Button gelesen.
let currentId=null;
document.addEventListener('click',event=>{
 const edit=event.target.closest('[data-edit]');
 if(edit)currentId=edit.dataset.edit;
 if(event.target.closest('[data-quick],#addBtn,#fab'))currentId=null;
},true);

const del=document.createElement('button');
del.type='button';
del.className='btn privat-delete';
del.textContent='🗑 Löschen';
del.hidden=true;
footer.prepend(del);
const sync=()=>{
 const editing=!modal.classList.contains('hidden') &&
   (document.getElementById('modalTitle')?.textContent||'').startsWith('Bearbeiten:');
 del.hidden=!(editing&&currentId);
 document.body.classList.toggle('privat-entry-open',!modal.classList.contains('hidden'));
};
new MutationObserver(sync).observe(modal,{attributes:true,attributeFilter:['class']});
const title=document.getElementById('modalTitle');
if(title)new MutationObserver(sync).observe(title,{childList:true,subtree:true});
sync();

del.addEventListener('click',async()=>{
 if(!currentId||typeof window.meinAlltagRemove!=='function'){
  alert('Löschen nicht verfügbar. Bitte den Eintrag erneut über Bearbeiten öffnen.');
  return;
 }
 const id=currentId;
 del.disabled=true;
 try{
  // Die Originalfunktion zeigt ihre eigene Sicherheitsabfrage und
  // behandelt Datenbank- und Dateifehler.
  await window.meinAlltagRemove(id);
 }catch(error){
  alert('Löschen fehlgeschlagen: '+(error?.message||error));
 }finally{del.disabled=false}
});

const style=document.createElement('style');
style.id='mein-alltag-kompakt-v12-styles';
style.textContent=`
/* Checkliste – auf PC und Mobil volle Breite */
#modal .feature-box:has(#checklistEditor){
 width:100%!important;max-width:none!important;grid-column:1/-1!important;
 padding:17px 18px!important;border:1px solid #dbe9de!important;
 background:#f8fbf7!important;border-radius:15px!important;
}
#modal .feature-box:has(#checklistEditor) h3{margin:0 0 5px!important;font-size:16px!important}
#modal .feature-box:has(#checklistEditor) .feature-muted{margin:0 0 12px!important;font-size:12px!important}
#modal #checklistEditor{width:100%!important;min-height:86px!important;max-height:170px!important;resize:vertical!important;background:#fff!important;border-radius:10px!important;padding:12px!important;font-size:14px!important;line-height:1.5!important}
#modal .feature-box:has(#checklistEditor) .feature-list{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(190px,1fr))!important;gap:7px!important;margin-top:12px!important}
#modal .feature-box:has(#checklistEditor) .checklist-line{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;min-height:44px!important;padding:10px 12px!important;margin:0!important;border:1px solid #e0e8de!important;border-radius:10px!important;background:white!important;text-align:left!important;line-height:1.35!important;cursor:pointer}
#modal .feature-box:has(#checklistEditor) .checklist-line input{width:19px!important;height:19px!important;flex:0 0 19px!important;margin:0!important;accent-color:#226443}
#modal .feature-box:has(#checklistEditor) .checklist-line span{display:inline!important;min-width:0!important;overflow-wrap:anywhere!important;font-size:13px!important;font-weight:550!important}
#modal .feature-box:has(#checklistEditor) .checklist-line.done span{text-decoration:line-through!important;opacity:.55}
#modal .dialogfoot .privat-delete{margin-right:auto!important;background:#fff5f3!important;color:#a93630!important;border:1px solid #e8b6b1!important}
#modal .dialogfoot .privat-delete:hover{background:#ffe7e3!important}
@media(min-width:851px){
 #modal .dialogfoot{display:flex!important;align-items:center!important;gap:9px!important}
}
@media(max-width:850px){
 #modal.modal:not(.hidden){z-index:1000!important;inset:0!important;display:flex!important;align-items:stretch!important;justify-content:center!important;overflow:hidden!important;padding:calc(9px + env(safe-area-inset-top)) 10px calc(9px + env(safe-area-inset-bottom))!important}
 #modal>.dialog{width:100%!important;max-width:620px!important;height:100%!important;max-height:100%!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;padding:18px 15px 0!important;border-radius:19px!important}
 #modal>.dialog>h2{flex:0 0 auto!important;font-size:21px!important;line-height:1.25!important;margin:0 0 12px!important;padding-bottom:12px!important;border-bottom:1px solid #e1e9e1!important}
 #modal #entryForm{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;overflow:hidden!important;padding:0!important}
 #modal .privat-v12-scroll{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:3px 3px 18px!important}
 #modal #entryFields{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:13px!important}
 #modal #entryFields input,#modal #entryFields select,#modal #entryFields textarea{max-width:100%!important;width:100%!important;font-size:16px!important}
 #modal #entryForm>.dialogfoot{position:static!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;flex:0 0 auto!important;gap:7px!important;margin:0 -15px!important;padding:12px 15px 13px!important;background:white!important;border-top:1px solid #dce8de!important;box-shadow:0 -6px 16px #143c2010!important;z-index:3!important}
 #modal #entryForm>.dialogfoot button{width:100%!important;min-height:46px!important;min-width:0!important;font-size:13px!important;padding:10px 5px!important}
 #modal #entryForm>.dialogfoot .privat-delete[hidden]{display:none!important}
 #modal #entryForm>.dialogfoot:has(.privat-delete[hidden]){grid-template-columns:repeat(2,minmax(0,1fr))!important}
 body.privat-entry-open .bottom,body.privat-entry-open #fab{visibility:hidden!important;pointer-events:none!important}
}
`;
document.head.appendChild(style);
})();
