const routeSave = require("express").Router();
const { addSave, deleteSave, allSaves } = require("../controllers/saves");

routeSave.post("/add", addSave);
routeSave.post("/delete", deleteSave);
routeSave.get("/all", allSaves);

module.exports = routeSave;
