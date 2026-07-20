const { Router } = require("express");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/roles");
const { getAll, getById, create, update, remove } = require("../controllers/userController");

const router = Router();

router.use(protect);

router.get("/", authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"), getAll);
router.get("/:id", getById);
router.post("/", authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"), create);
router.patch("/:id", authorize("SUPER_ADMIN", "HOSPITAL_ADMIN"), update);
router.delete("/:id", authorize("SUPER_ADMIN"), remove);

module.exports = router;
