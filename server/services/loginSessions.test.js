const { test }=require('node:test'); const assert=require('node:assert/strict'); const jwt=require('jsonwebtoken');
let calls=[],saved=[]; const user={id:1,username:'alice',password_hash:'hashed-password',is_verified:true,role:'user'};
const file=require.resolve('../db/connection'); require.cache[file]={id:file,filename:file,loaded:true,exports:{query:async(sql,args)=>{calls.push({sql,args});return {rows:saved};}}};
const {createSession,sessionUser,accessToken,sameOrigin}=require('./loginSessions');
process.env.JWT_SECRET='session-isolated-test-secret';
test('remembered login stores a hash, uses HttpOnly cookie and leaves access token at 24h',async()=>{
  let cookie; const req={headers:{}}; const res={clearCookie(){},cookie(name,value,options){cookie={name,value,options};}};
  await createSession(user,req,res);
  const insert=calls.find(call=>call.sql.includes('INSERT'));
  assert.notEqual(insert.args[0],cookie.value); assert.equal(cookie.options.httpOnly,true); assert.equal(cookie.options.sameSite,'strict'); assert.equal(cookie.options.maxAge,30*86400000);
  saved=[{username:user.username,password_version:insert.args[2]}];
  assert.equal((await sessionUser({headers:{cookie:`makSession=${cookie.value}`}},async()=>user)).username,'alice');
  assert.equal(await sessionUser({headers:{cookie:`makSession=${cookie.value}`}},async()=>({...user,password_hash:'changed-password'})),null);
  const payload=jwt.verify(accessToken(user),process.env.JWT_SECRET); assert.equal(payload.exp-payload.iat,86400);
});
test('refresh rejects cross-origin requests',()=>{
  assert.equal(sameOrigin({headers:{origin:'https://evil.test'},get:()=> 'mak-delivery.onrender.com'}),false);
});
