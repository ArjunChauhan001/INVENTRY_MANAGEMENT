const roleAuthorization = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: 'Forbidden: Access is denied' });
      }
      next();
    };
  };

module.exports = { roleAuthorization };
  