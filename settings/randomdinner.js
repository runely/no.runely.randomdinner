// a method named 'onHomeyReady' must be present in your code
function onHomeyReady (Homey) {
  // Tell Homey we're ready to be displayed
  Homey.ready()

  // buttons
  const saveElement = document.getElementById('save')

  // vars
  const predefinedFood = 'predefinedFood'
  const predefinedNonsense = 'predefinedNonsense'
  const predefinedToiletWords = 'predefinedToiletWords'
  const predefinedCookingMethods = 'predefinedCookingMethods'
  const ownFood = 'ownFood'
  const ownNonsense = 'ownNonsense'
  const ownToiletWords = 'ownToiletWords'

  Homey.get(predefinedFood, (err, predefined) => {
    if (err) return Homey.alert(err)
    doGet(predefined, predefinedFood)
  })

  Homey.get(predefinedNonsense, (err, predefined) => {
    if (err) return Homey.alert(err)
    doGet(predefined, predefinedNonsense)
  })

  Homey.get(predefinedToiletWords, (err, predefined) => {
    if (err) return Homey.alert(err)
    doGet(predefined, predefinedToiletWords)
  })

  Homey.get(predefinedCookingMethods, (err, predefined) => {
    if (err) return Homey.alert(err)
    doGet(predefined, predefinedCookingMethods)
  })
  
  Homey.get(ownFood, (err, own) => {
    if (err) return Homey.alert(err)
    doGet(own, ownFood)
  })

  Homey.get(ownNonsense, (err, own) => {
    if (err) return Homey.alert(err)
    doGet(own, ownNonsense)
  })

  Homey.get(ownToiletWords, (err, own) => {
    if (err) return Homey.alert(err)
    doGet(own, ownToiletWords)
  })

  // save settings
  saveElement.addEventListener('click', function (e) {
    Homey.set(ownFood, doSave(ownFood), function (err) {
      if (err) return Homey.alert(err)
    })

    Homey.set(ownNonsense, doSave(ownNonsense), function (err) {
      if (err) return Homey.alert(err)
    })

    Homey.set(ownToiletWords, doSave(ownToiletWords), function (err) {
      if (err) return Homey.alert(err)
    })

    Homey.alert(Homey.__('settings.saved_alert'), 'info')
  })
}

function doGet(value, id) {
  if (value) {
    document.getElementById(id).value = value.join('\n')
  }
}

function doSave(id) {
  return document.getElementById(id).value.split('\n')
}
