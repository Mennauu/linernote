(function () {
  const searchInput = document.querySelector('.searchArtist')
  const resultContainer = document.querySelector('.artists')

  searchInput.addEventListener("input", async () => {
    const value = { search: searchInput.value }

    try {
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
      }
      const response = await fetch('/search', config)
      const data = await response.json()

      if (response.ok) {
        while (resultContainer.firstChild) resultContainer.removeChild(resultContainer.firstChild)

        for (let artist of data) {
          const HTML =
            `<li class="artist" id="${artist.id}">
             <a class="artist__link "href="/artist/${artist.id}">
               <img class="artist__image" src="${artist.image.url}" alt="${artist.name}">
               <span class="artist__name">${artist.name}</span>
             </a>
           </li>`
          resultContainer.insertAdjacentHTML('afterbegin', HTML)
        }
      } else {
        console.log("Response is false")
      }
    } catch (error) {
      console.log(error)
    }
  })
})()