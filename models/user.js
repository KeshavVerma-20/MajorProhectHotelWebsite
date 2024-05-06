const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});
// passportLocalMongoose se bydefault userschema k ander username and pass ki feild create ho gai by default hashing and salting bhi add ho gai
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
