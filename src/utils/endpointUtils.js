export const CLAW_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://www.clawlaw.in/"
    : "http://localhost:4000/";

export const CLAW_PRICING_ENDPOINT =
  process.env.NODE_ENV === "production"
    ? "https://www.clawlaw.in/pricing"
    : "http://localhost:4000/pricing";
