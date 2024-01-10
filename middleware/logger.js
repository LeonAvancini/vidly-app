const logMiddleware = (req, res, next) => {
  console.log("Loggin...");
  next();
};

module.exports = logMiddleware