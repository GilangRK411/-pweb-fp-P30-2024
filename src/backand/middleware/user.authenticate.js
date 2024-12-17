import jwt from 'jsonwebtoken';
import UserSession from '../models/user.usersession.model.js';

export async function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'qwwqw1212!@!@'); 

    const session = await UserSession.findOne({
      user_id: decoded.id,
      jwt_token: token,
      login_status: true,
    });

    if (!session) {
      return res.status(401).json({ message: 'Invalid token or session expired' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
