import { identity,runtimeEnv,json,fail,digest } from "../../../lib/server";
export async function GET(request:Request){try{
 const owner=await identity(request),hash=new URL(request.url).searchParams.get("hash");
 if(!hash||!/^[a-f0-9]{64}$/.test(hash))throw Error("Ungültiger Dateiverweis.");
 const obj=await runtimeEnv().BUCKET.get(owner+"/"+hash);
 if(!obj)return json({error:"Originaldatei nicht gefunden."},404);
 return new Response(obj.body,{headers:{"Content-Type":obj.customMetadata?.type||"application/octet-stream","Content-Disposition":"inline","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}catch(e){return fail(e);}}
export async function POST(request:Request){try{
 const owner=await identity(request);
 if(Number(request.headers.get("content-length"))>12*1024*1024)throw Error("Datei zu groß. Maximal 8 MB.");
 const data=await request.formData(),file=data.get("file");
 if(!(file instanceof File)||file.size>8*1024*1024||file.size===0)throw Error("Bitte eine Datei mit maximal 8 MB auswählen.");
 const bytes=await file.arrayBuffer();
 const type=file.type==="application/pdf"?"application/pdf":"text/plain";
 if(type==="application/pdf"&&new TextDecoder().decode(bytes.slice(0,5))!=="%PDF-")throw Error("Die Datei ist kein lesbares PDF.");
 const hash=await digest(bytes),key=owner+"/"+hash;
 if(!await runtimeEnv().BUCKET.head(key))await runtimeEnv().BUCKET.put(key,bytes,{customMetadata:{type,name:file.name.slice(0,160)}});
 return json({hash,size:file.size,type,name:file.name});
}catch(e){return fail(e);}}

