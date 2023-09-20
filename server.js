const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross origin resource sharing
const whitelist = ["http://127.0.0.1:5500", "http://localhost:3500"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Form data from URL encoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

// Route Handler
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello");
    next();
  },
  (req, res) => {
    res.send("Hello To the other side");
  }
);

app.get("/old", (req, res) => {
  res.redirect(301, "/new");
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ erro: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
