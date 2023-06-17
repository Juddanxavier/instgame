const bcrypt = require("bcryptjs");

const genPassword = async (string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(string, salt);
  return hashedPassword;
};

module.exports = genPassword;
