const { test }=require('node:test'); const assert=require('node:assert/strict');
let calls=[], id=0, pushRows=[], subscriptionRows=[];
const db={query:async(sql,args)=>{
  calls.push({sql,args});
  if(sql.includes('WITH due AS'))return {rows:pushRows.length ? [pushRows.shift()] : []};
  if(sql.includes('SELECT s.subscription'))return {rows:subscriptionRows};
  if(sql.includes('SELECT * FROM notification_jobs'))return {rows:[{id:10,kind:'pickup',pick_up_date:'2026-10-03',pick_up_location:'Fort Lee',arrival_at:new Date(Date.now()+15*60000),message:''}]};
  if(sql.includes('SELECT DISTINCT o.username'))return {rows:[{username:'alice'},{username:'bob'}]};
  if(sql.includes('INSERT INTO delivery_notifications'))return {rows:[{id:++id}]};
  return {rows:[]};
},release(){}};
const file=require.resolve('../db/connection'); require.cache[file]={id:file,filename:file,loaded:true,exports:{connect:async()=>db,query:db.query}};
const {dispatchDueJobs,queueEvent,dispatchPush}=require('./notificationQueue');
test('durable dispatch targets exact orders, deduplicates notices and queues device delivery atomically',async()=>{
  await dispatchDueJobs();
  const recipients=calls.find(call=>call.sql.includes('SELECT DISTINCT o.username'));
  assert.deepEqual(recipients.args,['2026-10-03','Fort Lee']); assert.match(recipients.sql,/COALESCE\(p.pickup,TRUE\)/);
  const notices=calls.filter(call=>call.sql.includes('INSERT INTO delivery_notifications'));
  assert.equal(notices.length,2); assert.match(notices[0].args[3],/15 分鐘後到達/);
  assert.match(notices[0].sql,/ON CONFLICT\(job_id,username\) DO NOTHING/);
  assert.equal(calls.filter(call=>call.sql.includes('notification_push_outbox')).length,2);
  assert.equal(calls.at(-1).sql,'COMMIT');
});
test('event queue uses a stable event identity to prevent repeat announcements',async()=>{
  calls=[]; await queueEvent({id:9,pick_up_date:'2026-10-09',pick_up_locations:['Fort Lee']},'admin',db);
  assert.equal(calls[0].args[0],'event:9'); assert.match(calls[0].sql,/ON CONFLICT\(dedupe_key\) DO NOTHING/);
});
test('push rechecks device ownership and opt-outs before sending and removes expired endpoints',async()=>{
  const webpush=require('web-push'); let sends=0;
  process.env.VAPID_PUBLIC_KEY='test';process.env.VAPID_PRIVATE_KEY='test';process.env.VAPID_SUBJECT='https://example.com';
  webpush.setVapidDetails=()=>{};
  webpush.sendNotification=async()=>{sends++;const error=new Error('expired');error.statusCode=410;throw error;};
  calls=[];pushRows=[{notification_id:1,endpoint:'https://push.apple.com/test',payload:{},attempts:1}];subscriptionRows=[];
  await dispatchPush();assert.equal(sends,0);
  const lookup=calls.find(call=>call.sql.includes('SELECT s.subscription'));
  assert.match(lookup.sql,/n.username=s.username/);assert.match(lookup.sql,/p.events ELSE p.pickup/);
  assert.ok(calls.some(call=>call.sql.includes('DELETE FROM notification_push_outbox')));
  calls=[];pushRows=[{notification_id:1,endpoint:'https://push.apple.com/test',payload:{},attempts:1}];subscriptionRows=[{subscription:{endpoint:'https://push.apple.com/test',keys:{}}}];
  await dispatchPush();assert.equal(sends,1);
  assert.ok(calls.some(call=>call.sql.includes('DELETE FROM push_subscriptions')));
});
