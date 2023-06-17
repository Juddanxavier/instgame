const Menu = require("../../models/menu/Menu.model");

const getMenu = async (req, res, next) => {
  try {
    const all = await Menu.find();
    res.send(all);
  } catch (error) {
    next(error);
  }
};

module.exports = getMenu;
