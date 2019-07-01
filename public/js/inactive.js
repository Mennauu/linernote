(function () {
  const inactive = document.querySelector('.navigation__tab--inactive')
  const message = document.querySelector('.inactive-message')
  inactive.addEventListener('click', () => {
    message.classList.add('visible')
    setTimeout(() => {
      message.classList.remove('visible')
    }, 3000)
  })
})()