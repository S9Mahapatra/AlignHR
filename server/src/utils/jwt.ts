import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  userId: string;
  role: string;
  employeeId?: string;
}

/**
 * Sign a JWT with the application secret.
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as string,
  });
};

/**
 * Verify and decode a JWT. Throws if the token is invalid or expired.
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};
