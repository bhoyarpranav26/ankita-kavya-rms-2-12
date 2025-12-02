require('dotenv').config();
const fetch = require('node-fetch');
(async ()=>{
  try{
    const API = 'http://localhost:5000';
    // create a test user via signup -> verify -> login (reuse tmp_test_flow logic)
    const testUser = { name: 'Order Test', email: 'ordertest+copilot@example.com', phone: '9876501234', password: 'Test@1234' };
  await fetch(`${API}/api/auth/signup`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(testUser)});
    await new Promise(r=>setTimeout(r,1000));
    // read OTP from DB
    const mongoose = require('mongoose');
    const User = require('./models/User');
  await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: testUser.email });
    if(!user) throw new Error('User not found');
    await fetch(`${API}/api/auth/verify-otp`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: testUser.email, otp: user.otp })});
    const loginRes = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: testUser.email, password: testUser.password })});
    const loginData = await loginRes.json();
    console.log('login', loginData);
    const token = loginData.token;
    // create order
    const order = { restaurantId: 'default', items: [{ name: 'Paneer Tikka', price: 220, quantity: 1, subtotal: 220 }], total: 220 };
    const orderRes = await fetch(`${API}/api/orders`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(order)});
    console.log('order status', orderRes.status, await orderRes.json());
    // cleanup
    const Order = require('./models/Order');
    await Order.deleteMany({ restaurantId: 'default' });
    await User.deleteOne({ email: testUser.email });
    process.exit(0);
  }catch(err){ console.error(err); process.exit(1); }
})();
