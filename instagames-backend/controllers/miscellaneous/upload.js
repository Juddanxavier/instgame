const ImageKit = require("imagekit");
const { uuid } = require("uuidv4");

var imagekit = new ImageKit({
  publicKey: "public_NH9geOZy5eVImsFf0U63cHlPUCk=",
  privateKey: "private_5UD1GZQEJPsFfl717NVfBhmSTWQ=",
  urlEndpoint: "https://ik.imagekit.io/mindia",
});

const logoutUser = async (req, res, next) => {
  try {
    const { body } = req;

    const promises = await body.image.map(async (file) => {
      const numFruit = new Promise((resolve, reject) => {
        const image = imagekit.upload(
          {
            file: file, //required
            fileName: uuid(), //required
          },
          function (error, result) {
            if (error) console.log(error);
            else {
              resolve(result);
            }
          }
        );
      });
      return numFruit;
    });

    const result = await Promise.all(promises);
    console.log(result);
    const origin = req.headers.origin;

    // res.setHeader("Access-Control-Allow-Origin", origin + "/");
    // res.setHeader(
    //   "Access-Control-Allow-Methods",
    //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    // );
    // res.setHeader(
    //   "Access-Control-Allow-Headers",
    //   "X-Requested-With,content-type, Accept"
    // );
    // res.setHeader("Access-Control-Allow-Credentials", true);
    res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = logoutUser;
