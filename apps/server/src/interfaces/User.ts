import { Request } from "express";
import { Document } from "mongoose";

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  password: string;
  deletedAt: Date | null;
  verifiedAt: Date | null;
  address: string;
  phone: string;
  gender: string;
  birthDay: Date;
  forgotPasswordTokens: { token: string; createdAt: Date }[];
  confirmEmailTokens: { token: string; createdAt: Date }[];
  refreshTokens: { token: string; createdAt: Date }[];
}

export interface UserDocument extends Document, User {
  prepare: () => Omit<User, "password" | "refreshTokens" | "forgotPasswordTokens" | "confirmEmailTokens">;
  softDelete: () => Promise<User>
}

export interface Auth {
  user: UserDocument;
  token: string;
}

export interface AuthRequest extends Request {
  auth?: Auth;
}
