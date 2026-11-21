/* Mein Alltag V10 – Löschen funktioniert auch aus Übersicht / erledigten Aufgaben.
   Nutzt ausschließlich die bestehende App-Löschfunktion samt Sicherheitsabfrage. */
(function(){
'use strict';
let currentId=null;
document.addEventListener('click',function(e){
 const edit=e.target.closest('[data-edit]');
 if(edit)currentId=edit.getAttribute('data-edit');
 const fresh=e.target.closest('[data-quick],#addBtn,#fab');
 if(fresh)currentId=null;
},true);
document.addEventListener('click',function(e){
 const btn=e.target.closest('#modal .privat-delete');
 if(!btn)return;
 // Den fehlerhaften V9-Klickhandler vor seiner Ausführung abfangen.
 e.preventDefault();e.stopImmediatePropagation();
 const modal=document.getElementById('modal');
 const title=document.getElementById('modalTitle')?.textContent||'';
 if(!currentId || !title.startsWith('Bearbeiten:')){
  alert('Bitte den vorhandenen Eintrag erneut über Bearbeiten öffnen.');
  return;
 }
 const id=currentId;
 // Bereits gerenderter Löschknopf?
 let original=[...document.querySelectorAll('[data-del]')].find(b=>b.dataset.del===id);
 if(original){
  modal?.classList.add('hidden');
  currentId=null;
  original.click();
  return;
 }
 // Die Listenansicht derselben Kategorie aufrufen, damit die originale
 // Löschschaltfläche mit ihrem bestehenden Handler verfügbar wird.
 const label=title.replace(/^Bearbeiten:\s*/,'').trim().toLowerCase();
 const categories={
  'aufgabe':'tasks','notiz':'notes','termin':'appointments',
  'versicherung':'insurances','vertrag':'contracts',
  'fahrzeug':'vehicles'
 };
 const kind=categories[label];
 const nav=kind&&document.querySelector('[data-view="'+kind+'"]');
 if(!nav){
  alert('Der Eintrag konnte keiner Kategorie zugeordnet werden. Bitte in der jeweiligen Liste über × löschen.');
  return;
 }
 modal?.classList.add('hidden');
 nav.click();
 original=[...document.querySelectorAll('[data-del]')].find(b=>b.dataset.del===id);
 if(original){
  currentId=null;
  original.click(); // Bestehende Sicherheitsabfrage + bestehende Löschroutine
 }else{
  alert('Der Eintrag ist in dieser Liste nicht sichtbar. Bitte über das ×-Symbol in seiner Kategorie löschen.');
 }
},true);
})();
