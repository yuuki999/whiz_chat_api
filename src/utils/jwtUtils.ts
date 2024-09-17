import jwt from 'jsonwebtoken';

const ACCESS_SECRET_KEY = process.env.JWT_SECRET!;
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: any) => {
  return jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET_KEY);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET_KEY);
};
