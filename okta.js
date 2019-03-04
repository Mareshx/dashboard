const okta = require('@okta/okta-sdk-nodejs')

const client = new okta.Client({
  orgUrl: "https://dev-207877.oktapreview.com",
  token: "00G15wy6F1sJCwL9IZ_9VE1M2H_TPxYa6-R4fiEWsV",
})

const middleware = async (req, res, next) => {
  if (req.userinfo) {
    try {
      req.user = await client.getUser(req.userinfo.sub)
    } catch (error) {
      console.log(error)
    }
  }

  next()
}

module.exports = { client, middleware }
