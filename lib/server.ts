import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../app/chatgpt-auth";
import { emptyState } from "./core.mjs";
export const runtimeEnv = () => env as unknown as {DB:D1Database;BUCKET:R2Bucket};
export async function identity(request:Request) {
 const user=await getChatGPTUser();
 if(!user)throw Object.assign(Error("Bitte mit ChatGPT anmelden."),{status:401});
 if(request.method!=="GET"){
  const origin=request.headers.get("origin");
  if(origin && origin!==new URL(request.url).origin)throw Object.assign(Error("Anfrage von fremder Webseite abgewiesen."),{status:403});
 }
 return user.userId;
}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});}
export function fail(e:any){const message=String(e.message||e);return json({error:message.includes("REVISION_CONFLICT")?"Auf einem anderen Gerät wurden Daten geändert. Bitte aktualisieren und erneut versuchen.":message},message.includes("REVISION_CONFLICT")?409:e.status||400);}
export async function snapshot(owner:string){
 const {DB}=runtimeEnv();
 await DB.prepare("INSERT OR IGNORE INTO workspaces(owner,revision) VALUES (?,0)").bind(owner).run();
 for(let n=0;n<3;n++){
  const first:any=await DB.prepare("SELECT revision FROM workspaces WHERE owner=?").bind(owner).first();
  const rows=await DB.prepare("SELECT kind,data FROM entities WHERE owner=?").bind(owner).all<{kind:string;data:string}>();
  const last:any=await DB.prepare("SELECT revision FROM workspaces WHERE owner=?").bind(owner).first();
  if(first.revision!==last.revision)continue;
  const state:any=emptyState();for(const row of rows.results)state[row.kind]?.push(JSON.parse(row.data));
  return {state,revision:last.revision};
 }
 throw Object.assign(Error("Daten werden gerade synchronisiert. Bitte erneut laden."),{status:409});
}
export function saveEntity(owner:string,kind:string,value:any){return runtimeEnv().DB.prepare("INSERT INTO entities(owner,kind,id,data) VALUES (?,?,?,?) ON CONFLICT(owner,kind,id) DO UPDATE SET data=excluded.data").bind(owner,kind,value.id,JSON.stringify(value));}
export async function digest(bytes:BufferSource){return [...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(b=>b.toString(16).padStart(2,"0")).join("");}

