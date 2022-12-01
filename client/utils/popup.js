const popup = (url) => {
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  let innWidth = 0
  if (window.innerWidth) {
    innWidth = window.innerWidth
  } else if (document.documentElement.clientWidth) {
    innWidth = document.documentElement.clientWidth
  } else {
    innWidth = screen.width
  }

  let innHeight = ''
  if (window.innerHeight) {
    innHeight = window.innerHeight
  } else if (document.documentElement.clientHeight) {
    innHeight = document.documentElement.clientHeight
  } else {
    innHeight = screen.height
  }

  const sizeWidth = 650
  const sizeHeight = 650
  const left = innWidth / 2 - sizeWidth / 2 + dualScreenLeft
  const top = innHeight / 2 - sizeHeight / 2 + dualScreenTop

  const newWindow = window.open(
    url,
    'popup',
    `scrollbars=yes, width=${sizeWidth}, height=${sizeHeight}, top=${+top}, left=${left}, titlebar=no`
  )

  newWindow.focus()
}

export default popup