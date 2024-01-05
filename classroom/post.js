const express = require("express");

const app = express();
const mongoose = require("mongoose");


app.listen(3000,()=>{
    console.log("server is listening to port 3000");
  });
  
  
  
  app.get("/", (req, res) => {
    res.send("Hi, I am root");
  });

  
  app.use("/post", (req, res) => {
   res.send("Hi, I am on post");
  }); 

  app.get("/request", (req, res) => {
    res.send("Hi, I am on request page");
   }); 