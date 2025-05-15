import express from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  registerSchema,
  loginSchema,
  resendVerificationSchema,
} from "../schemas/authSchemas.js";
import auth from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import {
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, getCurrent);
authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post(
  "/verify",
  validateBody(resendVerificationSchema),
  resendVerificationEmail
);

export default authRouter;
