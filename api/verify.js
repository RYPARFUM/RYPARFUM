module.exports=async function(req,res){
  if(req.method!=='POST'){res.status(405).json({ok:false});return}
  try{
    let b=req.body; if(typeof b==='string') b=JSON.parse(b||'{}');
    const token=b&&b.token, secret=process.env.TURNSTILE_SECRET_KEY;
    if(!token||!secret){res.status(400).json({ok:false});return}
    const f=new URLSearchParams({secret:secret,response:token});
    const ip=String(req.headers['x-forwarded-for']||'').split(',')[0].trim(); if(ip)f.append('remoteip',ip);
    const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:f});
    const j=await r.json(); res.status(200).json({ok:!!j.success});
  }catch(e){res.status(500).json({ok:false})}
};
