const express = require("express");
const router = express.Router();

// All the todo List
router.get("/", (req, res, next) => {});

// Create a single Todo
router.post("/", (req, res, next) => {});

// Edit Todo by Id
router.put("/", (req, res, next) => {});

// Delete Todo by Id
router.delete("/", (req, res, next) => {});

module.exports = router;
