import paymentRoutes from "./routes/payment.routes";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";


import analyticsRoutes from "./routes/analytics.routes";

import ticketRoutes from "./routes/ticket.routes";

import eventRoutes from "./routes/event.routes";

import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import express from "express";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests, please try again later.",
});

app.use(limiter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eventful API",
      version: "1.0.0",
      description: "API documentation for Eventful Backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api", healthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payment", paymentRoutes);






app.get("/", (req, res) => {
  res.json({ message: "Eventful API running 🚀" });
});

export default app;
