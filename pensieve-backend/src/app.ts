import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from 'express-rate-limit'
import { sequelize } from "./database.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import userRouter from "./routers/userRouter.js";
import spaceRouter from "./routers/spaceRouter.js";
import memoryRouter from "./routers/memoryRouter.js";
import photosRouter from "./routers/photosRouter.js";

import User from "./models/user.js";
import Space from "./models/space.js";
import Memory from "./models/memory.js";

const isProduction = process.env.NODE_ENV === "production";
const apisPath = isProduction ? "./dist/routers/*.js" : "./src/routers/*.js";

User.belongsToMany(Space, { through: "userSpaces" });
Space.belongsToMany(User, { through: "userSpaces" });
Memory.belongsTo(Space, { foreignKey: "spaceId" });
Space.hasMany(Memory, { foreignKey: "spaceId" });

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Pensieve API",
      version: "1.0.0",
    },
  },
  apis: [apisPath],
});

const SERVER_PORT = process.env.SERVER_PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Слишком много запросов, попробуйте позже" },
});

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  helmet({
    xPoweredBy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);
app.use("/api/refresh", authLimiter);
app.use("/api", [userRouter, spaceRouter, memoryRouter, photosRouter]);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startApp() {
  try {
    sequelize.sync().then(() => {
      app.listen(SERVER_PORT, () => {
        console.log(`Сервер запущен на http://localhost:${SERVER_PORT}`);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

startApp();
