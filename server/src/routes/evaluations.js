const router = require("express").Router();
const ctrl = require("../controllers/evaluationsController");

router.get("/idea/:ideaId", ctrl.listByIdea);
router.post("/idea/:ideaId", ctrl.create);
router.get("/:id", ctrl.getById);
router.patch("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
