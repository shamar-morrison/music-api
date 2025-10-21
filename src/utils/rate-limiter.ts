import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  handler: (_, res) => {
    res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  },
});
