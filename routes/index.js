const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  //res.send('hello')
  res.render("index.hbs");
});

module.exports = router;
