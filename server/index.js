const express = require("express");
const fileUploader = require("express-fileupload");
const cors = require("cors");
const router = require("./routers/mainRouter");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileUploader({ createParentPath: true }));

app.use("/", router);

app.listen(3001, () => {
  console.log("Сервер запущен на порте 3001");
});
