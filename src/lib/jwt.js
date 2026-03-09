import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_KEY environment variable is not defined");
}

/**
 * Sign JWT
 * @param {object} payload
 * @returns {string} signed token
 * @throws if payload is invalid
 */
export function signJWT(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("JWT payload must be a plain object");
  }
  if (Object.keys(payload).length === 0) {
    throw new TypeError("JWT payload must not be empty");
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT
 * @param {string} token
 * @returns {{ valid: true, payload: object } | { valid: false, reason: string }}
 */
export async function verifyJWT(token) {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "missing_token" };
  }
  if (token.split(".").length !== 3) {
    return { valid: false, reason: "malformed_token" };
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, reason: "token_expired" };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { valid: false, reason: "invalid_token" };
    }
    if (error instanceof jwt.NotBeforeError) {
      return { valid: false, reason: "token_not_active" };
    }
    return { valid: false, reason: "unknown_error" };
  }
}
