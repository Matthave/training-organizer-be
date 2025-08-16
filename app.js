require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const compression = require("compression");

const authRoutes = require("./routes/auth");
const exerciseRoutes = require("./routes/exercise");
const trainingRoutes = require("./routes/training");

const app = express();

app.use(morgan("combined"));
app.use(compression());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/exercise", exerciseRoutes);
app.use("/training", trainingRoutes);

app.use((error, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log("error", error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Wystąpił błąd serwera.";

  if (statusCode === 401) {
    res.clearCookie("token");
  }

  res.status(statusCode).json({
    message: message,
    data: error.data,
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.0j7yt.mongodb.net/${process.env.MONGO_DEFAULT_DB}`,
  )
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));
