(function () {
  const feed = document.querySelector('.feed')

  for (let i = feed.children.length; i >= 0; i--) {
    feed.appendChild(feed.children[Math.random() * i | 0])
  }
})()