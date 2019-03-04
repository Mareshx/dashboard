const express = require('express')
const { startCase } = require('lodash')

const router = express.Router()
const models = require('../models')

router.get('/', function (req, res, next) {
  res.render('services', {
    title: 'Gestionnaire des services',
    user: req.user
  })
})

router.post('/', (req, res, next) => {
  console.log(req.body.type)
  models.Post.findOne({
    where: {
      user: req.user.profile.email,
    }
  }).then(post => {
    if (!post) {
      return res.render('error', {
        message: 'Page not found.',
        error: {
          status: 404,
        }
      });
    }

    const update = {
      user: post.user,
      redditState: post.redditState,
      redditWidgets: post.redditWidgets,
      musicState: post.musicState,
      musicWidgets: post.musicWidgets,
      weatherState: post.weatherState,
      weatherWidgets: post.weatherWidgets,
      twitchState: post.twitchState,
      twitchWidgets: post.twitchWidgets
    }

    switch (req.body.service) {
      case 'reddit':
        if (update.redditState === 'on') {
          update.redditState = 'off'
        }
        else {
          update.redditState = 'on'
        }
        break
      case 'spotify':
        if (update.musicState === 'on') {
          update.musicState = 'off'
        }
        else {
          update.musicState = 'on'
        }
        break
      case 'weather':
        if (update.weatherState === 'on') {
          update.weatherState = 'off'
        }
        else {
          update.weatherState = 'on'
        }
        break
      case 'twitch':
        if (update.twitchState === 'on') {
          update.twitchState = 'off'
        }
        else {
          update.twitchState = 'on'
        }
        break
    }
    post.update({
      user: update.user,
      redditState: update.redditState,
      redditWidgets: update.redditWidgets,
      musicState: update.musicState,
      musicWidgets: update.musicWidgets,
      weatherState: update.weatherState,
      weatherWidgets: update.weatherWidgets,
      twitchState: update.twitchState,
      twitchWidgets: update.twitchWidgets
    }).then(() => {
      res.redirect('/services')
    });
  });
});

module.exports = router