import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import HttpError from "../helpers/HttpError.js";

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer" || !token) {
      throw HttpError(401, "Not authorized");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(id);

    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export default auth;
