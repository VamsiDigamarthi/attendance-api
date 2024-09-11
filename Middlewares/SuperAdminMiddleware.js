export const ensureSuperAdmin = (req, res, next) => {
  const { user } = req;
  if (user.role !== "SuperAdmin") {
    return res.status(403).json({
      message:
        "You can't access this feature because you are not a Super Admin.",
    });
  }
  // If user role is captain, call next() to pass control to the next middleware or route handler
  next();
};
