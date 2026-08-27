// utils/parseExpiry.js
// Converts a jsonwebtoken-style "expiresIn" value (e.g. "7d", "12h", "3600")
// into milliseconds, so it can be reused as a cookie's maxAge.

const UNIT_MS = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  y: 365 * 24 * 60 * 60 * 1000,
};

const DEFAULT_MS = UNIT_MS.d * 7; // fall back to 7 days

const parseExpiryToMs = (expiry) => {
  if (expiry === undefined || expiry === null || expiry === "") {
    return DEFAULT_MS;
  }

  // jsonwebtoken also accepts a plain number of seconds
  if (typeof expiry === "number") {
    return expiry * 1000;
  }

  const match = /^(\d+)\s*(s|m|h|d|w|y)?$/i.exec(String(expiry).trim());
  if (!match) {
    return DEFAULT_MS;
  }

  const value = parseInt(match[1], 10);
  const unit = (match[2] || "s").toLowerCase();

  return value * UNIT_MS[unit];
};

module.exports = parseExpiryToMs;
