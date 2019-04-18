const mongoose = require('mongoose');
const express = require("express");
var dl = require('image-downloader');
var sw = require('stopword');
var unirest = require('unirest');
const router = express.Router();
const auth = require("./auth.js");
const bodyParser = require("body-parser");
var imageInt = 0;
var currentName = "";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}));

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../public/images/',
  limits: {
    fileSize: 10000000
  }
});

const users = require("./users.js");
const User = users.model;

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  path: String,
  title: String,
  description: String,
  created: {
    type: Date,
    default: Date.now
  },
});

const Photo = mongoose.model('Photo', photoSchema);

//generateWordCloud

//var tempImage = new File('./temp_image');

router.post("/hmm", upload.none(), async (req, res) => {
  console.log("in the hmm thing, req.body.url= " + req.body.url);
  console.log("in the hmm thing, req.body.title= " + req.body.title);
  imageInt = imageInt + 1;
  currentName = req.body.url;
  const options = {
    url: req.body.url,
    dest: "../public/images/temp_image" + currentName + imageInt + ".png",
  }
  console.log(options.dest);
  //removes stop words (and, the, etc.)
  let ret = {
    file: null,
    filename: ""
  }
  dl.image(options)
    .then(({
      filename,
      image
    }) => {
      this.file = image;
      this.file.name = filename

      console.log('File saved to ', "../public/images/temp_image" + currentName + imageInt + ".png")
      return res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err)
    })
  return res.sendStatus(200);
})

// upload photo
router.post("/", auth.verifyToken, User.verify, upload.none(), async (req, res) => {
  // check parameters
  /*if (!req.file)
    return res.status(400).send({
      message: "Must upload a file."
    });*/
  console.log("in post");


  const photo = new Photo({
    user: req.user,
    path: "/images/temp_image" + currentName + imageInt + ".png",
    title: req.body.title,
    description: req.body.description,
  });
  try {
    await photo.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get my photos
router.get("/", auth.verifyToken, User.verify, async (req, res) => {
  // return photos
  try {
    let photos = await Photo.find({
      user: req.user
    }).sort({
      created: -1
    });
    return res.send(photos);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// get all photos
router.get("/all", async (req, res) => {
  try {
    let photos = await Photo.find().sort({
      created: -1
    }).populate('user');
    return res.send(photos);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

//get one photo
router.get("/:id", async (req, res) => {
  try {
    console.log(req.body.hehe);
    let photo = await Photo.find({
      _id: req.params.id
    });
    return res.send(photo);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Photo,
  routes: router,
}