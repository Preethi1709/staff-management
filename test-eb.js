'use strict';
const fs=require('fs'),os=require('os'),path=require('path'),{spawn}=require('child_process'),assert=require('assert/strict');
async function main(){const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'nunes-eb-'));fs.copyFileSync(path.join(__dirname,'server.js'),path.join(tmp,'server.js'));fs.cpSync(path.join(__dirname,'public'),path.join(tmp,'public'),{recursive:true});const port=51000+Math.floor(Math.random()*8000),host=`http://127.0.0.1:${port}`;const server=spawn(process.execPath,[path.join(tmp,'server.js')],{env:{...process.env,PORT:String(port)},cwd:tmp});let cookie='';
async function req(route,method='GET',body){const r=await fetch(host+route,{method,headers:{...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const ct=r.headers.get('content-type')||'';return {status:r.status,data:ct.includes('application/json')?await r.json():ct.includes('application/pdf')?Buffer.from(await r.arrayBuffer()):await r.text()};}
try {for(let i=0;i<60;i++){try{if((await req('/api/health')).status===200)break}catch{}await new Promise(r=>setTimeout(r,75));}
assert.equal((await req('/api/eb/bills')).status,401);assert.equal((await req('/api/setup','POST',{password:'SafePassword1234!'})).status,200);
const entry={location:'NUNES Coimbatore',serviceNumber:'TEST-001',consumerName:'NUNES Instruments',meterNumber:'M-123',connectionType:'Commercial',billMonth:'2026-11',previousReading:'1000',currentReading:'1250',units:'',amount:'3500.50',dueDate:'2026-11-25',paymentDate:'',paymentMethod:'',status:'Pending',transactionId:'',notes:'test'};
let r=await req('/api/eb/bills','POST',entry);assert.equal(r.status,201,JSON.stringify(r.data));const id=r.data.item.id;
assert.equal((await req('/api/eb/bills','POST',entry)).status,400);
assert.equal((await req('/api/eb/summary')).data.pending,1);assert.equal((await req('/api/eb/summary')).data.currentMonthTotal,3500.5);
assert.equal((await req('/api/eb/bills')).data.items[0].units,'250');
let file=Buffer.from('%PDF-1.4\n1 0 obj\nendobj\n%%EOF');r=await req('/api/eb/attachment/'+id,'POST',{name:'bill.pdf',mime:'application/pdf',base64:file.toString('base64')});assert.equal(r.status,200,JSON.stringify(r.data));
assert.deepEqual((await req('/api/eb/attachment/'+id)).data,file);
assert.equal((await req('/api/eb/bills')).data.items[0].hasAttachment,true);
entry.status='Paid';entry.paymentDate='2026-11-20';entry.paymentMethod='UPI';assert.equal((await req('/api/eb/bills/'+id,'PUT',entry)).status,200);
assert.equal((await req('/api/eb/summary')).data.pending,0);
assert.match((await req('/api/export?type=eb')).data,/TEST-001/);
const backup=(await req('/api/backup')).data;assert.equal(backup.ebBills.length,1);assert.ok(backup.ebBills[0].attachment.base64);
assert.equal((await req('/api/eb/bills/'+id,'DELETE')).status,200);
assert.equal((await req('/api/eb/summary')).data.bills,0);
assert.equal((await req('/api/restore','POST',backup)).status,200);assert.equal((await req('/api/eb/summary')).data.bills,1);
assert.deepEqual((await req('/api/eb/attachment/'+id)).data,file);
assert.equal((await req('/api/logout','POST')).status,200);assert.equal((await req('/api/eb/bills')).status,401);
console.log('PASS EB: authentication, add/edit/delete, duplicate prevention, readings, payment statuses, summaries, PDF upload/download, CSV, backup/restore');
}finally{server.kill();fs.rmSync(tmp,{recursive:true,force:true});}}
main().catch(e=>{console.error(e);process.exitCode=1});
