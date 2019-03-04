const express = require('express')
const { startCase } = require('lodash')

const router = express.Router()
const models = require('../models')

router.get('/', function (req, res, next) {
  models.Post.findOne({
    where: {
      user: req.user.profile.email,
    },
  }).then(post => {
    console.log(post)
    const config = post
    const { profile } = req.user
    const descriptionList = Object.keys(profile).sort()
      .map(key => ({
        term: startCase(key),
        details: profile[key],
      }))
      .filter(({ details }) => details)

    const subReddit = []
    const postReddit = []
    let redditState = null
    if (config.redditState === 'on') {
      const redditWidgetArray = config.redditWidgets.split(';')
      for (var i = 0; redditWidgetArray[i]; i++) {
        const redditWidget = redditWidgetArray[i].split('_')
        if (redditWidget[0] === 'sub') {
          subReddit.push(redditWidget[1])
        }
        else if (redditWidget[0] === 'post') {
          postReddit.push(redditWidget[1])
        }
      }
      redditState = 'OK'
    }

    const spotify = []
    let musicState = null
    if (config.musicState === 'on') {
      const musicWidgetArray = config.musicWidgets.split(';')
      console.log(musicWidgetArray)
      for (var i = 0; musicWidgetArray[i]; i++) {
        const musicWidget = musicWidgetArray[i].split('_')
        spotify.push("https://open.spotify.com/embed/album/" + musicWidget[1])
      }
      musicState = 'OK'
    }

    const current = []
    let weatherState = null
    if (config.weatherState === 'on') {
      const weatherWidgetArray = config.weatherWidgets.split(';')
      console.log(weatherWidgetArray)
      for (var i = 0; weatherWidgetArray[i]; i++) {
        const weatherWidget = weatherWidgetArray[i].split('_')
        const city = weatherWidget[1].split('/')
        console.log("HERES")
        console.log(city)
        const info = {
          url: weatherWidget[1],
          city: city[5]
        }
        current.push(info)
      }
      weatherState = 'OK'
    }

    const twitch = []
    let twitchState = null
    if (config.twitchState === 'on') {
      const twitchWidgetArray = config.twitchWidgets.split(';')
      console.log(twitchWidgetArray)
      for (var i = 0; twitchWidgetArray[i]; i++) {
        const twitchWidget = twitchWidgetArray[i].split('_')
        twitch.push(twitchWidget[1])
      }
      twitchState = 'OK'
    }

    console.log(current)

    const widgets = {
      reddit: redditState,
      subReddit: subReddit,
      postReddit: postReddit,
      music: musicState,
      spotify: spotify,
      weather: weatherState,
      currentWeather: current,
      twitchState: twitchState,
      twitch: twitch
    }
    console.log(widgets)
    res.render('dashboard', {
      title: 'Dashboard',
      descriptionList,
      widgets,
      user: req.user,
    })
  })
})

router.post('/', (req, res, next) => {
  console.log(req.body.type)

  if (req.body.type === 'Add') {
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
      var update = {
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
      console.log("INFO INFO INFO")
      console.log(req.body.widget)
      switch (req.body.widget) {
        case 'subReddit':
          update.redditWidgets += 'sub_' + req.body.config + ';'
          break
        case 'postReddit':
          update.redditWidgets += 'post_' + req.body.config + ';'
          break
        case 'spotify':
          update.musicWidgets += 'spotify_' + req.body.config + ';'
          break
        case 'currentWeather':
          update.weatherWidgets += 'current_' + req.body.config + ';'
          break
        case 'twitch':
          update.twitchWidgets += 'twitch_' + req.body.config + ';'
          break
      }
      console.log(update)
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
        res.redirect('/dashboard')
      });
    });
  }

if (req.body.type === 'Edit') {
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

      var update = {
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

      switch (req.body.widget) {
        case 'subReddit':
          update.redditWidgets = update.redditWidgets.replace('sub_' + req.body.ref, 'sub_' + req.body.config)
          break
        case 'postReddit':
          update.redditWidgets = update.redditWidgets.replace('post_' + req.body.ref, 'post_' + req.body.config)
          break
        case 'spotify':
          update.musicWidgets = update.musicWidgets.replace('spotify_' + req.body.ref.replace('https://open.spotify.com/embed/album/', ''), 'spotify_' + req.body.config)
          break
        case 'currentWeather':
          update.weatherWidgets = update.weatherWidgets.replace('current_' + req.body.ref, 'current_' + req.body.config)
          break
        case 'twitch':
          update.twitchWidgets = update.twitchWidgets.replace('twitch_' + req.body.ref, 'twitch_' + req.body.config)
          break
      }
      console.log("START HERE")
      console.log(req.body.ref)
      console.log(update)
      console.log("END HERE")
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
        res.redirect('/dashboard')
      });
    });
  }

  if (req.body.type === 'Delete') {
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
      var update = {
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

      switch (req.body.widget) {
        case 'subReddit':
          update.redditWidgets = update.redditWidgets.replace('sub_' + req.body.ref + ';', '')
          break
        case 'postReddit':
          update.redditWidgets = update.redditWidgets.replace('post_' + req.body.ref + ';', '')
          break
        case 'spotify':
          update.musicWidgets = update.musicWidgets.replace('spotify_' + req.body.ref.replace('https://open.spotify.com/embed/album/', '') + ';', '')
          break
        case 'currentWeather':
          update.weatherWidgets = update.weatherWidgets.replace('current_' + req.body.ref + ';', '')
          break
        case 'twitch':
          update.twitchWidgets = update.twitch.replace('twitch_' + req.body.ref + ';', '')
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
        res.redirect('/dashboard')
      });
    });
  }
});

module.exports = router
