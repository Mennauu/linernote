const fetch = require("node-fetch")

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