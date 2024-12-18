import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserSession from '../models/user.usersession.model.js';

dotenv.config();

export async function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const session = await UserSession.findOne({
      user_id: decoded.id,
      jwt_token: token,
      login_status: true,
    });

    if (!session) {
      return res.status(401).json({ message: 'Invalid token or session expired' });
    }
    if (new Date() > session.expires_at) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}