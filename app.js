if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// console.log(process.env.SECRET);
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true })); //for parsing data jo req se aa raha hai

// for error hanling
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// importing schema we made by joi
let { listingSchema, reviewSchema } = require("./schema.js");

const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbURL);
}

//import model
const Listing = require("./models/listing.js");
// import review model
const Review = require("./models/review.js");

//ejs setup
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//method override for put and delete and patch req
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// ejsMate:- help for creating template and layouts
// eg- jese hamara navbar and footer wabsite k har page pe common hota hai to hamme footer and navbar ko bar bar banane ki zarurat nahi with the help of ejsmate
const ejsMate = require("ejs-mate");
const { error } = require("console");
app.engine("ejs", ejsMate);

// public folder or static file ko access karne k lie
app.use(express.static(path.join(__dirname, "/public")));

// passward set-up(autherizarion & athuntication)
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// app.get("/", (req, res) => {
//   res.send("Hi go /listings for all listings");
// });

// creating session
const session = require("express-session");
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("error in mongo session store", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // after one week this cookie has been deleted
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security porposes
  },
};

app.use(session(sessionOptions));

// implementing flash when we create new listing msg flash
const flash = require("connect-flash");
app.use(flash());

// passport set-up
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// authenticate ka matlab hai user ko login karvana and sighup karvana
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ie ja user ne login kr lia to uski info ko serialize ie store kr lia
// deserialize (remove user data)

app.listen(8080, () => {
  console.log("Server is live on port no- 8080");
});

// middleware for flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log(res.locals.success);
  res.locals.currUser = req.user;
  next();
});

// passport
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "studnt@gmail.com",
//     username: "dela-student",
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

// import router (sare listing wale routes routes wale folder mai listing.js wali file mai dal die)
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// validate listings function (now every time when you tried to validate listing just call this function no need to type whole code)

// ROUTES

// All listings wale routes we are taking from routes folder listing.js via router
app.use("/listings", listingRouter);

// we are importing review.js in which we have all our reviews vai router
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//for testing only
// app.get("/testListing", async (req, res) => {
//     //adding a ducument
//     let sampleListing = new Listing({
//         tittle: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sampleListing done");
//     res.send("Sucessful Testing");
// })

// for all invalid routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
// creating middleware for error handling in server side
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});
