importScripts('../app/libs/components/threads/threads.js');

var panels = {};
var effect = '';
var current, future;


function getPanelByUUID(uuid) {
  Object.keys(panels).forEach(function(key) {
    if (panels[key] === uuid) {
      return key;
    }
  });
}

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function guuid() {
  // then to call it, plus stitch in '4' in the third group
  var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
  return guid;
}

var service = threads.service('navigation-service')
  .method('updateCurrent', function(currentPanel) {
    current = currentPanel;
  })
  // Devuelvo un UUID para que establecer un canal de comunicación
  .method('register', function(alias) {
    var uuid = guuid();
    panels[alias] = uuid;
    console.log(JSON.stringify(panels));
    return uuid;
  })
  // Indico que quiero navegar a '____' con efecto '_____'
  // params
  // - to
  // - effect
  .method('exitingstart', function(uuid, params) {
    console.log('Queremos ir a ' + params.destination);
    console.log('Su UUID es  ' + panels[params.destination]);
    future = params.destination;
    console.log('Con el effecto ' + params.effect);
    effect = params.effect;
    console.log('Con los parametros ' + JSON.stringify(params.params));
    service.broadcast('enteringstart', {
      uuid: panels[params.destination],
      params: params.params
    });
  })
  .method('exitingend', function(uuid, params) {
    service.broadcast('navigate', {
      from: current,
      to: future,
      effect: effect
    });
  })


  .method('waitforevent', function(param) {
    setTimeout(function() {
      console.log('Sending "pepito" event from service');
      service.broadcast('pepito');
    }, 1000)
  });
