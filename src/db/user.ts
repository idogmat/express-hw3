import { ObjectId } from "mongodb";
import mongoose, { Model } from "mongoose";

export type UserTypeDB = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
  recoveryCode?: string;
};

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

// user
const EmailConfirmationSchema = new mongoose.Schema<
  EmailConfirmation,
  Model<EmailConfirmation>
>(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  { _id: false },
);

export const UserSchema = new mongoose.Schema<UserTypeDB, Model<UserTypeDB>>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: false },
  createdAt: { type: String, required: false },
  emailConfirmation: { type: EmailConfirmationSchema, required: false },
  recoveryCode: { type: String, reqired: false },
});
