// middleware/userAuth.js
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user; // ✅ Attach full user
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default userAuth;
