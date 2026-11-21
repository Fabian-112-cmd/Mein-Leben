/* Mein Alltag V11 – direkter, sicherer Löschaufruf statt Listenumweg. */
(()=>{
  'use strict';
  let currentId = null;
  document.addEventListener('click', (event) => {
    const edit = event.target.closest('[data-edit]');
    if (edit) currentId = edit.dataset.edit;
    if (event.target.closest('[data-quick], #addBtn, #fab')) currentId = null;
  }, true);
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('#modal .privat-delete');
    if (!button) return;
    // Verhindert die fehlerhaften V9-Listener.
    event.preventDefault();
    event.stopImmediatePropagation();
    const title = document.getElementById('modalTitle')?.textContent || '';
    if (!title.startsWith('Bearbeiten:') || !currentId) {
      alert('Bitte den Eintrag erneut über Bearbeiten öffnen.');
      return;
    }
    if (typeof window.meinAlltagRemove !== 'function') {
      alert('Die Löschfunktion ist noch nicht verbunden. Bitte den Schritt in der Anleitung prüfen.');
      return;
    }
    const id = currentId;
    button.disabled = true;
    try {
      // Vorhandene Originalfunktion: bestätigt und löscht inklusive Anhängen.
      await window.meinAlltagRemove(id);
      // Nur schließen, wenn der Eintrag nach dem Löschen nicht mehr sichtbar ist.
      // Die Originalfunktion meldet eventuelle Fehler selbst.
      // Dialog bleibt bei einem Fehler offen, damit nichts verloren geht.
    } catch (error) {
      alert('Löschen fehlgeschlagen: ' + (error?.message || error));
    } finally {
      button.disabled = false;
    }
  }, true);
})();
