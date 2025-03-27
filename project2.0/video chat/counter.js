export function setupCounter(element, display) {
  let counter = 0
  const setCounter = (count) => {
    counter = count
    display.textContent = counter
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}