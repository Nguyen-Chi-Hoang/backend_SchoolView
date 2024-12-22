// backend/models/BuildingInfo.js
const mongoose = require("mongoose");

const buildingInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photoname: { type: String, required: true },
  info: { type: String },
  imagesrc: { type: String },
  location: { type: String },
});

module.exports = mongoose.model("BuildingInfo", buildingInfoSchema);
