import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      message: "Token manquant ou invalide",
      code: "MISSING_TOKEN",
      redirectTo: "/login"
    });
  }

  const token = authHeader.split(" ")[1];

  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    req.user = { id: decoded.id }; 
    next();
  } catch (err) {
    let errorCode = "INVALID_TOKEN";
    let message = "Token invalide";
    
    if (err.name === "TokenExpiredError") {
      errorCode = "TOKEN_EXPIRED";
      message = "Token expiré";
    } else if (err.name === "JsonWebTokenError") {
      errorCode = "MALFORMED_TOKEN";
      message = "Token malformé";
    }
    
    return res.status(401).json({ 
      message,
      code: errorCode,
      redirectTo: "/login"
    });
  }
};



export default authMiddleware 