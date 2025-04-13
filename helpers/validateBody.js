import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const isEmptyBody = error.details[0]?.type === "object.missing";
      const message = isEmptyBody
        ? "Body must have at least one field"
        : error.message;

      next(HttpError(400, message));
      return;
    }
    next();
  };

  return func;
};

export default validateBody;
