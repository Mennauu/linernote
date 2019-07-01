const geniusApi = require('genius-api')
const geniusCall = new geniusApi(process.env.GENIUS_CLIENT_ACCESS_TOKEN)

export const genius = async (socials) => {
  const meta = socials.find(object => object['genius'])
  const search = await geniusCall.search(meta.username)
  const id = search.hits[0].result.primary_artist.id
  const data = await geniusCall.artist(geniusArtistId)


  // const geniusPageData = await geniusCall.webPage({ raw_annotatable_url: `https://genius.com/artists/${geniusMeta.username}` })
  // const geniusPageId = geniusPageData.web_page.id
  // const geniusReferentData = await geniusCall.referents({ web_page_id: geniusPageId }, { per_page: 1 })
  // const geniusArtistId = geniusReferentData.referents[0].id
  // const geniusData = await geniusCall.annotation(10663723)


  /* WORK IN PROGRESS */
}

