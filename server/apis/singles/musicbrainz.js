const fetch = require("node-fetch")

export const muzicbrainz = async (name) => {
  const artist = await (await fetch(`http://musicbrainz.org/ws/2/artist/?query=artist:${name}&fmt=json`)).json()
  const artistId = artist.artists[0].id
  const artistLinks = await (await fetch(`http://musicbrainz.org/ws/2/artist/${musicbrainzArtistId}?inc=url-rels&fmt=json`)).json()

  return artistLinks
}