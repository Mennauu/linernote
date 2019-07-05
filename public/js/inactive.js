(function () {
  const inactive = document.querySelector('.navigation__tab--inactive')
  const message = document.querySelector('.inactive-message')
  inactive.addEventListener('click', () => {
    message.classList.add('visible')
    setTimeout(() => {
      message.classList.remove('visible')
    }, 3000)
  })

  const filter = document.querySelector('.filter')
  const filterButton = document.querySelector('.filter__button')
  filterButton.addEventListener('click', () => {
    if (filter.classList.contains('visible')) {
      filter.classList.remove('visible')
    } else {
      filter.classList.add('visible')
    }
  })
})()