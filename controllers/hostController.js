// controllers/hostController.js
const Home = require('../models/home');
const cloudinary = require('cloudinary').v2;    // for deletions if you need them

/* ---------- GET /add-home ---------- */
exports.getAddHome = (req, res) => {
  res.render('host/edit-home', {
    pageTitle: 'Add Home to HomeHave',
    currentPage: 'addHome',
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

/* ---------- GET /edit-home/:homeId ---------- */
exports.getEditHome = async (req, res, next) => {
  try {
    const home = await Home.findById(req.params.homeId);
    if (!home) return res.redirect('/host/host-home-list');

    res.render('host/edit-home', {
      home,
      pageTitle: 'Edit your Home',
      currentPage: 'host-homes',
      editing: req.query.editing === 'true',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  } catch (err) { next(err); }
};

/* ---------- GET /host-home-list ---------- */
exports.getHostHomes = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find();   // filter by host if you store that
    res.render('host/host-home-list', {
      registeredHomes,
      pageTitle: 'Host Homes List',
      currentPage: 'host-homes',
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });
  } catch (err) { next(err); }
};

/* ---------- POST /add-home ---------- */
exports.postAddHome = async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(422).send('No images provided');

    const images = req.files.map(f => f.path);       // Cloudinary CDN URLs
    const { houseName, price, location, rating, description } = req.body;

    await new Home({ houseName, price, location, rating, description, images }).save();
    res.redirect('/host/host-home-list');
  } catch (err) { next(err); }
};

/* ---------- POST /edit-home ---------- */
exports.postEditHome = async (req, res, next) => {
  try {
    const { id, houseName, price, location, rating, description } = req.body;

    const updates = { houseName, price, location, rating, description };

    if (req.files?.length) {
      // append new pictures; use $set if you want to REPLACE instead
      updates.$push = { images: { $each: req.files.map(f => f.path) } };
    }

    await Home.findByIdAndUpdate(id, updates, { new: true });
    res.redirect('/host/host-home-list');
  } catch (err) { next(err); }
};

/* ---------- POST /delete-home/:homeId ---------- */
exports.postDeleteHome = async (req, res, next) => {
  try {
    // OPTIONAL: remove images from Cloudinary before deleting the doc
    const home = await Home.findById(req.params.homeId);
    if (home?.images.length) {
      const publicIds = home.images.map(url => {
        const parts = url.split('/');                   // .../folder/filename.ext
        return parts.at(-1).split('.')[0];              // filename without extension
      });
      await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(`homehave/${id}`)));
    }

    await Home.findByIdAndDelete(req.params.homeId);
    res.redirect('/host/host-home-list');
  } catch (err) { next(err); }
};
