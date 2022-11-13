// a method named 'onHomeyReady' must be present in your code
function onHomeyReady (Homey) {
  // Tell Homey we're ready to be displayed
  Homey.ready()

  // buttons
  const saveElement = document.getElementById('save')

  Homey.get('ownFood', (err, own) => {
    if (err) return Homey.alert(err)
    getOwnFood(own)
  })

  Homey.get('ownNonsense', (err, own) => {
    if (err) return Homey.alert(err)
    getOwnNonsense(own)
  })

  Homey.get('ownToiletWords', (err, own) => {
    if (err) return Homey.alert(err)
    getOwnToiletWords(own)
  })

  // save settings
  saveElement.addEventListener('click', function (e) {
    Homey.set('ownFood', saveOwnFood(), function (err) {
      if (err) return Homey.alert(err)
    })

    Homey.set('ownNonsense', saveOwnNonsense(), function (err) {
      if (err) return Homey.alert(err)
    })

    Homey.set('ownToiletWords', saveOwnToiletWords(), function (err) {
      if (err) return Homey.alert(err)
    })

    Homey.alert(Homey.__('settings.saved_alert'), 'info')
  })
}

function getOwnFood (own) {
  document.getElementById('ownFood').value = own.join('\n')
}

function getOwnNonsense (own) {
  document.getElementById('ownNonsense').value = own.join('\n')
}

function getOwnToiletWords (own) {
  document.getElementById('ownToiletWords').value = own.join('\n')
}

function saveOwnFood () {
  return document.getElementById('ownFood').value.split('\n')
}

function saveOwnNonsense () {
  return document.getElementById('ownNonsense').value.split('\n')
}

function saveOwnToiletWords () {
  return document.getElementById('ownToiletWords').value.split('\n')
}
