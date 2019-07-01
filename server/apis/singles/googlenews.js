const fetch = require("node-fetch")

export const googlenews = async (name) => {
  const data = await (await fetch(`https://newsapi.org/v2/everything?q=${name}&apiKey=${process.env.GOOGLENEWS_API_KEY}
  `)).json()
  const articles = Array.from(data.articles.reduce((m, t) => m.set(t.source.name, t), new Map()).values())
  const filteredArticles = filterAllData(articles)
  const sources = ['Pitchfork.com', 'Vice News', 'Wired', 'Bcc.com', 'Npr.org', 'BBC News']
  const objects = filteredArticles.filter(element => sources.includes(element.source))

  return objects
}