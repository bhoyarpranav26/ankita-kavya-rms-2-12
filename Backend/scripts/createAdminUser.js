/**
 * Usage: node scripts/createAdminUser.js email name password phone
 * Example: node scripts/createAdminUser.js admin@local admin Admin@123 9999999999
 */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const User = require('../models/User')

async function main(){
  const [,, email, name = 'Admin', password = 'Admin@123', phone = '9999999999'] = process.argv
  if(!email){
    console.error('Usage: node scripts/createAdminUser.js email name password phone')
    process.exit(1)
  }
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kavyaresto'
  await mongoose.connect(mongoUri)
  const existing = await User.findOne({ email })
  if(existing){
    console.log('User already exists, updating role to admin')
    existing.role = 'admin'
    await existing.save()
    console.log('Updated existing user to admin:', existing.email)
    process.exit(0)
  }
  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ name, email, phone, password: hashed, verified: true, role: 'admin' })
  await user.save()
  console.log('Created admin user:', email)
  await mongoose.disconnect()
  process.exit(0)
}

main().catch(err=>{console.error(err); process.exit(2)})
