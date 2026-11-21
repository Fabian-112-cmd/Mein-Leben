/* V8: Repair V7 footer relocation without touching existing save/delete logic. */
(function(){
 'use strict';
 const modal=document.getElementById('modal');
 const dialog=modal?.querySelector('.dialog');
 const form=dialog?.querySelector('#entryForm');
 const fields=form?.querySelector('#entryFields');
 const attachments=form?.querySelector('.attach-section');
 const footer=dialog?.querySelector('.dialogfoot');
 if(!modal||!dialog||!form||!fields||!attachments||!footer)return;
 // V7 placed the buttons outside the form. Return them to the form so the
 // original submit handler can find its button and save successfully.
 const scroller=document.createElement('div');
 scroller.className='privat-v8-form-scroll';
 form.insertBefore(scroller,fields);
 scroller.appendChild(fields);
 scroller.appendChild(attachments);
 form.appendChild(footer);
 // Undo V7's external form association; normal submit semantics apply.
 const save=footer.querySelector('button[type="submit"]');
 if(save)save.removeAttribute('form');
 const style=document.createElement('style');
 style.id='privat-v8-styles';
 style.textContent=`
 @media(max-width:850px){
  #modal.modal:not(.hidden){z-index:1000!important;inset:0!important;display:flex!important;align-items:stretch!important;justify-content:center!important;overflow:hidden!important;padding:calc(9px + env(safe-area-inset-top)) 10px calc(9px + env(safe-area-inset-bottom))!important}
  #modal>.dialog{width:100%!important;max-width:620px!important;height:100%!important;max-height:100%!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;padding:18px 15px 0!important;border-radius:19px!important}
  #modal>.dialog>h2{flex:0 0 auto!important;font-size:21px!important;line-height:1.25!important;margin:0 0 12px!important;padding-bottom:12px!important;border-bottom:1px solid #e1e9e1!important}
  #modal #entryForm{display:flex!important;flex-direction:column!important;flex:1 1 auto!important;min-height:0!important;overflow:hidden!important;padding:0!important}
  #modal .privat-v8-form-scroll{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:3px 3px 18px!important}
  #modal #entryFields{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:13px!important}
  #modal #entryFields input,#modal #entryFields select,#modal #entryFields textarea{max-width:100%!important;width:100%!important;font-size:16px!important}
  #modal #entryForm>.dialogfoot{position:static!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;flex:0 0 auto!important;gap:10px!important;margin:0 -15px!important;padding:12px 15px 13px!important;background:white!important;border-top:1px solid #dce8de!important;box-shadow:0 -6px 16px #143c2010!important;z-index:3!important}
  #modal #entryForm>.dialogfoot button{width:100%!important;min-height:46px!important;min-width:0!important;font-size:15px!important;border-radius:12px!important}
  body.privat-entry-open .bottom,body.privat-entry-open #fab{visibility:hidden!important;pointer-events:none!important}
 }
 `;
 document.head.appendChild(style);
})();
