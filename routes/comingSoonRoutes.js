const express = require("express");
const router = express.Router();
const { subscribeEmail } = require("../controllers/comingSoonController");

// POST /coming-soon
router.post("/", subscribeEmail);

module.exports = router;
