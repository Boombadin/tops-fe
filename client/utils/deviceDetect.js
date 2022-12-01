export function isDesktopSmall() {
  return window.innerWidth > 991 && window.innerWidth < 1240
}

export function isDesktop() {
  return window.innerWidth > 991
}

export function isTablet() {
  return window.innerWidth < 991
}

export function isMobile() {
  return window.innerWidth > 460
}
