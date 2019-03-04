const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const { ExpressOIDC } = require('@okta/oidc-middleware')

const okta = require('./okta')
const indexRouter = require('./routes/index')
const dashboardRouter = require('./routes/dashboard')
const servicesRouter = require('./routes/services')
const registrationRouter = require('./routes/register')
const signRouter = require('./routes/sign')
const driveRouter = require('./routes/drive')
const emailRouter = require('./routes/email')
const calendarRouter = require('./routes/calendar')

const app = express()

const oidc = new ExpressOIDC({
  issuer: "https://dev-207877.oktapreview.com/oauth2/default",
  client_id: "0oagmvcxbvyMyQQ3a0h7",
  client_secret: "3-fu8P2Rw7BrtigQNI0Yb6BcqL4CWFbGX6qzzVQ2",
  redirect_uri: "http://localhost:8080/authorization-code/callback",
  scope: 'openid profile',
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: "nzefvjkzenkj",
  resave: true,
  saveUninitialized: false,
}))

app.use(oidc.router)
app.use(okta.middleware)

app.use('/', indexRouter)
app.use('/sign', oidc.ensureAuthenticated(), signRouter)
app.use('/drive', oidc.ensureAuthenticated(), driveRouter)
app.use('/email', oidc.ensureAuthenticated(), emailRouter)
app.use('/calendar', oidc.ensureAuthenticated(), calendarRouter)
app.use('/register', registrationRouter)
app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = { app, oidc }
