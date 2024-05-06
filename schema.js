//  joi is used for schema validation
// ie ab hamme multiple if conditions lga k schema validation karne ki zarurat nahi hai
// joi is npm package ye apne aap kar lega
// joi jis schema ko validate karta hai vo mongo ka schema nahi hota vo server side schema hota hai to ab hamme server side schema bnana padega

const joi = require("joi");
const { model } = require("mongoose");
module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().allow("", null),
    })
    .required(),
});

module.exports.reviewSchema = joi
  .object({
    review: joi.object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    }),
  })
  .required();
