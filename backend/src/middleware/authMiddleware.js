import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const secret = process.env.JWT_SECRET || 'blog_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        role: true,
        avatar: true,
        bio: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired.' });
    }
    return res.status(403).json({ success: false, message: 'Invalid token.' });
  }
};
