const routeLoops = require("express").Router();
const {
  addLoop,
  deleteLoop,
  updateLoop,
  getLoops,
  getLoopComments,
  loopsMoreLiked,
  loopsRandom,
} = require("../controllers/loops");
const { route } = require("./routeAuth");

//define routes for loops
routeLoops.post("/add", addLoop);
routeLoops.delete("/delete/:id", deleteLoop);
routeLoops.put("/update/:id", updateLoop);
routeLoops.get("/all", getLoops);
routeLoops.get("/comments/:loop_id", getLoopComments);
routeLoops.get("/moreLiked", loopsMoreLiked);
routeLoops.get("/public", loopsRandom);

module.exports = routeLoops;
