import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST;

export const sequelize = new Sequelize(DB_HOST, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};
