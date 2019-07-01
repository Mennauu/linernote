import * as api from '../apis/all.js'
const SpotifyWebApi = require('spotify-web-api-node')

export const getMultipleArtistData = async (data, token) => {
  const spotifyApi = new SpotifyWebApi({ accessToken: token })
  const artists = await spotifyApi.getArtists(data)

  let thenewyorktimes = []
  let googlenews = []
  let instagram = []
  let ticketmaster = []
  let twitter = []
  let youtube = []

  for (let artist of artists.body.artists) {
    let socials = []
    const name = artist.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")


    const musicbrainz = await api.muzicbrainz(name)
    if (musicbrainz.relations.length > 0) {
      for (let link of musicbrainz.relations) {
        const url = new URL(link.url.resource)
        const domain = url.hostname.split(".").slice(-2).join(".")
        const platform = domain.split('.')[0]
        const username = url.pathname.substr(1).split('.')[0].replace(/\/$/, '').replace(/^.*\/(.*)$/, "$1")

        socials.push({
          [platform]: link.url.resource,
          username
        })
      }
    }

    setTimeout(async () => {
      try {
        const instagramData = await api.instagram(socials)
        instagram.push(instagramData)

        const twitterData = await api.twitter(socials)
        twitter.push(twitterData)

        const youtubeData = await api.youtube(socials)
        youtube.push(youtubeData)

        socials = []
      } catch (error) {
        console.error("Get socials error : " + error)
      }
    }, 0)

    const ticketmasterData = await api.ticketmaster(name, artist.images[1].url)
    ticketmaster.push(ticketmasterData)

    const thenewyorktimesData = await api.thenewyorktimes(name)
    thenewyorktimes.push(thenewyorktimesData)

    const googlenewsData = await api.googlenews(name)
    if (googlenewsData[0] !== undefined) {
      googlenews.push(googlenewsData[0])
    }
  }
  console.log(instagram)
  console.log(twitter)

  const socialLinks = {
    'instagram': instagram,
    'twitter': twitter,
    'youtube': youtube,
    'thenewyorktimes': thenewyorktimes,
    'ticketmaster': ticketmaster,
    'googlenews': googlenews
  }
  return socialLinks

}

export const getArtistData = async (name) => {
  let socials = []
  const musicbrainz = await api.muzicbrainz(name)

  for (let link of musicbrainz.relations) {
    const url = new URL(link.url.resource)
    const domain = url.hostname.split(".").slice(-2).join(".")
    const platform = domain.split('.')[0]
    const username = url.pathname.substr(1).split('.')[0].replace(/\/$/, '').replace(/^.*\/(.*)$/, "$1")

    socials.push({
      [platform]: link.url.resource,
      username
    })
  }

  const socialLinks = {
    'instagram': await api.instagram(socials),
    'twitter': await api.twitter(socials),
    'youtube': await api.youtube(socials),
    'thenewyorktimes': await api.thenewyorktimes(name),
    'ticketmaster': await api.ticketmaster(name),
    'googlenews': await api.googlenews(name)
  }
  return socialLinks
}