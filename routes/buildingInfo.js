// backend/routes/buildingInfo.js
const express = require("express");
const BuildingInfo = require("../models/BuildingInfo");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Get all buildings
router.get("/buildingInfo", async (req, res) => {
  try {
    const buildings = await BuildingInfo.find();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching building information" });
  }
});

// Create a new building
router.post("/buildingInfo", async (req, res) => {
  const { name, photoname, info, imagesrc, location } = req.body;

  try {
    const newBuilding = new BuildingInfo({
      name,
      photoname,
      info,
      imagesrc,
      location,
    });
    const savedBuilding = await newBuilding.save();
    res.status(201).json(savedBuilding);
  } catch (error) {
    res.status(500).json({ error: "Error creating building information" });
  }
});

// Update building info
router.put("/buildingInfo/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const building = await BuildingInfo.findById(id);

    if (!building) {
      return res.status(404).send("Building not found");
    }
    // Xóa ảnh cũ nếu có
    if (building.imagesrc) {
      const oldImagePath = path.join(
        __dirname,
        "../../school-map/public",
        building.imagesrc
      );
      console.log(oldImagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Xóa ảnh cũ
      }
    }

    // Cập nhật thông tin
    if (req.file) {
      updateData.imagesrc = `/public/image/${req.file.filename}`;
    }

    await BuildingInfo.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).send("Building updated successfully");
  } catch (error) {
    console.error("Error updating building", error);
    res.status(500).send("Server error");
  }
});

// Delete a building
router.delete("/buildingInfo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const building = await BuildingInfo.findById(id);

    if (!building) {
      return res.status(404).send("Building not found");
    }

    // Xóa ảnh khỏi thư mục public
    if (building.imagesrc) {
      const imagePath = path.join(
        __dirname,
        "../../school-map/public",
        building.imagesrc
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Xóa bản ghi khỏi MongoDB
    await BuildingInfo.findByIdAndDelete(id);

    res.status(200).send("Building deleted successfully");
  } catch (error) {
    console.error("Error deleting building", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
