/* Mein Alltag: Bearbeiten-Dialoge V7. Keine Aenderung an Datenlogik. */
(function () {
  'use strict';
  const modal = document.getElementById('modal');
  const dialog = modal && modal.querySelector('.dialog');
  const form = dialog && dialog.querySelector('#entryForm');
  const actions = form && form.querySelector('.dialogfoot');
  if (!modal || !dialog || !form || !actions) return;

  // Submit-Button funktioniert auch ausserhalb des Formulars.
  const save = actions.querySelector('button[type="submit"]');
  if (save) save.setAttribute('form', 'entryForm');
  dialog.appendChild(actions);

  const style = document.createElement('style');
  style.id = 'mein-alltag-formulare-v7';
  style.textContent = `
  @media (max-width: 850px) {
    #modal.modal:not(.hidden) {
      position: fixed !important; inset: 0 !important;
      z-index: 1000 !important; display: flex !important;
      align-items: stretch !important; justify-content: center !important;
      overflow: hidden !important;
      padding: calc(9px + env(safe-area-inset-top)) 10px calc(9px + env(safe-area-inset-bottom)) !important;
    }
    #modal > .dialog {
      width: 100% !important; max-width: 620px !important;
      height: 100% !important; max-height: 100% !important;
      min-height: 0 !important; overflow: hidden !important;
      display: flex !important; flex-direction: column !important;
      padding: 18px 15px 0 !important; border-radius: 19px !important;
      background: #fff !important;
    }
    #modal > .dialog > h2 {
      flex: 0 0 auto !important; font-size: 21px !important;
      line-height: 1.25 !important; margin: 0 0 13px !important;
      padding: 0 2px 13px !important;
      border-bottom: 1px solid #e4ece5 !important;
    }
    #modal #entryForm {
      display: block !important; flex: 1 1 auto !important;
      min-height: 0 !important; overflow-y: auto !important;
      overflow-x: hidden !important; overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      padding: 2px 3px 18px !important;
    }
    #modal #entryFields {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) !important;
      gap: 13px !important;
    }
    #modal #entryFields label { min-width: 0 !important; }
    #modal #entryFields input,
    #modal #entryFields select,
    #modal #entryFields textarea {
      width: 100% !important; max-width: 100% !important;
      font-size: 16px !important;
    }
    #modal > .dialog > .dialogfoot {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
      gap: 10px !important; flex: 0 0 auto !important;
      margin: 0 -15px !important; padding: 12px 15px 13px !important;
      background: #fff !important; border-top: 1px solid #dce8de !important;
      box-shadow: 0 -6px 16px #143c2010 !important; z-index: 3 !important;
    }
    #modal > .dialog > .dialogfoot button {
      width: 100% !important; min-width: 0 !important;
      min-height: 46px !important; font-size: 15px !important;
      border-radius: 12px !important;
    }
    body.privat-entry-open .bottom,
    body.privat-entry-open #fab {
      visibility: hidden !important; pointer-events: none !important;
    }
  }
  `;
  document.head.appendChild(style);

  const sync = () => {
    document.body.classList.toggle('privat-entry-open', !modal.classList.contains('hidden'));
  };
  new MutationObserver(sync).observe(modal, {
    attributes: true, attributeFilter: ['class']
  });
  sync();
})();
