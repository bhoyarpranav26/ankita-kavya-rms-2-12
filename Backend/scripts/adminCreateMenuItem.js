const fetch = require('node-fetch')
require('dotenv').config()

async function main(){
  const loginRes = await fetch('http://localhost:5000/api/auth/login',{
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'admin@kavyaresto.test', password: 'Admin@123' })
  })
  const login = await loginRes.json()
  console.log('login status', loginRes.status, login)
  if(!login.token) return process.exit(1)
  const token = login.token
  const createRes = await fetch('http://localhost:5000/api/menu',{
    method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify({ restaurantId: 'default', name: 'Admin Seed Dish 2', price: 79.5, category: 'Starters', image: '', description: 'Created by script', type: 'veg', spiceLevel: 'mild' })
  })
  const created = await createRes.json()
  console.log('create status', createRes.status, created)
}

main().catch(e=>{console.error(e); process.exit(2)})
