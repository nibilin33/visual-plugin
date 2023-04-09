export const getLocalGlobalSettings = () => {
    return JSON.parse(window.localStorage.getItem('heronHandoff.settings'))
}
  
export const setLocalGlobalSettings = (settings) => {
    window.localStorage.setItem('heronHandoff.settings', JSON.stringify(filterLocalizedSettings(settings)))
}