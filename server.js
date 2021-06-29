//=========================
//      DEPENDENCIES
//=========================
//get .env variables
require("dotenv").config();
//pull PORT and MONGODB from .env
const { PORT = 5000, MONGODB_URL } = process.env;
//import express
const express = require("express");
//create app object
const app = express();
//import mongoose
const mongoose = require("mongoose");
//import cors and morgan
const cors = require("cors");
const morgan = require("morgan");

//=========================
// DATABASE CONNECTION
//=========================
// Establish mongoDB connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
//Connection Events
mongoose.connection
  .on("open", () => console.log("You're are connected to mongoose"))
  .on("close", () => console.log("You're disconnected from mongoose"))
  .on("error", (error) => console.log(error));

//=========================
//       MODELS
//=========================
const CheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  image: String,
});
const Cheese = mongoose.model("Cheese", CheeseSchema);

//=========================
//       MIDDLEWARE
//=========================
app.use(cors()); // to prevent cors erros, open access to all origin
app.use(morgan("dev")); //logging
app.use(express.json()); //parse json data

//=========================
//       ROUTES
//=========================

//=========================
//       Index Route
//=========================
app.get("/cheese", async (req, res) => {
  try {
    //send all cheese
    res.json(await Cheese.find({}));
  } catch (erro) {
    //send error
    res.status(400).json(error);
  }
});

//=========================
//       Delete Route
//=========================
app.delete("cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});

//=========================
//       Update Route
//=========================
app.put("cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndUpdate(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});
//=========================
//       Create Route
//=========================
app.post("/cheese/", async (req, res) => {
  try {
    res.json(await Cheese.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

//=========================
//       Web Listeners
//=========================
app.listen(PORT, () => console.log(`Listening to Port : ${PORT}`));
