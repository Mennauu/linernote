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
  const filterIcon = document.querySelector('.filter__button--icon')
  filterButton.addEventListener('click', () => {
    if (filter.classList.contains('visible')) {
      filter.classList.remove('visible')
      filterIcon.src = "/images/filter.svg"
    } else {
      filter.classList.add('visible')
      filterIcon.src = "/images/filter-check.svg"
    }
  })
})()