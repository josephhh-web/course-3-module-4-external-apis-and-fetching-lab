// index.js
const weatherApi = 'https://api.weather.gov/alerts/active?area='

async function getFederalAddress(state) {
  const response = await fetch(`${weatherApi}${state}`)
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
  return response.json()
}

function initializeWeatherApp() {
  const button = document.querySelector('#fetch-alerts')
  if (!button || button.dataset.bound === 'true') return
  button.dataset.bound = 'true'

  const showError = (message) => {
    const errorMessage = document.querySelector('#error-message')
    errorMessage.textContent = message
    errorMessage.classList.remove('hidden')
  }

  const clearError = () => {
    const errorMessage = document.querySelector('#error-message')
    errorMessage.textContent = ''
    errorMessage.classList.add('hidden')
  }

  button.addEventListener('click', async () => {
    const input = document.querySelector('#state-input')
    const alertsDisplay = document.querySelector('#alerts-display')
    const state = input.value.trim().toUpperCase()
    input.value = ''
    clearError()
    alertsDisplay.innerHTML = ''

    if (!state) return showError('Please enter a valid state abbreviation.')

    try {
      const data = await getFederalAddress(state)
      alertsDisplay.textContent = `${data.title}: ${data.features.length}`
      data.features.forEach(({ properties }) => {
        if (properties?.headline) {
          const paragraph = document.createElement('p')
          paragraph.textContent = properties.headline
          alertsDisplay.appendChild(paragraph)
        }
      })
    } catch (error) {
      showError(error.message)
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWeatherApp)
} else {
  initializeWeatherApp()
}