import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  try {
    // get token from cookie or header
    const authToken =
      req.cookies?.token ||
      (req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1]);

    if (!authToken) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decode = jwt.verify(
      authToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.userInfo = decode;

    console.log(decode);

    next(); // IMPORTANT
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
    });
  }
};