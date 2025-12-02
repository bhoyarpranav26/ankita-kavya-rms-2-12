const fetch = require('node-fetch');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const API = `http://localhost:${process.env.PORT || 5000}`;

async function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }

async function run(){
  console.log('Connecting to Mongo...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  const testUser = {
    name: 'Test User',
    email: 'testuser+copilot@example.com',
    phone: '9876543210',
    password: 'Test@1234'
  };

  console.log('Calling signup...');
  let res = await fetch(`${API}/api/auth/signup`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(testUser)});
  let data = await res.json();
  console.log('Signup response:', res.status, data);

  console.log('Waiting 1s for DB write...');
  await sleep(1000);

  const user = await User.findOne({ email: testUser.email });
  if(!user){
    console.error('User not found in DB after signup');
    process.exit(1);
  }
  console.log('User in DB:', { email: user.email, verified: user.verified, otp: user.otp, otpExpires: user.otpExpires });

  console.log('Calling verify-otp with OTP:', user.otp);
  res = await fetch(`${API}/api/auth/verify-otp`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: testUser.email, otp: user.otp })});
  data = await res.json();
  console.log('Verify response:', res.status, data);

  console.log('Calling login...');
  res = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: testUser.email, password: testUser.password })});
  data = await res.json();
  console.log('Login response:', res.status, data);

  if(data.token){
    console.log('Calling profile with token...');
    res = await fetch(`${API}/api/auth/profile`, { headers: { Authorization: `Bearer ${data.token}` }});
    const profile = await res.json();
    console.log('Profile response:', res.status, profile);
  }

  // cleanup: delete test user
  await User.deleteOne({ email: testUser.email });
  console.log('Cleaned up test user and exiting.');
  process.exit(0);
}

run().catch(err=>{ console.error(err); process.exit(1); });
