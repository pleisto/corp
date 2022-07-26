export function isMobileDevice() {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1
}

export function easeInOutCubic(
  currentTime: number,
  startValue: number,
  changeInValue: number,
  duration: number
): number {
  const time = currentTime / duration - 1
  const timeCubic = time * time * time
  return changeInValue * (timeCubic + 1) + startValue
}

export function animatedScrollTo(scrollTo: number, duration: number, callback?: () => void) {
  const scrollFrom = window.scrollY || window.pageYOffset || 0
  const scrollDiff = scrollTo - scrollFrom
  let currentTime = 0
  const increment = 20

  ;(function animateScroll() {
    currentTime += increment
    const newScrollPos = easeInOutCubic(currentTime, scrollFrom, scrollDiff, duration)

    window.scrollTo(0, newScrollPos)
    if (currentTime > duration) {
      callback?.()
      return
    }

    setTimeout(animateScroll, increment)
  })()
}
