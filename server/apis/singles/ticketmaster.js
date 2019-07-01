const fetch = require("node-fetch")

export const ticketmaster = async (name, image) => {
  const data = await (await fetch(`http://app.ticketmaster.com/discovery/v2/events.json?keyword=${name}&apikey=${process.env.TICKETMASTER_API_KEY}`)).json()
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