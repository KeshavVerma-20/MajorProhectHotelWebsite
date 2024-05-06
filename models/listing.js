const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema; //taki bar bar mongoose.Schema na likhna pade
const Review = require("./review.js");

//creating schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    // type: String,
    // default:
    //   "https://images.unsplash.com/photo-1682686580036-b5e25932ce9a?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // set: (
    //   v //this condition is for user
    // ) =>
    //   v === ""
    //     ? "https://images.unsplash.com/photo-1682686580036-b5e25932ce9a?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     : v,
    url: String,
    filename:String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// post (pre post wale middleware pre means jo program run hone se pehle hota hai post vice versa) mongoose middleware
// Now if we are deleting listing then jo uske ander reviews hai vo bhi delete ho jane chahiye
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

//creating model (listings is collection name)
const Listing = mongoose.model("Listing", listingSchema);

//export model
module.exports = Listing;
