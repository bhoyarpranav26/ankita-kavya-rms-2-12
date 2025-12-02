const fetch = require('node-fetch')
require('dotenv').config()

async function main(){
  const base = `http://localhost:${process.env.PORT || 5000}`
  // login
  const loginRes = await fetch(base + '/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'admin@kavyaresto.test', password: 'Admin@123' }) })
  const login = await loginRes.json()
  console.log('login', loginRes.status, login.message)
  if(!login.token) return process.exit(1)
  const token = login.token

  // list
  let res = await fetch(base + '/api/menu', { headers: { Authorization: `Bearer ${token}` }})
  console.log('list status', res.status)
  let data = await res.json()
  console.log('items count', (data.items || data).length)

  // create
  res = await fetch(base + '/api/menu', { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ restaurantId: 'default', category: 'Test', name: 'E2E Dish', description: 'created by e2e', price: 55.5, image: '', available: true }) })
  data = await res.json()
  console.log('create', res.status, data)
  const newId = data.item?._id || data._id

  // update
  res = await fetch(base + '/api/menu/' + newId, { method: 'PUT', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ price: 66.6, description: 'updated by e2e' }) })
  data = await res.json()
  console.log('update', res.status, data)

  // delete
  res = await fetch(base + '/api/menu/' + newId, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  data = await res.json()
  console.log('delete', res.status, data)

  process.exit(0)
}

main().catch(e=>{console.error(e); process.exit(2)})
