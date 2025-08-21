// External Module
const express = require("express");
const multer = require("multer");
const storage = require("../config/cloudinary");
const hostRouter = express.Router();
const upload = multer({ storage });    // << new

// Local Module
const hostController = require("../controllers/hostController");

// -hostRouter.get("/add-home", hostController.getAddHome);
// -hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post(
  "/add-home",
  upload.array("images", 8),           // ‘images’ == name of the <input>
  hostController.postAddHome
);

hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);

// -hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post(
  "/edit-home",
  upload.array("images", 8),           // add / replace pics on edit
  hostController.postEditHome
);

hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;
