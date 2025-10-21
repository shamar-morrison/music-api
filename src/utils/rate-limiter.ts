import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  handler: (_, res) => {
    res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  },
});
