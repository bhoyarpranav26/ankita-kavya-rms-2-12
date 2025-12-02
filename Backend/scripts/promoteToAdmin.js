/**
 * Usage: node scripts/promoteToAdmin.js someone@example.com
 * Promotes the given user's role to 'admin'.
 */
const mongoose = require('mongoose')
require('dotenv').config()
const User = require('../models/User')

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Please provide an email: node scripts/promoteToAdmin.js user@example.com')
    process.exit(1)
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kavyaresto'
  console.log('Connecting to', mongoUri)
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

  const user = await User.findOne({ email })
  if (!user) {
    console.error('User not found for email:', email)
    process.exit(2)
  }

  user.role = 'admin'
  await user.save()
  console.log('User promoted to admin:', user.email, user._id)
  await mongoose.disconnect()
  process.exit(0)
}

main().catch(err => {
  console.error(err)
  process.exit(99)
})
