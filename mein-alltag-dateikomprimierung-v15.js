/* Mein Alltag V15 – lokale Dateiverkleinerung vor dem bestehenden Upload.
   Keine Änderung an Supabase, bestehenden Einträgen oder Upload-Funktionen. */
(()=>{
'use strict';
const LIMIT=10*1024*1024;
const TARGET=9.5*1024*1024;
const inputs=['newAttachments','vehicleCoverInput'];
let busy=0;
const status=document.createElement('div');
status.id='privat-compress-status';
status.setAttribute('role','status');
status.style.cssText='margin:8px 0;font-size:13px;color:#24573b;line-height:1.4';
const put=(message,error=false)=>{status.textContent=message;status.style.color=error?'#b02b20':'#24573b';};
const mb=n=>(n/1048576).toFixed(1)+' MB';
function attachStatus(){
 const target=document.querySelector('#modal .attach-section');
 if(target&&!status.isConnected)target.appendChild(status);
}
function script(src,check){
 return new Promise((resolve,reject)=>{
  if(check()){resolve();return}
  const el=document.createElement('script');el.src=src;el.async=true;
  el.onload=()=>check()?resolve():reject(Error('Bibliothek nicht verfügbar'));
  el.onerror=()=>reject(Error('Komprimierungsbibliothek konnte nicht geladen werden'));
  document.head.appendChild(el);
 });
}
async function libraries(){
 await script('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',()=>!!window.pdfjsLib);
 await script('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',()=>!!window.jspdf?.jsPDF);
 window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
}
const canvasBlob=(canvas,quality)=>new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
async function compressImage(file){
 const bitmap=await createImageBitmap(file);
 try{
  let scale=Math.min(1,2200/Math.max(bitmap.width,bitmap.height));
  for(let attempt=0;attempt<7;attempt++){
   const c=document.createElement('canvas');
   c.width=Math.max(1,Math.round(bitmap.width*scale));
   c.height=Math.max(1,Math.round(bitmap.height*scale));
   const ctx=c.getContext('2d');
   ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
   ctx.drawImage(bitmap,0,0,c.width,c.height);
   const blob=await canvasBlob(c,Math.max(.43,.82-attempt*.065));
   c.width=c.height=0;
   if(blob&&blob.size<TARGET){
    return new File([blob],file.name.replace(/\.[^.]+$/,'.jpg'),{type:'image/jpeg',lastModified:Date.now()});
   }
   scale*=.78;
  }
  throw Error('Bild konnte nicht ausreichend verkleinert werden');
 }finally{bitmap.close()}
}
async function compressPdf(file){
 // Rasterisierung verändert das Dokument: ausdrücklich zustimmen lassen.
 const yes=confirm('Dieses PDF ist größer als 10 MB.\n\nSoll die App eine verkleinerte Kopie erzeugen? Dabei werden die Seiten als Bilder neu erstellt. Durchsuchbarer Text, Formulare, Links und digitale Signaturen können verloren gehen.\n\nDie Originaldatei auf deinem Gerät bleibt unverändert.');
 if(!yes)throw Error('PDF-Komprimierung abgebrochen');
 await libraries();
 const bytes=new Uint8Array(await file.arrayBuffer());
 const pdf=await window.pdfjsLib.getDocument({data:bytes}).promise;
 try{
  if(pdf.numPages>50)throw Error('PDF hat mehr als 50 Seiten. Bitte extern verkleinern.');
  const {jsPDF}=window.jspdf;
  // Qualitätsstufen; bei Bedarf alle Seiten mit niedrigerer Auflösung neu rendern.
  for(const quality of [{dpi:120,jpeg:.72},{dpi:100,jpeg:.62},{dpi:85,jpeg:.52},{dpi:72,jpeg:.45}]){
   let output=null;
   for(let i=1;i<=pdf.numPages;i++){
    put('PDF wird verkleinert: Seite '+i+' von '+pdf.numPages+' ('+quality.dpi+' dpi) …');
    const page=await pdf.getPage(i);
    const base=page.getViewport({scale:1});
    const viewport=page.getViewport({scale:quality.dpi/72});
    const canvas=document.createElement('canvas');
    canvas.width=Math.ceil(viewport.width);
    canvas.height=Math.ceil(viewport.height);
    if(canvas.width*canvas.height>18000000)throw Error('PDF-Seite zu groß für Browser-Komprimierung');
    const ctx=canvas.getContext('2d',{alpha:false});
    ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
    await page.render({canvasContext:ctx,viewport,background:'#ffffff'}).promise;
    const jpeg=canvas.toDataURL('image/jpeg',quality.jpeg);
    const width=base.width*25.4/72, height=base.height*25.4/72;
    const orientation=width>height?'landscape':'portrait';
    if(!output)output=new jsPDF({orientation,unit:'mm',format:[width,height],compress:true});
    else output.addPage([width,height],orientation);
    output.addImage(jpeg,'JPEG',0,0,width,height,undefined,'FAST');
    canvas.width=canvas.height=0;
    if(i%3===0)await new Promise(r=>setTimeout(r,0));
   }
   const blob=output.output('blob');
   if(blob.size<TARGET){
    return new File([blob],file.name,{type:'application/pdf',lastModified:Date.now()});
   }
  }
  throw Error('PDF bleibt auch nach der Verkleinerung über 10 MB');
 }finally{await pdf.destroy()}
}
function setFiles(input,files){
 const dt=new DataTransfer();
 files.forEach(f=>dt.items.add(f));
 input.files=dt.files;
 // Andere UI-Listener (z.B. V14) über die aktualisierte Dateigröße informieren.
 input.dispatchEvent(new Event('change',{bubbles:true}));
}
const processing=new WeakSet();
async function onChange(event){
 const input=event.target;
 if(!inputs.includes(input.id)||processing.has(input))return;
 const original=Array.from(input.files||[]);
 if(!original.some(f=>f.size>LIMIT))return;
 attachStatus();busy++;processing.add(input);
 try{
  const next=[];
  for(const file of original){
   if(file.size<=LIMIT){next.push(file);continue}
   put('Datei '+file.name+' ('+mb(file.size)+') wird geprüft …');
   let reduced;
   if(file.type==='application/pdf'||/\.pdf$/i.test(file.name))reduced=await compressPdf(file);
   else if(file.type.startsWith('image/'))reduced=await compressImage(file);
   else throw Error('Dateityp nicht komprimierbar: '+file.name);
   next.push(reduced);
   put(file.name+': '+mb(file.size)+' → '+mb(reduced.size)+' · Bereit zum Speichern');
  }
  setFiles(input,next);
 }catch(err){
  // Originaldateien beibehalten. Vor Upload wird wegen 10 MB abgebrochen.
  put((err?.message||String(err))+' · Die Originaldatei bleibt unverändert.',true);
 }finally{processing.delete(input);busy--}
}
document.addEventListener('change',onChange,true);
document.addEventListener('submit',e=>{
 if(e.target.id==='entryForm'&&busy){
  e.preventDefault();e.stopImmediatePropagation();
  put('Bitte warten, bis die Dateiverkleinerung abgeschlossen ist.',true);
 }
},true);
document.addEventListener('click',e=>{
 if(!busy||!e.target.closest('#entryForm button[type="submit"]'))return;
 e.preventDefault();e.stopImmediatePropagation();
 put('Datei wird noch verarbeitet. Bitte warten.',true);
},true);
const modal=document.getElementById('modal');
if(modal)new MutationObserver(attachStatus).observe(modal,{attributes:true,attributeFilter:['class']});
attachStatus();
})();
