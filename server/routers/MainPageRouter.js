const Router = require("express");
const router = new Router();

const MainPageController = require("../controllers/MainPageController");

router.post("/", MainPageController.GetData);
router.get("/", MainPageController.GetAllLocations);

module.exports = router;