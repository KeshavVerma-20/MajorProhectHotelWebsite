const mongoose = require("mongoose");

//my raw data ie array ki form mai hamne data dal rakha hai khud se
const initData = require("./data.js");
//model import kr lis (madel mai mera collaetion hai and schema)
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

// initDB is async function and uske ander or functions hai
const initDB = async () => {
  await Listing.deleteMany({}); //jo bhi db mai purana data hoga vo delete ho ja ga pura db clean ho jayega and hum usmai apna data.js wali file ka data dal dege
  initData.data=initData.data.map((obj) => ({ ...obj, owner: "66238918e7b3d552586527c2" }));
  await Listing.insertMany(initData.data); // now after the db is cleaned then add new data from our data.js file (initData is a object .data karne se data aa jayega coz data.js wali file mai last mai we r exporting data in key value pair)

  console.log("data was initialized");
};

//call our function
initDB();
