const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
process.env.JWT_SECRET='arrival-isolated-test-secret';
let calls=[], alreadySent=false;
const file=require.resolve('../db/connection');
require.cache[file]={id:file,filename:file,loaded:true,exports:{query:async(sql,args)=>{
  calls.push({sql,args});
  if(sql.includes('admin_config'))return {rows:[{pick_up_locations:['Fort Lee','Livingston']}]};
  if(sql.includes('INSERT INTO notification_jobs'))return {rows:alreadySent?[]:[{id:1}]};
  if(sql.includes('notification_worker_state'))return {rows:[{active:true}]};
  return {rows:[]};
}}};
const app=express(); app.use(express.json()); app.use('/arrival',require('./arrivalSchedules'));
let server,base;
before(async()=>{server=app.listen(0,'127.0.0.1'); await new Promise(resolve=>server.once('listening',resolve)); base=`http://127.0.0.1:${server.address().port}`;});
after(()=>new Promise(resolve=>server.close(resolve)));
const headers=role=>({'Content-Type':'application/json',Authorization:`Bearer ${jwt.sign({username:'admin',role},process.env.JWT_SECRET)}`});
const body={date:'2030-01-04',location:'Fort Lee',arrivalTime:'17:15',leadMinutes:15};
test('only admins can schedule and unavailable locations are rejected before insert',async()=>{
  assert.equal((await fetch(`${base}/arrival`,{method:'POST',headers:headers('user'),body:JSON.stringify(body)})).status,403);
  calls=[];
  assert.equal((await fetch(`${base}/arrival`,{method:'POST',headers:headers('admin'),body:JSON.stringify({...body,location:'Unknown'})})).status,400);
  assert.ok(!calls.some(call=>call.sql.includes('INSERT')));
});
test('saves exact date/location and New York ETA then prevents resend of dispatched job',async()=>{
  calls=[];
  assert.equal((await fetch(`${base}/arrival`,{method:'POST',headers:headers('admin'),body:JSON.stringify(body)})).status,200);
  const insert=calls.find(call=>call.sql.includes('INSERT'));
  assert.deepEqual(insert.args.slice(1,6),['2030-01-04','Fort Lee','2030-01-04T22:15:00.000Z',15,'2030-01-04T22:00:00.000Z']);
  assert.ok(insert.sql.includes("status <> 'sent'"));
  alreadySent=true;
  assert.equal((await fetch(`${base}/arrival`,{method:'POST',headers:headers('admin'),body:JSON.stringify(body)})).status,409);
});
test('date lookup exposes only that event’s locations and worker status',async()=>{
  const response=await fetch(`${base}/arrival?date=2030-01-04`,{headers:headers('admin')});
  const data=await response.json(); assert.deepEqual(data.locations,['Fort Lee','Livingston']); assert.equal(data.workerActive,true);
});
