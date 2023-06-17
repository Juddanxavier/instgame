const typeCheck = async (req, res, next, types) => {
    try {
        const { type } = req.user;
        if (type.some(r=> types.includes(r))) {
          return next();
        }
        throw new Error(
          "You don't have the required permissions to complete this action."
        );
      } catch (err) {
        return res.status(403).json({ message: err.message });
      }
};

module.exports = typeCheck;
