import { PrismaClient, User } from '@prisma/client';
import { generateToken } from '../../utils/jwtUtils';
import * as bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BadRequestException } from '../../exception/BadRequestException';
import { AuthenticationException } from '../../exception/AuthenticationException';
import { ResourceNotFoundException } from '../../exception/ResourceNotFoundException';
import { AuthResponse  } from '../../types/auth';

const prisma = new PrismaClient();

export class ConsumerAuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcryptjs.compare(password, user.passwordHash))) {
      throw new AuthenticationException('無効なメールアドレスまたはパスワードです');
    }
    const token = generateToken({ userId: user.id });
    return {
      token,
      user: user
    };
  }

  async register(userData: { email: string; password: string; name: string }): Promise<AuthResponse> {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
      if (existingUser) {
        throw new BadRequestException('ユーザーが既に存在します');
      }
      const hashedPassword = await bcryptjs.hash(userData.password, 10);
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          name: userData.name,
          userId: `user_${Date.now()}`,
        }
      });
      const token = generateToken({ userId: newUser.id });
      return {
        token,
        user: newUser
      };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(getErrorMessage(error));
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new ResourceNotFoundException('ユーザーが見つかりません');
      }
      const newToken = generateToken({ userId: user.id });
      return {
        token: newToken,
        user: user
      };
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      throw new AuthenticationException('無効なリフレッシュトークンです');
    }
  }
}
