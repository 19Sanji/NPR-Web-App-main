const Router = require("express");
const router = new Router();


const MainPageRouter = require("./MainPageRouter");

router.use("/", MainPageRouter);

module.exports = router;
