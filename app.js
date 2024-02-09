if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
  }
  //console.log(process.env.SECRET);
  
  
  const express = require("express");
  const router = express.Router();
  const app = express();
  const mongoose = require("mongoose");
  const Listing = require("./models/listing.js");
  const {listingSchema} = require("./schema.js")
  const path = require("path");
  const methodOverride = require("method-override");
  const ejsMate= require("ejs-mate");
  const Session = require("express-session");
  const MongoStore = require("connect-mongo");
  const flash = require("connect-flash");
  
  const ExpressError = require("./utils/ExpressError.js");
  const Review= require("./models/review.js");
  
  const passport = require("passport");
  const LocalStrategy = require("passport-local");
  const User = require("./models/user.js");
  const bodyParser = require("body-parser");
  
  
  const listingRouter= require("./routers/listing.js");
   const reviewRouter = require("./routers/review.js");
   const userRouter = require("./routers/user.js");
  
  // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  const dbUrl = process.env.ATLASDB_URL;
  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });
  
    async function main() {
      await mongoose.connect(dbUrl);
    }
  
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.engine('ejs', ejsMate);
  app.use(express.static(path.join(__dirname, "/public")));
  app.use(bodyParser.urlencoded({extended : true}));
  
  
    const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
      secret : process.env.SECRET,
     
     },
      touchAfter : 24 * 3600,
  }
);
  
  
  const sessionOptions = 
  {  
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() +  7 * 24 * 60 *1000,
      maxAge : 7 * 24 * 60 *1000,
      httpOnly : true,
  
    },
  };


  app.use(Session(sessionOptions));
  app.use(flash());
  
  app.listen(8080,()=>{
    console.log("server is listening to port 8080");
  }); 
  
  
  app.get("/", (req, res) => {
    res.send("Hi, I am root");
  });
  
  
  
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(User.authenticate()));
  
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  
  app.use((req,res, next ) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
  });
  
  app.get("/facebook", (req, res) => {
   let facebookUrl = "https://www.facebook.com/shuruti.shree";
    res.redirect(facebookUrl);
  });
  
  app.get("/instragram", (req, res) => {
    let instagramUrl = "https://www.instagram.com/rohini.kumari12/";
    res.redirect(instagramUrl);
  });
  
  app.get("/linkedin", (req, res) => {
    let linkedinUrl = "https://www.linkedin.com/in/rohini-kumari-03686524a/";
    res.redirect(linkedinUrl);
  });
  
  app.get("/github", (req, res) => {
   let githubUrl = "https://github.com/ROHINIKUMARI008";
    res.redirect(githubUrl);
  });
  app.get("/register", async(req, res) => {
    let { name = "anonoymonus"} = req.query;
      req.session.name = name ;
      req.flash("success" , "Welcome back");
          res.redirect("/hello");
  });
      app.get("/hello" , (req,res) =>{
      res.send(`hello , ${req.session.name}`);
      });
  
  // app.get("/getCookies", (req, res) => {
  //   res.cookie("greet","hello");
  //   res.send("Hi, I aam cookies");
  
  // }); 
  
  
  
    
  
  
  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewRouter);
  app.use("/",userRouter);
  
  app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
  });
  
  app.use((err,req,res,next)=>{
    let {statusCode =500 , message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message})
  });