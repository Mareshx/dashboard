const okta = require('@okta/okta-sdk-nodejs')
const express = require('express')
const models = require("../models")

const router = express.Router()

const client = new okta.Client({
  orgUrl: "https://dev-207877.oktapreview.com",
  token: "00G15wy6F1sJCwL9IZ_9VE1M2H_TPxYa6-R4fiEWsV",
})

const title = 'Create an account'

router.get('/', (req, res, next) => {
  if (req.userinfo) {
    return res.redirect('/')
  }

  res.render('register', { title })
})

router.post('/', async (req, res, next) => {
  try {
    await client.createUser({
      profile: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        login: req.body.email,
      },
      credentials: {
        password: {
          value: req.body.password,
        },
      },
    })
    res.redirect('/dashboard')
  } catch ({ errorCauses }) {
    const errors = errorCauses.reduce((summary, { errorSummary }) => {
      if (/Password/.test(errorSummary)) {
        return Object.assign({ password: errorSummary })
      }

      const [field, error] = /^(.+?): (.+)$/.exec(errorSummary)
      return Object.assign({ [field]: error }, summary)
    }, {})

    console.log(errors)

    res.render('services', { title, errors, body: req.body })
  } finally {
	models.Post.create({
		user: req.body.email
	      })
  }
})

module.exports = router
