import { filterAllData } from '../modules/filterData.js'

const fetch = require("node-fetch")
const Twitter = require('twitter')

require('dotenv').config()

const twitterApi = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
})


/*********** Calls **********/

export const muzicbrainz = async (name) => {
  const artist = await (await fetch(`http://musicbrainz.org/ws/2/artist/?query=artist:${name}&fmt=json`)).json()
  const artistId = artist.artists[0].id
  const artistLinks = await (await fetch(`http://musicbrainz.org/ws/2/artist/${artistId}?inc=url-rels&fmt=json`)).json()

  return artistLinks
}

export const wikipedia = async (name) => {
  const data = await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${name}`)).json()

  return data
}

export const instagram = async (socials) => {
  const meta = socials.find(object => object['instagram'])

  if (meta !== undefined) {
    const data = await (await fetch(`${meta.instagram}?__a=1`)).json()
    const shortcode = data.graphql.user.edge_owner_to_timeline_media.edges[0].node.shortcode
    const object = {
      instagram_url: meta.instagram,
      username: meta.username,
      shortcode: shortcode
    }
    return object
  }
  return
}

export const twitter = async (socials) => {
  const meta = socials.find(object => object['twitter'])

  if (meta !== undefined) {
    const data = await twitterApi.get('/statuses/user_timeline.json', { screen_name: meta.username, count: 1 })
    const shortcode = data[0].id_str
    const date = data[0].created_at
    const object = {
      twitter_url: meta.twitter,
      username: meta.username,
      shortcode: shortcode,
      creation_date: date
    }
    return object
  }
  return
}

export const youtube = async (socials) => {
  const meta = socials.find(object => object['youtube'])

  if (meta !== undefined) {
    const data = await (await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${meta.username}&key=${process.env.YOUTUBE_API_KEY}`)).json()
    const playlistID = data.items[0].contentDetails.relatedPlaylists.uploads
    const userVideos = await (await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${playlistID}&key=${process.env.YOUTUBE_API_KEY}`)).json()
    const shortcode = userVideos.items[0].contentDetails.videoId
    const date = userVideos.items[0].contentDetails.videoPublishedAt
    const object = {
      youtube_url: meta.youtube,
      username: meta.username,
      shortcode,
      creation_date: date
    }
    return object
  }
  return
}

export const thenewyorktimes = async (name) => {
  const data = await (await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${name}&fq=source:("The New York Times")&api-key=${process.env.NEWYORKTIMES_API_KEY}`)).json()
  const article = data.response.docs[0]
  const date = new Date(article.pub_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  if (article.multimedia.length > 0) {
    const object = {
      thenewyorktimes_url: article.web_url,
      title: article.headline.main,
      description: article.lead_paragraph,
      image: article.multimedia[0].url,
      publication_date: date,
      created_by: article.byline.original,
      source: article.byline.source
    }
    return object
  }
  return
}

export const ticketmaster = async (name, image) => {
  const data = await (await fetch(`http://app.ticketmaster.com/discovery/v2/events.json?keyword=${name}&apikey=${process.env.TICKETMASTER_API_KEY}`)).json()

  if (data._embedded != undefined) {
    const concert = data._embedded.events[0]
    const object = {
      artist_image: image,
      ticketmaster_url: concert.url,
      name: concert.name,
      id: concert.id,
      image: concert.images[0].url
    }

    return object
  }
}

export const googlenews = async (name) => {
  const data = await (await fetch(`https://newsapi.org/v2/everything?q=${name}&apiKey=${process.env.GOOGLENEWS_API_KEY}
  `)).json()
  const articles = Array.from(data.articles.reduce((m, t) => m.set(t.source.name, t), new Map()).values())
  const filteredArticles = filterAllData(articles)
  const sources = ['Pitchfork.com', 'Vice News', 'Wired', 'Bcc.com', 'Npr.org', 'BBC News']
  const objects = filteredArticles.filter(element => sources.includes(element.source))

  return objects
}