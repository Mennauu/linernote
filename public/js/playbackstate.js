(function () {
  const socket = io()
  const spotify = document.querySelector('.spotify__refresh')
  const progress = document.querySelector('.spotify__progress')
  const remote = document.querySelector('.spotify__remote')
  let id = document.querySelector('.spotify__id').innerText

  // const advance = (duration, element) => {
  //   var progress = document.getElementById("progress");
  //   increment = 10 / duration
  //   percent = Math.min(increment * element.currentTime * 10, 100);
  //   progress.style.width = percent + '%'
  //   startTimer(duration, element);
  // }

  // const startTimer = (duration, element) => {
  //   if (percent < 100) {
  //     timer = setTimeout(function () { advance(duration, element) }, 100);
  //   }
  // }

  socket.on("getPlayBackState", data => {

    if (remote.classList.contains('invisible')) {
      remote.classList.remove('invisible')
    }

    if (data.is_playing === false && remote.innerText === '||') {
      remote.innerText = '▸'
    } else if (data.is_playing === true && remote.innerText === '▸' || remote.innerText === '') {
      remote.innerText = '||'
    }

    if (data.item.id !== id) {
      const html = `
        <div class="spotify__progress"></div>
        <img class="spotify__image" src="${data.item.album.images[2].url}" alt="${data.item.name}">
        <div class="spotify__song">
          <span class="spotify__track">${data.item.name}</span>
          <span class="spotify__artist">${data.item.artists[0].name}</span>
          <span class="spotify__id">${data.item.id}</span>
        </div>`

      while (spotify.firstChild) spotify.removeChild(spotify.firstChild)
      spotify.insertAdjacentHTML('afterbegin', html)
      progress.classList.add('visible')
      id = document.querySelector('.spotify__id').innerText
    }
  })

  remote.addEventListener("click", async () => {
    try {
      const cookie = document.cookie
      const token = cookie.replace(/(?:(?:^|.*;\s*)spotify_access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1")

      if (remote.innerText === '||') {
        const config = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        const response = await fetch('https://api.spotify.com/v1/me/player/pause', config)
        remote.innerText = '▸'
      } else {
        const config = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        const response = await fetch('https://api.spotify.com/v1/me/player/play', config)
        remote.innerText = '||'
      }
    } catch (error) {
      console.log(error)
    }
  })

})()
