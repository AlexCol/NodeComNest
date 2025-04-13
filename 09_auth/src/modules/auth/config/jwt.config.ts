import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_TOKEN_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRATION) || 3600,
  };
})
