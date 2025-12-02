const fetch = require('node-fetch');
(async ()=>{
  try{
    const res = await fetch('http://localhost:5000/api/menu');
    console.log('status', res.status);
    const body = await res.text();
    console.log('body', body);
  }catch(err){
    console.error('err', err);
  }
})();
