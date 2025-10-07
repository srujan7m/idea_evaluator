const router = require("express").Router();
const {
  bestEvaluation,
  exportCsv,
} = require("../controllers/reportsController");

router.get("/best/:ideaId", bestEvaluation);
router.get("/export.csv", exportCsv);
router.get("/compare", require("../controllers/reportsController").compare);

module.exports = router;
