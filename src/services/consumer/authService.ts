import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../utils/jwtUtils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  }
}

export class ConsumerAuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid email or password');
    }
    const token = generateToken({ userId: user.id });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async register(userData: { email: string; password: string; name: string }): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: hashedPassword,
        name: userData.name,
        userId: `user_${Date.now()}`, // 一意のuserIdを生成
      }
    });
    const token = generateToken({ userId: newUser.id });
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      const newToken = generateToken({ userId: user.id });
      return {
        token: newToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
