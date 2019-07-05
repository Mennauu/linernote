(function () {
  const image = document.querySelector('.carousel__image').src

  const mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,

    pagination: {
      el: '.swiper-pagination',
    }
  })

  fitty(".carousel__name", {
    minSize: 40,
    maxSize: 56,
    multiLine: true
  })
})()