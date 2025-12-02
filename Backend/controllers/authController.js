// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
let sendgrid;
try { sendgrid = require('@sendgrid/mail'); } catch (e) { sendgrid = null }

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

let transporter = null;
if (process.env.SENDGRID_API_KEY && sendgrid) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  transporter = {
    sendMail: async (mailOptions) => {
      const msg = {
        to: mailOptions.to,
        from: mailOptions.from || (process.env.EMAIL_FROM || 'no-reply@kavyaresto.com'),
        subject: mailOptions.subject,
        text: mailOptions.text,
      };
      return sendgrid.send(msg);
    }
  }
} else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Fallback transporter that logs the message to console (useful in dev)
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('--- Mock sendMail called ---')
      console.log(mailOptions)
      return Promise.resolve()
    }
  }
}

// SIGNUP: save user (unverified) and send OTP by email
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check existing
    let existing = await User.findOne({ email });
    if (existing && existing.verified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    let user;
    if (existing) {
      user = await User.findOneAndUpdate({ email }, {
        name, phone, password: hashed, otp, otpExpires: otpExpiry, verified: false
      }, { new: true });
    } else {
      user = new User({ name, email, phone, password: hashed, otp, otpExpires: otpExpiry });
      await user.save();
    }

    // send email using helper
    const sendResult = await sendOtpEmail(name, email, otp)
    if (!sendResult.ok) {
      console.error('Failed to send OTP email during signup (OTP stored in DB):', sendResult.error)
    }

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Signup error:", err);
    // handle validation error (like phone required)
    return res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// helper: send OTP email (reusable)
async function sendOtpEmail(name, email, otp) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'no-reply@kavyaresto.local',
      to: email,
      subject: 'Your OTP from KavyaServe',
      text: `Hello ${name},\n\nYour OTP is ${otp}. It expires in 10 minutes.\n\nIf you didn't request this, ignore this mail.`,
    })
    return { ok: true }
  } catch (err) {
    console.error('sendOtpEmail error:', err)
    return { ok: false, error: err }
  }
}

// RESEND OTP: generate new OTP and email it
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    // generate new OTP if expired or missing
    const now = Date.now()
    let otp = user.otp
    if (!otp || !user.otpExpires || now > user.otpExpires) {
      otp = generateOTP()
      user.otp = otp
      user.otpExpires = now + 10 * 60 * 1000
      user.verified = false
      await user.save()
    }

    const result = await sendOtpEmail(user.name || 'User', email, otp)
    if (!result.ok) return res.status(500).json({ message: 'Failed to send OTP email' })
    return res.status(200).json({ message: 'OTP resent' })
  } catch (err) {
    console.error('Resend OTP error:', err)
    return res.status(500).json({ message: 'Resend OTP failed' })
  }
}

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verified) return res.status(400).json({ message: "User already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Account verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.verified) return res.status(403).json({ message: "Email not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

// PROFILE (protected) - small helper for route usage
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId; // from middleware
    const user = await User.findById(userId).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error("GetProfile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
