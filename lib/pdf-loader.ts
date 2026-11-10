let pending:Promise<any>|null=null;
export function loadPDF():Promise<any>{
 const w=window as any;
 if(w.LernraumPDF)return Promise.resolve(w.LernraumPDF);
 if(pending)return pending;
 pending=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.type='module';script.src='/pdf/load.mjs';
  script.onload=()=>w.LernraumPDF?resolve(w.LernraumPDF):reject(Error('PDF-Verarbeitung konnte nicht geladen werden.'));
  script.onerror=()=>{script.remove();pending=null;reject(Error('PDF-Verarbeitung konnte nicht geladen werden. Bitte Verbindung prüfen oder Text einfügen.'));};
  document.head.appendChild(script);
 });return pending;
}
