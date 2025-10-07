const router = require("express").Router();
const { generateInsights } = require("../controllers/aiController");

router.post("/market-insights", generateInsights);

module.exports = router;
