(function () {
  const el = document.querySelector('fun-background')
  const arr = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
  setInterval(() => {
    let i = parseInt(el.getAttribute('num-prints'))
    if (i === 9)
      el.setAttribute('chars', arr[Math.floor(Math.random() * 35)])
    el.setAttribute('num-prints', i > 5 ? --i : 9)
  }, 450)
})()

