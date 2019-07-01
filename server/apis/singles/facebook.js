
const FB = require('fb')

FB.setAccessToken(process.env.FACEBOOK_BEARER_TOKEN)
FB.extend({ appId: process.env.FACEBOOK_CLIENT_ID, appSecret: process.env.FACEBOOK_CLIENT_SECRET })

export const GETfacebook = async (socials) => {
  const meta = socials.find(object => object['facebook'])
  const data = await FB.api(`/${meta.username}/feed`)

  return data
}

/*
    "(#10) To use 'Page Public Content Access', your use of this endpoint
    must be reviewed and approved by Facebook. To submit this 'Page Public Content
    Access' feature for review please read our documentation on reviewable
    features: https://developers.facebook.com/docs/apps/review."
*/