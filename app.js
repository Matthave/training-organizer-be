require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");

const origin = "http://localhost:3000";

const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: origin, // Tutaj podajemy adres frontend (może być inny w produkcji)
  credentials: true, // Zezwalamy na przekazywanie cookies
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(bodyParser.json());

// By uniknąć problemów z CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log("error", error);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Wystąpił błąd serwera.";

  res.clearCookie("token");
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
