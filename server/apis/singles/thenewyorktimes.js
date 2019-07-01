const fetch = require("node-fetch")

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