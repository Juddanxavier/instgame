const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const socketServer = require("./socket");

const io = socketServer(http);

app.use((req, res, next) => {
  req.io = io;
  next();
});

const routes = require("./routes");

const {
  db: { url, options },
  port,
} = require("./config/keys");

const whitelist = [
  "https://instagamesm.com/",
  "https://admin.instagamesm.com/",
  "http://localhost:3000/",
  "http://localhost:3001/",
];

app.use(express.json({ limit: "500mb", extended: true }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
const corsOptions = {
  origin: whitelist,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan("combined"));

app.use(routes);

// Connect to MongoDB
mongoose.set("useCreateIndex", true);
mongoose
  .connect(url, options)
  .then(() =>
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`)
  )
  .then(() => {
    const PORT = port || 5000;
    const HOST = process.env.HOST || "127.0.0.1";
    http.listen(PORT, HOST, () => {
      console.log(
        `${chalk.green("✓")} ${chalk.blue(
          "Server Started on "
        )} http://${chalk.bgMagenta.white(`${HOST}:${PORT}`)}`
      );
    });
  })
  .catch((err) => console.log(err));
