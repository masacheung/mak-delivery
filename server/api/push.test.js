const {test}=require('node:test'); const assert=require('node:assert/strict');
const {validSubscription}=require('./push');
const keys={p256dh:Buffer.alloc(65).toString('base64url'),auth:Buffer.alloc(16).toString('base64url')};
test('subscription endpoints must be a known HTTPS push provider with correctly sized keys',()=>{
  assert.equal(validSubscription({endpoint:'https://fcm.googleapis.com/fcm/send/example',keys}),true);
  for(const endpoint of ['http://fcm.googleapis.com/test','https://127.0.0.1/test','https://metadata.example/test','https://push.apple.com.evil.test/test','https://user:pass@push.apple.com/test','https://push.apple.com:8443/test'])assert.equal(validSubscription({endpoint,keys}),false);
  assert.equal(validSubscription({endpoint:'https://push.apple.com/test',keys:{...keys,auth:'short'}}),false);
});
