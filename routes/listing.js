const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
let { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../niddleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
// const { storage } = require("../cloudConfig.js");
// const upload = multer({ storage});
// const upload = multer({ dest: "uploads/" });

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  // .post(upload.single('listing[image]'),(req, res) => {
  //   res.send(req.file)
  // })
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateController)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteController));

//Index route
// router.get("/", wrapAsync(listingController.index));

//Show route
// router.get("/:id", wrapAsync(listingController.showListing));

//create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

//edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editController)
);

//Update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateController)
// );

//Delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.deleteController)
// );

module.exports = router;
