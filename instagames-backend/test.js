const bcrypt = require("bcryptjs");

const genPassword = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin@123", salt);

  console.log(hashedPassword);
};

genPassword();
