const Menu = require("../../models/menu/Menu.model");

const getMenu = async (req, res, next) => {
  const { body } = req;
  try {
    const all = await Menu.create(body);
    res.send(all);
  } catch (error) {
    next(error);
  }
};

module.exports = getMenu;
