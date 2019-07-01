const fetch = require("node-fetch")

export const theguardian = async (name) => {
  const data = await (await fetch(`https://content.guardianapis.com/search?q=${name}&api-key=${process.env.THEGUARDIAN_API_KEY}`)).json()
  const article = data.response.results[0]
  const object = {
    guardian_url: article.webUrl,
    title: article.webTitle,
    publication_date: article.webPublicationDate
  }

  return object
}