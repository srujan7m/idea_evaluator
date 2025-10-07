const router = require("express").Router();
const ctrl = require("../controllers/ideasController");

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.get("/:id", ctrl.getById);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);
router.get("/meta/count", ctrl.count);

module.exports = router;
