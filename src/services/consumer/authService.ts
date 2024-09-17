import { PrismaClient, User } from '@prisma/client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwtUtils';
import * as bcryptjs from 'bcryptjs';
import { BadRequestException } from '../../exception/BadRequestException';
import { AuthenticationException } from '../../exception/AuthenticationException';
import { ResourceNotFoundException } from '../../exception/ResourceNotFoundException';
import { AuthResponse } from '../../types/auth';
import { getErrorMessage } from '../../utils/getErrorMessage';

const prisma = new PrismaClient();

export class ConsumerAuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcryptjs.compare(password, user.passwordHash))) {
      throw new AuthenticationException('無効なメールアドレスまたはパスワードです');
    }
    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });
    return {
      accessToken,
      refreshToken,
      user
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
      const accessToken = generateAccessToken({ userId: newUser.id });
      const refreshToken = generateRefreshToken({ userId: newUser.id });
      return {
        accessToken,
        refreshToken,
        user: newUser
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new AuthenticationException(getErrorMessage(error));
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      console.log(refreshToken)
      const decoded = verifyRefreshToken(refreshToken) as { userId: number };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new ResourceNotFoundException('ユーザーが見つかりません');
      }
      const newAccessToken = generateAccessToken({ userId: user.id });
      const newRefreshToken = generateRefreshToken({ userId: user.id });
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user
      };
    } catch (error) {
      if (error instanceof ResourceNotFoundException) {
        throw error;
      }
      throw new AuthenticationException(getErrorMessage(error));
    }
  }
}
