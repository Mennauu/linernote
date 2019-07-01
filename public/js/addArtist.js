(function () {
  const button = document.querySelector('.carousel__button')

  button.addEventListener("click", () => {
    const value = {
      artist: window.location.href.split("/").pop()
    }

    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    }

    fetch('/add-artist', config)

    button.classList.add('carousel__button--clicked')
    button.innerText = "Following"
  })
})()