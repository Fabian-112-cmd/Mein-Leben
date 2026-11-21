/* Mein Alltag V9: kompakte Checkliste + sicherer Löschen-Button */
(()=>{'use strict';
const modal=document.getElementById('modal'),dialog=modal?.querySelector('.dialog');
if(!modal||!dialog)return;
let selectedId=null;
document.addEventListener('click',e=>{
 const edit=e.target.closest('[data-edit]');
 if(edit)selectedId=edit.dataset.edit;
 const fresh=e.target.closest('[data-quick],#addBtn,#fab');
 if(fresh)selectedId=null;
},true);
const css=document.createElement('style');
css.textContent=`
#modal .feature-box:has(#checklistEditor){width:100%!important;max-width:none!important;grid-column:1/-1!important;padding:17px 18px!important;border:1px solid #dbe9de!important;background:#f8fbf7!important;border-radius:15px!important}
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
@media(min-width:851px){#modal .dialogfoot{display:flex!important;align-items:center!important;gap:9px!important}#modal .dialogfoot .privat-delete{margin-right:auto!important}}
@media(max-width:850px){#modal .dialogfoot{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important}#modal .dialogfoot button{font-size:13px!important;padding:10px 5px!important}}
`;
document.head.appendChild(css);
const actions=dialog.querySelector('.dialogfoot');
if(!actions)return;
const del=document.createElement('button');del.type='button';del.className='btn privat-delete';del.textContent='🗑 Löschen';del.hidden=true;
actions.prepend(del);
const sync=()=>{
 const editing=!modal.classList.contains('hidden')&&/^Bearbeiten:/.test(document.getElementById('modalTitle')?.textContent||'');
 // Nur anzeigen, wenn die ID eindeutig aus einem Bearbeiten-Klick bekannt ist.
 del.hidden=!(editing&&selectedId);
};
const observer=new MutationObserver(sync);
observer.observe(modal,{attributes:true,attributeFilter:['class']});
observer.observe(document.getElementById('modalTitle')||dialog,{childList:true,subtree:true});
del.addEventListener('click',()=>{
 if(!selectedId)return;
 const id=selectedId;
 const original=[...document.querySelectorAll('[data-del]')].find(b=>b.dataset.del===id);
 if(!original){alert('Bitte den Eintrag in seiner Kategorie öffnen und dort über das ×-Symbol löschen.');return}
 // Originale Löschfunktion mit bestehender Sicherheitsabfrage benutzen.
 modal.classList.add('hidden');
 selectedId=null;
 original.click();
});
sync();
})();
