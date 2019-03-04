const express = require('express')
const { startCase } = require('lodash')

const router = express.Router()
const models = require('../models')

router.get('/', function (req, res, next) {
//code executé avant le chargement de la page
})

router.post('/', (req, res, next) => {
  console.log(req.body.type)
  // code executé lors de l'execution d'un post
});

module.exports = router
