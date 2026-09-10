import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'blog_super_secret_jwt_key_2026';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, department, role, avatar, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        department: department || 'Engineering',
        role: role || 'contributor',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        bio: bio || '',
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        role: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    const token = generateToken(newUser.id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user.id);

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
    };

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};
