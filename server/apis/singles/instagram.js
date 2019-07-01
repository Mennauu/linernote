const fetch = require("node-fetch")

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