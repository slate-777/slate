const express = require("express");
const verifyUser = require('../middlewares/auth');
const reportsController = require("../controllers/reportsController");

const router = express.Router();

router.get("/:reportType", verifyUser, reportsController.generateReport);

module.exports = router;