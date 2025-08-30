import user from "../models/user.js";
export const verifyRole = (requiredRole) => {
  return async (req, res, next) => {
      const requiredUser = await user.findById(req.user._id);
      console.log("Verifying role for user:", requiredUser.role);
    if (requiredUser && requiredUser.role !== requiredRole) {
      return res.status(403).json({ error: `Access denied. Only ${requiredRole}s allowed.` });
    }
    next();
  };
};
