import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../model/userModel.js';
import transporter from '../config/nodemailer.js';
import { assign } from 'nodemailer/lib/shared/index.js';




export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: 'User Already Exists' })

        }
        const hashedPassword = await bcrypt.hash(password, 11);

        const user = new userModel({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24*60*60*1000
    });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'welcome to arpMedia',
            text: `welcome to arp website . your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'invalid email' })
        }



        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24*60*60*1000
    });
        return res.json({ success: true });



    } catch (error) {
        return res.json({
            success: false, message: error.message
        });
    }

}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        return res.json({
            success: false, message: error.message
        });
    }

}

export const sendVerifyOtp = async (req, res) => {
  try {
    const user = req.user; // ✅ Comes from middleware

    if (user.isAccountVerified) {
      return res.json({ success: false, message: 'Account already verified' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOpt = otp;
    user.verifyOptExprireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      text: `Your OTP is ${otp}.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Verification OTP sent on Email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.json({ success: false, message: 'OTP is required' });
  }

  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (user.verifyOpt === '' || user.verifyOpt !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.verifyOptExprireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP expired' });
    }

    user.isAccountVerified = true;
    user.verifyOpt = '';
    user.verifyOptExprireAt = 0;

    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const isAuthenticated = async (req, res) => {

    try {

        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOptExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for reseting your password is ${otp} . Use this Otp to proceed with resetting your password.`
        };
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Otp sent to your email" });



    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// reset user password

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP and newPassword are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        if (user.resetOptExpireAt < Date.now()) {
            return res.json({ success: false, message: "Otp Expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 11);

        user.password = hashedPassword;

        user.resetOtp = '';

        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully ' })

    } catch (error) {
        return res.json({ success: false, message: error.message })

    }

}
