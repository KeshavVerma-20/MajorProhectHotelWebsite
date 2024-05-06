const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}); //Listing model mai se sara data aa gya usse allListing mai store kr dia
  res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  // thui method by default checks for us is user logged in or not
  // if (!req.isAuthenticated()) {
  //   req.flash("error", "You must be logged in to create listing")
  //   return res.redirect("/login");
  // }
  // we can pass it as middleware to har bar ye logic likhne ki zrurat nahi padegi

  res.render("listings/new");
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Sorry this listing does not exists!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // way 1
  // let { title, description, image, price, country, location } = req.body;

  // way 2
  //coz hamne sare names ko listing wale obj mai dal rakha hai to listing obj mai se sare names ki value nikal li and usse listing variable mai store kerwa lia
  //   let listing = req.body.listing;
  // console.log(listing);

  // agar user ne req ki body mai galat req bhej di hai to yehi pe check karlo(invalid listing)
  // ye post req hopscoh ya postman ke throung jayegi
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "send valid data for listing");
  // }

  // ab if condition se schema validation karne ki zarurat nahi sidha joi se kro
  // funvtion bna lo so that function call se hi schema validation ho jaye
  // const result = listingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, " ", filename);
  const newListing = new Listing(req.body.listing);
  // now we r checking that jo bhi data hum db mai dal rahe hai vo hamare schema ke hisab se bhi hai ya nahi (svchema validation)
  // ie ab agar hum postman ke through post req se listing ko add karegay or agar koi feild empty hui to error ayegi
  // if (!newlisting.tittle) {
  //   throw new ExpressError(400, "Tittle is missing");
  // }
  // if (!newlisting.description) {
  //   throw new ExpressError(400, "Description is missing");
  // }
  // if (!newlisting.location) {
  //   throw new ExpressError(400, "Location is missing");
  // }
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created! :)");
  res.redirect("/listings");
};

module.exports.editController = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Sorry this listing does not exists!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

// module.exports.updateController = async (req, res) => {
//   // validateListing se schema validate ho gya ab if conitions ki need nahi hai
//   // if (!req.body.listing) {
//   //   throw new ExpressError(400, "send valid data for listing");
//   // }
//   let { id } = req.params;
//   // let listing = await Listing.findById(id);
//   // if (!listing.owner.equals(res.locals.currUser._id)) {
//   //   req.flash("error", "You don't have any permission to edit");
//   //   return res.redirect(`/listings/${id}`);
//   // }
//   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //...req.body.listing ek js ki obj hai jiske ander sare parameters pade hai
//   if (typeof req.file != "undefined") {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//     req.flash("success", "Listing Updated");
//     res.redirect(`/listings/${id}`);
//   }
// };

module.exports.updateController = async (req, res) => {
  let { id } = req.params;
  let listingData = req.body.listing; // Extract listing data from request body
  if (typeof req.file !== "undefined") {
    // If a file was uploaded, update the image field
    let url = req.file.path;
    let filename = req.file.filename;
    listingData.image = { url, filename };
  }
  try {
    let updatedListing = await Listing.findByIdAndUpdate(id, listingData, {
      new: true,
    }); // Update the listing
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    req.flash("error", "Failed to update listing");
    res.redirect(`/listings/${id}`);
  }
};

module.exports.deleteController = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
