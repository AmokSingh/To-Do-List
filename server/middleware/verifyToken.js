import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "fallback_dev_secret_12345";

console.log("🔐 Verify JWT_SECRET:", JWT_SECRET.substring(0, 10) + "..."); // Debug

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("📨 Auth Header:", authHeader); // Debug

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided"); // Debug
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 Token received:", token.substring(0, 20) + "..."); // Debug

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified for user:", decoded.id); // Debug
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message); // Debug
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }
    return res.status(403).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export default verifyToken;
