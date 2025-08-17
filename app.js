// Core
const fs = require("fs");
const path = require("path");

// External
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const multer = require("multer");

// Local
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

// --- ENV ---
const PORT = process.env.PORT || 3003;               // Render supplies PORT
const MONGODB_URI = process.env.MONGODB_URI;         // put this in Render env
const SESSION_SECRET = process.env.SESSION_SECRET;   // put this in Render env
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET");

// --- App setup ---
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

// Behind a proxy (Render/Koyeb) so secure cookies work in prod
app.set("trust proxy", 1);

// Static files
app.use(express.static(path.join(rootDir, "public")));

// Ensure uploads directory exists (note: ephemeral on free hosts; see notes below)
fs.mkdirSync(path.join(rootDir, "uploads"), { recursive: true });
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")));

// Body + file upload
app.use(express.urlencoded({ extended: true }));

const randomString = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(rootDir, "uploads")),
  filename: (req, file, cb) => cb(null, `${randomString(10)}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const ok = ["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype);
  cb(null, ok);
};

app.use(multer({ storage, fileFilter }).single("photo"));

// Sessions
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Auth flag
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// Routes
app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) return next();
  return res.redirect("/login");
});
app.use("/host", hostRouter);

// Health check
app.get("/healthz", (req, res) => res.send("ok"));

// 404
app.use(errorsController.pageNotFound);

// Start
mongoose
  .connect(MONGODB_URI, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to Mongo:", err);
    process.exit(1);
  });
