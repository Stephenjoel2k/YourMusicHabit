const checkToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers.authorization;
  
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Auth token is not supplied",
      });
    }
  
    req.token = token;
    return next();
}
  
  module.exports = {
    checkToken,
  };