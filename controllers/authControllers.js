import bcrypt from "bcrypt";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

dotenv.config();
const { BASE_URL } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const verificationToken = nanoid();

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verify: false,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify your email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(401, "Email or password is wrong");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw HttpError(401, "Email or password is wrong");

    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = req.user;

    user.token = null;
    await user.save();

    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "Avatar file is required");

    const { path: tempPath, originalname } = req.file;
    const filename = `${req.user.id}-${Date.now()}-${originalname}`;
    const avatarsDir = path.resolve("public", "avatars");
    const resultPath = path.join(avatarsDir, filename);

    // Move file to /public/avatars
    await fs.rename(tempPath, resultPath);

    const avatarURL = `/avatars/${filename}`;
    req.user.avatarURL = avatarURL;
    await req.user.save();

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ where: { verificationToken } });
    if (!user) throw HttpError(404, "User not found");

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(404, "User not found");

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Resend email verification",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
