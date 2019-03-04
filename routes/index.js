const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Accueil',
    user: req.user,
  })
})

module.exports = router
