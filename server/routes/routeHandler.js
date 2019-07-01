import * as api from '../apis/all.js'

const SpotifyWebApi = require('spotify-web-api-node')
const userModel = require('../database/models/user.js')
const spotifyAuth = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

exports.root = (req, res) => {
  res.redirect('/login')
}

exports.login = (req, res) => {
  res.render('login', {
    layout: 'authentication',
    template: 'template__login'
  })
}

exports.spotifyLogin = (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'user-read-currently-playing', 'user-read-playback-state', 'user-modify-playback-state']
  const authorizeURL = spotifyAuth.createAuthorizeURL(scopes)

  res.redirect(authorizeURL)
}

exports.spotifyCallback = async (req, res) => {
  try {
    const code = req.query.code
    const auth = await spotifyAuth.authorizationCodeGrant(code)
    const spotifyApi = new SpotifyWebApi({ accessToken: auth.body.access_token })
    const user = await spotifyApi.getMe()
    const userID = user.body.id
    const newUser = new userModel({ user: userID })

    userModel.findOne({ user: userID }, async (err, user) => {
      if (user !== null && user.user === userID) {

        console.log(`User: ${userID} already in database`)
        res.cookie('spotify_access_token', auth.body.access_token)
        res.cookie('spotify_user_id', userID)
        res.redirect(`${process.env.LOCAL_URI}home`)
      } else {
        const add = await newUser.save()

        if (add) {

          console.log(`User: ${userID} has been saved`)
          res.cookie('spotify_access_token', auth.body.access_token)
          res.cookie('spotify_user_id', userID)
          res.redirect(`${process.env.LOCAL_URI}home`)
        } else {
          console.log('There was an error trying to save the user')
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
}


exports.home = async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({ accessToken: req.cookies.spotify_access_token })
    const userID = req.cookies.spotify_user_id
    const user = await userModel.findOne({ user: userID })
    const spotifyPlayState = await spotifyApi.getMyCurrentPlaybackState({})

    if (user.following.length > 0) {
      const artists = await spotifyApi.getArtists(user.following)

      if (artists) {
        let artistData = []

        for (let artist of artists.body.artists) {
          const name = artist.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

          artistData.push({
            id: artist.id,
            image: artist.images[1].url,
            name: artist.name
          })

        }

        res.render('home', {
          layout: 'default',
          template: 'template__home',
          playback: spotifyPlayState.body,
          following: artistData
        })
      }
    } else {
      res.render('home', {
        layout: 'default',
        template: 'template__home',
        playback: spotifyPlayState.body
      })
    }
  } catch (error) {
    console.error(error)
  }
}

exports.search = async (req, res) => {
  try {
    const spotifyApi = new SpotifyWebApi({ accessToken: req.cookies.spotify_access_token })
    const spotifyPlayState = await spotifyApi.getMyCurrentPlaybackState({})

    res.render('search', {
      layout: 'default',
      template: 'template__search',
      playback: spotifyPlayState.body
    })
  } catch (error) {
    console.error(error)
  }
}

exports.artist = async (req, res) => {
  try {
    let followingList = []
    let notFollowingList = []
    let topTracksList = []
    let trackNumber = 0
    const spotifyApi = new SpotifyWebApi({ accessToken: req.cookies.spotify_access_token })
    const spotifyPlayState = await spotifyApi.getMyCurrentPlaybackState({})
    const artist = await spotifyApi.getArtist(req.params.id)
    const name = artist.body.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    const related = await spotifyApi.getArtistRelatedArtists(req.params.id)
    const topTracks = await spotifyApi.getArtistTopTracks(req.params.id, 'NL')
    const userID = req.cookies.spotify_user_id
    const user = await userModel.findOne({ user: userID })
    const following = user.following
    const checkFollowing = following.includes(artist.body.id)
    const relatedArtists = related.body.artists
    const relatedFollowing = relatedArtists.filter(element => following.includes(element.id))
    const relatedNotFollowing = relatedArtists.filter(element => !following.includes(element.id))

    for (let artist of relatedFollowing) {
      artist.following = true
      followingList.push({
        id: artist.id,
        name: artist.name,
        image: artist.images[2].url
      })
    }

    for (let artist of relatedNotFollowing) {
      if (artist.images.length > 2) {
        notFollowingList.push({
          id: artist.id,
          name: artist.name,
          image: artist.images[2].url
        })
      }
    }

    for (let track of topTracks.body.tracks) {
      trackNumber++

      topTracksList.push({
        track: track.name,
        number: trackNumber
      })
    }

    const wikipedia = await api.wikipedia(name)

    res.render('artist', {
      layout: 'default',
      template: 'template__artist',
      playback: spotifyPlayState.body,
      artist: artist.body,
      songs: topTracksList.slice(0, 5),
      checkFollowing,
      related: notFollowingList,
      relatedFollowing: followingList,
      spotifyURL: topTracks.body.tracks[0].external_urls.spotify,
      wikipedia
    })
  } catch (error) {
    console.error(error)
  }
}

exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}

exports.addArtist = async (req, res) => {
  try {
    const artistID = Object.values(req.body).toString()
    const userID = req.cookies.spotify_user_id
    const user = await userModel.findOne({ user: userID })

    if (user.following.includes(artistID)) {
      console.log('NIET TOEGEVOEGD, STAAT AL IN DE LIJST')
    } else {
      await userModel.updateOne({ user: userID }, { $push: { following: artistID } })
      console.log('ARTIEST IS TOEGEVOEGD')
    }
  } catch (error) {
    console.error(error)
  }
}

exports.searchArtists = async (req, res) => {
  try {
    const artists = []
    const spotifyApi = new SpotifyWebApi({ accessToken: req.cookies.spotify_access_token })
    const searchInput = Object.values(req.body).toString()
    const data = await spotifyApi.searchArtists(searchInput)

    for (let artist of data.body.artists.items) {
      artists.push({
        id: artist.id,
        name: artist.name,
        image: artist.images[2]
      })
    }

    res.send(artists)
  } catch (error) {
    console.error(error)
  }
}