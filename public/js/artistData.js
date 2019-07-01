(function () {
  const socket = io()
  const url = window.location.href
  const host = window.location.host
  const protocol = window.location.protocol
  const feed = document.querySelector('.feed')
  const artistDataSource = document.getElementById('artist-data-template').innerHTML
  const artistDataTemplate = Handlebars.compile(artistDataSource)

  if (url.indexOf(`${protocol}//${host}/home`) != -1) {
    let followList = []
    const following = document.querySelectorAll('.following__link')
    const cookie = document.cookie
    const token = cookie.replace(/(?:(?:^|.*;\s*)spotify_access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")

    for (let link of following) followList.push(link.id)

    socket.emit('following-list', { followList, token })
  } else {
    const name = document.querySelector('.carousel__name').innerText
    const normalizedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")

    socket.emit('artist-name', normalizedName)
  }

  socket.on('artist-data', (data) => {
    loadInstagramScript()
    loadTwitterScript()
    loadRandomizeScript()
    feed.innerHTML = artistDataTemplate(data)
  })

})()

const loadInstagramScript = () => {
  const script = document.createElement("script")
  script.src = "https://www.instagram.com/static/bundles/es6/EmbedSDK.js/47c7ec92d91e.js"
  document.getElementsByTagName("body")[0].appendChild(script)
}

const loadTwitterScript = () => {
  const script = document.createElement("script")
  script.src = "https://platform.twitter.com/widgets.js"
  document.getElementsByTagName("body")[0].appendChild(script)
}

const loadRandomizeScript = () => {
  const script = document.createElement("script")
  script.src = "/js/randomizeFeed.js"
  document.getElementsByTagName("body")[0].appendChild(script)
}
