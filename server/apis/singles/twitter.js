const Twitter = require('twitter')

const twitterApi = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
})

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