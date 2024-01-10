const authMiddleware = (req, res, next) => {
  console.log("Authenticating...");
  next();
};

module.exports = authMiddleware