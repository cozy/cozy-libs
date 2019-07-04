export const hideNavBar = () => {
  document.querySelector('[role="application"] aside').style.display = 'none'
}

export const showNavBar = () => {
  document.querySelector('[role="application"] aside').style.display = 'block'
}
