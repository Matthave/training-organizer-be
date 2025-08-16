const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      const error = new Error("Brak tokenu autoryzacji.");
      error.statusCode = 401;
      throw error;
    }

    const decodedToken = jwt.verify(token, process.env.secretJWT);
    if (!decodedToken) {
      const error = new Error("Nieprawidłowy token.");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
      err.message = "Autoryzacja nieudana.";
    }
    next(err);
  }
};
